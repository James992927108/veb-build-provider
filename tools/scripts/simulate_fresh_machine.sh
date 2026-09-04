#!/bin/bash
# VEB Build Provider — 模擬「全新機器」的部署流程
#
# 在一個乾淨的 ubuntu:24.04 容器裡，以一般使用者（有 sudo）跑一遍新人上機會做的事：
#   1. 裝 git、clone 專案
#   2. 跑 extension 的 env_discovery.py（此時還沒有 AMI tools）
#   3. 跑 docker_install.sh（驗證自動安裝路徑）
#   4. 列出這台「新機器」還缺什麼
#
# ── 這個模擬能證明什麼、不能證明什麼 ──────────────────────────────────────
# 能：apt 安裝路徑可用、腳本在缺東西時的行為與錯誤訊息、clone 流程、
#     env_discovery 在沒有 AMI tools 時的 fallback 行為。
# 不能：docker daemon 實際啟動 —— 純容器沒有 systemd，`systemctl enable --now
#     docker` 無從驗證，那需要真正的 VM。VS Code 與 extension 的 UI 流程同理。
#     AMI BuildTools 沒有公開下載來源（NDA），新機器一定要用複製的。
#
# 用法:
#   ./simulate_fresh_machine.sh [extension-repo-path]
set -uo pipefail

EXT_REPO="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
IMAGE="ubuntu:24.04"

RED=$'\033[0;31m'; GRN=$'\033[0;32m'; YEL=$'\033[1;33m'; NC=$'\033[0m'
info() { echo "${GRN}[sim]${NC} $*"; }
warn() { echo "${YEL}[sim]${NC} $*"; }
err()  { echo "${RED}[sim]${NC} $*" >&2; }

command -v docker >/dev/null 2>&1 || { err "本機需要 docker 才能跑模擬。"; exit 1; }

CLONE_BRANCH="$(git -C "$EXT_REPO" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"

# 若來源是 git worktree，它的 .git 是一個指向主 repo 的檔案而非目錄，
# 單獨掛進容器是 clone 不了的。改用主 working tree 當來源 —— 分支物件本來就
# 存在共用的物件庫裡，clone 時指定分支即可拿到目前這份程式碼。
if [[ -f "$EXT_REPO/.git" ]]; then
    COMMON_DIR="$(git -C "$EXT_REPO" rev-parse --path-format=absolute --git-common-dir 2>/dev/null)"
    if [[ -n "$COMMON_DIR" ]]; then
        MAIN_TREE="$(dirname "$COMMON_DIR")"
        warn "來源是 git worktree，改以主 repo 為 clone 來源：$MAIN_TREE（分支 $CLONE_BRANCH）"
        EXT_REPO="$MAIN_TREE"
    fi
fi

info "模擬來源 extension repo: $EXT_REPO"
info "基底映像: $IMAGE（乾淨環境，無 docker、無 AMI tools）"
echo

# --privileged 讓容器內能嘗試安裝 docker；仍然沒有 systemd，daemon 不會真的起來。
docker run --rm -i \
    -v "$EXT_REPO:/mnt/ext-repo:ro" \
    -e DEBIAN_FRONTEND=noninteractive \
    -e CLONE_BRANCH="$CLONE_BRANCH" \
    "$IMAGE" bash -s <<'INNER'
set -uo pipefail
G=$'\033[0;32m'; Y=$'\033[1;33m'; R=$'\033[0;31m'; N=$'\033[0m'
step() { echo; echo "${G}=== $* ===${N}"; }
ok()   { echo "  ${G}OK${N}    $*"; }
miss() { echo "  ${R}缺${N}    $*"; }
note() { echo "  ${Y}注意${N}  $*"; }

# tw 鏡像：預設的 archive.ubuntu.com 在此網路環境極慢且索引常抓不到
sed -i 's|http://archive.ubuntu.com/ubuntu|http://tw.archive.ubuntu.com/ubuntu|g' \
    /etc/apt/sources.list.d/ubuntu.sources 2>/dev/null || true

