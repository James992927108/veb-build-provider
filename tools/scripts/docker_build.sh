#!/bin/bash
# VEB Build Provider — 容器化 build 執行器
#
# ⚠ image 內含 NDA 授權的 AMI BuildTools。本腳本刻意不提供任何 push /
#   registry tag 功能，image tag 也不帶 registry 前綴。
#
# 由 tasks.json 呼叫，設定經環境變數帶入（全部由 extension 產生）：
#   VEB                     VEB 專案名（例：Standard / GB300Standard）
#   VEB_DOCKER_IMAGE        image tag
#   VEB_HOST_VEB_ROOT       宿主 VEB 根目錄，同時是 docker build 的 context
#   VEB_DOCKER_AUTOBUILD    1 = image 不存在時自動建置
#   VEB_DOCKER_FALLBACK     1 = docker 不可用時回落到宿主 build（mode=auto）
#
# 用法: DockerBuild.sh <make 的參數...>
#   DockerBuild.sh                # 增量
#   DockerBuild.sh rebuild        # 全新
#   DockerBuild.sh clean
set -uo pipefail

MAKE_ARGS="$*"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VSCODE_DIR="$PROJECT_DIR/.vscode"

IMAGE="${VEB_DOCKER_IMAGE:-veb-bios-build:24.04}"
HOST_VEB_ROOT="${VEB_HOST_VEB_ROOT:-}"
AUTOBUILD="${VEB_DOCKER_AUTOBUILD:-1}"
FALLBACK="${VEB_DOCKER_FALLBACK:-1}"
VEB_NAME="${VEB:-Standard}"

RED=$'\033[0;31m'; GRN=$'\033[0;32m'; YEL=$'\033[1;33m'; NC=$'\033[0m'
info() { echo "${GRN}[docker]${NC} $*"; }
warn() { echo "${YEL}[docker]${NC} $*"; }
err()  { echo "${RED}[docker]${NC} $*" >&2; }

# 回落到宿主 build。mode=auto 且 docker 不可用時走這條，
# 讓沒裝 docker 的人不會因為這個功能而不能 build。
fallback_to_host() {
    local reason="$1"
    if [[ "$FALLBACK" != "1" ]]; then
        err "$reason"
        err "docker mode = always，不回落。請修正後重試，或把 vebBuild.docker.mode 改成 auto。"
        exit 1
    fi
    warn "$reason"
    warn "回落到宿主環境 build。"
    local env_script="$VSCODE_DIR/PrepareEnvLinuxScript.sh"
    [[ -f "$env_script" ]] || { err "找不到 $env_script"; exit 1; }
    # shellcheck disable=SC1090
    source "$env_script"
    local log="$PROJECT_DIR/Build-${VEB_NAME}-$(date +%Y%m%d-%H%M%S).log"
    make $MAKE_ARGS 2>&1 | tee "$log"
    exit "${PIPESTATUS[0]}"
}

command -v docker >/dev/null 2>&1 || fallback_to_host "找不到 docker 指令。"
docker info >/dev/null 2>&1 || fallback_to_host "docker daemon 無法連線（可能未啟動，或使用者不在 docker group）。"

# ── image 準備 ───────────────────────────────────────────────────────────────
if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
    if [[ "$AUTOBUILD" != "1" ]]; then
        fallback_to_host "image $IMAGE 不存在，且未啟用自動建置。"
    fi
    [[ -n "$HOST_VEB_ROOT" && -d "$HOST_VEB_ROOT" ]] \
        || fallback_to_host "image $IMAGE 不存在，且無法定位 VEB 根目錄以建置。"

    DOCKERFILE="$HOST_VEB_ROOT/.veb-docker/Dockerfile"
    [[ -f "$DOCKERFILE" ]] \
        || fallback_to_host "找不到 $DOCKERFILE（應由 extension 的 init task 產生）。"

    info "image $IMAGE 不存在，開始建置（context: $HOST_VEB_ROOT，約需數分鐘）"
    info "⚠ 此 image 含 NDA 授權工具，請勿 push。"
    if ! docker build -f "$DOCKERFILE" -t "$IMAGE" "$HOST_VEB_ROOT"; then
        fallback_to_host "image 建置失敗。"
    fi
    info "image 建置完成。"
fi

# ── 執行 build ───────────────────────────────────────────────────────────────
# 專案掛在與宿主相同的絕對路徑：log 與 Build/ 產物落點跟宿主 build 完全一致。
# --user 讓產物歸屬宿主使用者而非 root。
# /etc/localtime 唯讀掛入：容器預設 UTC，否則 log 檔名時間戳會與宿主差數小時。
ENV_SCRIPT_REL=".vscode/PrepareEnvDockerScript.sh"
[[ -f "$PROJECT_DIR/$ENV_SCRIPT_REL" ]] \
    || fallback_to_host "找不到 $ENV_SCRIPT_REL（應由 extension 的 init task 產生）。"

info "image: $IMAGE"
info "專案: $PROJECT_DIR"
info "VEB=$VEB_NAME  make ${MAKE_ARGS:-（增量）}"

LOCALTIME_MOUNT=()
[[ -e /etc/localtime ]] && LOCALTIME_MOUNT=(-v /etc/localtime:/etc/localtime:ro)

docker run --rm -i \
    --user "$(id -u):$(id -g)" \
    "${LOCALTIME_MOUNT[@]}" \
    -v "$PROJECT_DIR:$PROJECT_DIR" \
    -w "$PROJECT_DIR" \
    -e HOME=/tmp/vebhome \
    "$IMAGE" \
    bash -c "
        mkdir -p /tmp/vebhome
        set -e
        export VEB='$VEB_NAME'
        source '$ENV_SCRIPT_REL'
        LOG=\"Build-${VEB_NAME}-\$(date +%Y%m%d-%H%M%S).log\"
        echo \"LOG=\$LOG\"
        # 這裡刻意不讓 set -e 生效於 make：否則 make 失敗時腳本立刻中止，
        # 跑不到退出碼回報與 log 尾段，失敗原因就被吞掉了。
        set +e
        make $MAKE_ARGS > \"\$LOG\" 2>&1
        RC=\$?
        set -e
        echo \"MAKE_EXIT=\$RC\"
        tail -25 \"\$LOG\"
        exit \$RC
    "
RC=$?
if [[ $RC -eq 0 ]]; then
    info "build 成功"
else
    err "build 失敗（exit $RC）"
fi
exit $RC
