#!/bin/bash
# VEB Build Provider — 自動安裝 Docker
#
# 由 docker_build.sh 在偵測不到可用的 docker 時呼叫。設計成 idempotent：
# 已經裝好且能用時立刻回傳 0，不做任何事。
#
# 退出碼:
#   0  docker 現在可用（可能本來就可用，也可能剛裝好）
#   1  安裝失敗或環境不支援 —— 呼叫端據此決定回落或報錯
#   2  已安裝但需要重新登入才能生效（使用者剛被加進 docker group）
#
# 需要 sudo。在 VS Code 的 task 終端機裡會正常跳出密碼提示；
# 非互動情境（CI、背景執行）若沒有 NOPASSWD 就會失敗，這是預期行為。
set -uo pipefail

RED=$'\033[0;31m'; GRN=$'\033[0;32m'; YEL=$'\033[1;33m'; NC=$'\033[0m'
info() { echo "${GRN}[docker-install]${NC} $*"; }
warn() { echo "${YEL}[docker-install]${NC} $*"; }
err()  { echo "${RED}[docker-install]${NC} $*" >&2; }

have_docker_cli()  { command -v docker >/dev/null 2>&1; }
daemon_reachable() { docker info >/dev/null 2>&1; }
in_docker_group()  { id -nG 2>/dev/null | tr ' ' '\n' | grep -qx docker; }
member_of_docker() { getent group docker 2>/dev/null | grep -qw "$(id -un)"; }

# ── 已經能用就直接結束 ───────────────────────────────────────────────────────
if have_docker_cli && daemon_reachable; then
    info "docker 已可用，略過安裝。"
    exit 0
fi

# ── 環境檢查 ────────────────────────────────────────────────────────────────
if ! command -v apt-get >/dev/null 2>&1; then
    err "自動安裝目前只支援 Debian/Ubuntu（找不到 apt-get）。"
    err "請手動安裝 docker 後重試，或把 vebBuild.docker.mode 設為 never。"
    exit 1
fi

SUDO=""
if [[ "$(id -u)" -ne 0 ]]; then
    command -v sudo >/dev/null 2>&1 || { err "需要 root 權限但找不到 sudo。"; exit 1; }
    SUDO="sudo"
    if ! sudo -n true 2>/dev/null; then
        warn "接下來需要 sudo 權限安裝 docker，請在下方輸入密碼。"
        warn "（若這是非互動執行，會在此失敗 —— 請改為手動安裝。）"
    fi
fi

# ── 安裝 ────────────────────────────────────────────────────────────────────
# 用 Ubuntu archive 的 docker.io 而非 Docker 官方 docker-ce repo：
# 少一組第三方 apt 來源要維護，安全更新跟著 distro 走，對內部 build 機夠用。
if ! have_docker_cli; then
    info "安裝 docker.io ..."
    if ! $SUDO apt-get update; then
        err "apt-get update 失敗。"
        exit 1
    fi
    if ! $SUDO apt-get install -y docker.io; then
        err "docker.io 安裝失敗。"
        exit 1
    fi
    info "docker.io 安裝完成。"
else
    info "docker CLI 已存在，檢查 daemon 與權限。"
fi

# ── 啟動 daemon ─────────────────────────────────────────────────────────────
if command -v systemctl >/dev/null 2>&1; then
    if ! systemctl is-active --quiet docker; then
        info "啟動並設定 docker 服務開機自啟 ..."
        $SUDO systemctl enable --now docker || warn "systemctl enable --now docker 失敗，繼續檢查。"
    fi
else
    warn "找不到 systemctl（容器內或非 systemd 環境），跳過服務啟動。"
fi

# ── 權限 ────────────────────────────────────────────────────────────────────
# 加進 docker group 才能不用 sudo 跑 docker。新的群組成員資格不會套用到
# 已經存在的 shell，需要重新登入 —— 呼叫端會用 sg 在當次執行繞過這點。
if ! member_of_docker; then
    info "把 $(id -un) 加入 docker group ..."
    $SUDO usermod -aG docker "$(id -un)" || warn "usermod 失敗，之後可能需要 sudo 才能跑 docker。"
fi

# ── 驗證 ────────────────────────────────────────────────────────────────────
if daemon_reachable; then
    info "docker 已就緒。"
    exit 0
fi

if member_of_docker && ! in_docker_group; then
    warn "docker 已安裝，但目前的登入 session 還沒套用 docker 群組。"
    warn "本次 build 會以 sg 暫時套用；請在方便時重新登入讓它永久生效。"
    exit 2
fi

err "docker 安裝後仍無法連上 daemon。"
err "請檢查: systemctl status docker"
exit 1