step "0. 基準：這台新機器現在有什麼"
for c in git python3 docker make gcc java; do
    command -v "$c" >/dev/null 2>&1 && ok "$c 已存在" || miss "$c"
done

step "1. 建立一般使用者（有 sudo），模擬真實開發機"
apt-get update -qq >/dev/null 2>&1
apt-get install -y -qq sudo git python3 >/dev/null 2>&1
useradd -m -s /bin/bash dev
echo 'dev ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/dev
ok "使用者 dev 建立完成（NOPASSWD sudo，模擬已授權的機器）"
command -v git >/dev/null && ok "git $(git --version | awk '{print $3}')"
command -v python3 >/dev/null && ok "python3 $(python3 -V | awk '{print $2}')"

step "2. clone extension repo"
# 掛進來的 repo 屬於別的 UID，git 預設會擋；新機器 clone 內部 GitLab 不會有這問題，
# 這行只是為了讓模擬能進行。
su - dev -c 'git config --global --add safe.directory /mnt/ext-repo'
BR="${CLONE_BRANCH:-}"
if [ -n "$BR" ]; then
    su - dev -c "git clone -q -b '$BR' /mnt/ext-repo ~/veb-build-provider 2>&1 | tail -2" || true
else
    su - dev -c 'git clone -q /mnt/ext-repo ~/veb-build-provider 2>&1 | tail -2' || true
fi
if su - dev -c 'test -d ~/veb-build-provider/tools/scripts'; then
    ok "clone 成功: ~/veb-build-provider"
    su - dev -c 'cd ~/veb-build-provider && git log --oneline -1' | sed 's/^/        /'
else
    miss "clone 失敗"
fi

step "3. 跑 env_discovery.py（此時機器上還沒有 AMI BuildTools）"
su - dev -c 'cd ~/veb-build-provider/tools/scripts && python3 env_discovery.py --json --workspace /tmp --veb Standard.veb' \
    > /tmp/disc.json 2>/tmp/disc.err
if [ -s /tmp/disc.json ]; then
    ok "env_discovery 有輸出（會落到 fallback 路徑）："
    sed 's/^/        /' /tmp/disc.json
    note "TOOLS_DIR 指向的路徑在這台機器上並不存在 —— 這正是新機器的實際狀態。"
    note "env_discovery 只做偵測，不會下載 AMI BuildTools。"
else
    miss "env_discovery 失敗"; sed 's/^/        /' /tmp/disc.err
fi

step "4. 跑 docker_install.sh（自動安裝 docker）"
su - dev -c 'cd ~/veb-build-provider/tools/scripts && bash docker_install.sh' 2>&1 | sed 's/^/        /'
rc=${PIPESTATUS[0]}
echo "        exit=$rc"
if command -v docker >/dev/null 2>&1; then
    ok "docker CLI 已安裝: $(docker --version 2>/dev/null || echo '版本查詢失敗')"
else
    miss "docker CLI 未安裝"
fi
note "純容器沒有 systemd，daemon 起不來是預期的；真實機器上 systemctl 會處理。"

step "5. 這台新機器還缺什麼才能 build BIOS"
miss "AMI Aptio BuildTools（NDA 授權，無公開下載來源）"
echo "        -> 必須從既有機器複製 ~/Desktop/VEB/Linux_x64_Aptio_5.x_TOOLS_XX/"
miss "ARM cross toolchain (arm-gnu-toolchain-12.3.rel1)"
echo "        -> 同樣放到 ~/Desktop/VEB/toolchains/"
miss "BIOS 專案原始碼（GBNvl72 / VRNvl，內部 GitLab / Gerrit）"
note "以上就緒後，開 VS Code 裝 extension、F8 選 .veb、按 build 即可。"
note "docker image 與其餘宿主相依都由 extension 自動處理。"
INNER

echo
info "模擬結束。"
