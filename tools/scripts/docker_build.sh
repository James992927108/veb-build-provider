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
#   VEB_DOCKER_AUTOINSTALL  1 = 偵測不到 docker 時自動安裝（需要 sudo）
#   VEB_DOCKER_FALLBACK     1 = docker 仍不可用時回落到宿主 build（mode=auto）
#
# 用法: DockerBuild.sh <make 的參數...>
#   DockerBuild.sh                # 增量
#   DockerBuild.sh rebuild        # 全新
#   DockerBuild.sh clean
set -uo pipefail

SCRIPT_PATH="${BASH_SOURCE[0]}"
SCRIPT_ARGS=("$@")
MAKE_ARGS="$*"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VSCODE_DIR="$PROJECT_DIR/.vscode"

IMAGE="${VEB_DOCKER_IMAGE:-veb-bios-build:24.04}"
HOST_VEB_ROOT="${VEB_HOST_VEB_ROOT:-}"
AUTOBUILD="${VEB_DOCKER_AUTOBUILD:-1}"
AUTOINSTALL="${VEB_DOCKER_AUTOINSTALL:-1}"
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

docker_usable() { command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; }

# 偵測不到可用的 docker 時，先嘗試安裝再說。裝完若只差群組尚未生效，
# 用 sg 重新執行自己一次 —— 新的群組成員資格不會套用到已存在的 shell，
# 否則使用者得先登出登入才能 build，那就稱不上「自動」了。
ensure_docker() {
    docker_usable && return 0

    if [[ "$AUTOINSTALL" != "1" ]]; then
        return 1
    fi

    local installer="$VSCODE_DIR/DockerInstall.sh"
    if [[ ! -f "$installer" ]]; then
        warn "找不到 $installer，無法自動安裝。"
        return 1
    fi

    info "偵測不到可用的 docker，開始自動安裝（需要 sudo 權限）。"
    chmod +x "$installer" 2>/dev/null
    bash "$installer"
    local rc=$?

    case "$rc" in
        0) docker_usable && return 0; return 1 ;;
        2)
            # 已安裝、使用者也已在 docker group，但當前 shell 還沒套用。
            # 用 sg 重新執行一次本腳本；guard 變數避免無限遞迴。
            if [[ -n "${VEB_DOCKER_SG_REEXEC:-}" ]]; then
                warn "已透過 sg 重試過仍無法使用 docker。"
                return 1
            fi
            if ! command -v sg >/dev/null 2>&1; then
                warn "找不到 sg 指令，無法在本次 session 套用 docker 群組。"
                warn "請重新登入後再 build。"
                return 1
            fi
            info "以 docker 群組重新執行本次 build ..."
            export VEB_DOCKER_SG_REEXEC=1
            local quoted
            quoted="$(printf '%q ' "$SCRIPT_PATH" "${SCRIPT_ARGS[@]+"${SCRIPT_ARGS[@]}"}")"
            exec sg docker -c "$quoted"
            ;;
        *) return 1 ;;
    esac
}

ensure_docker || fallback_to_host "docker 不可用（未安裝、daemon 未啟動，或自動安裝失敗）。"

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

# 有 TTY 時才加 -t：VS Code 的 task 終端機有 pty，加了顏色與行緩衝才正常；
# 沒有 TTY 時硬加會直接失敗。不用 -i —— build 不需要 stdin，而且待會要把
# docker run 放到背景，背景行程去讀終端機 stdin 會收到 SIGTTIN 而被停住。
TTY_FLAG=()
[[ -t 1 ]] && TTY_FLAG=(-t)

# 具名容器，讓中斷時有辦法精準停掉它（同一專案可能同時有別的容器在跑）。
CONTAINER_NAME="veb-build-$(id -u)-$$"

stop_container() {
    docker kill "$CONTAINER_NAME" >/dev/null 2>&1 || true
}

# 中斷處理。這裡有兩個容易踩的點：
#
# 1. 容器內 PID 1 收不到預設訊號動作 —— 核心不對 PID 1 套用預設處理，所以
#    SIGINT 傳進去會被直接丟掉。實測 `docker run --init`（tini）也沒用：
#    tini 只把訊號轉給直接子行程 bash，而非互動模式的 bash 不會再往下傳給
#    它正在等待的 make。唯一可靠的做法是從宿主端 docker kill。
#
# 2. bash 在前景指令執行期間不會處理 trap，會延後到指令返回才跑 —— 而
#    docker run 正是那個不會返回的指令，等於 trap 永遠不觸發。因此把
#    docker run 丟到背景、用 wait 等待：wait 可被訊號打斷，trap 才會即時執行。
trap 'echo; warn "收到中斷訊號，正在停止容器 ..."; stop_container' INT TERM

docker run --rm "${TTY_FLAG[@]}" \
    --name "$CONTAINER_NAME" \
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
        # 用 tee 而非重導向到檔案：BIOS build 動輒十幾分鐘，輸出必須即時顯示在
        # VS Code 的 task 終端機，否則使用者只能盯著空畫面等。這也與宿主模式的
        # 行為一致（宿主用的就是 make 2>&1 | tee）。
        # 這裡刻意不讓 set -e 生效於 make：否則 make 失敗時腳本立刻中止，
        # 跑不到退出碼回報，失敗原因就被吞掉了。
        set +e
        make $MAKE_ARGS 2>&1 | tee \"\$LOG\"
        RC=\${PIPESTATUS[0]}
        set -e
        echo \"MAKE_EXIT=\$RC\"
        exit \$RC
    " </dev/null &
DOCKER_PID=$!

wait "$DOCKER_PID"
RC=$?
trap - INT TERM

# 被訊號打斷時 wait 回傳 128+signum。容器已由 trap 停掉，這裡只是把
# 「被中斷」與「build 真的失敗」在訊息上分開，不然使用者會以為是編譯錯誤。
if [[ $RC -gt 128 ]]; then
    stop_container
    err "build 已中斷（signal $((RC - 128))）"
elif [[ $RC -eq 0 ]]; then
    info "build 成功"
else
    err "build 失敗（exit $RC）"
fi
exit $RC
