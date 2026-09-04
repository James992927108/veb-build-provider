# BIOS build environment — GB (TOOLS_54) 與 VR (TOOLS_59) 共用
#
# ⚠ 內部使用，禁止 push
#   本 image 內含 AMI Aptio V BuildTools（NDA 授權）。只能在內部機器本機 build，
#   不得推送到任何 registry（含私有）。extension 不提供任何 push 功能。
#
# build context 必須是 VEB 根目錄（含 Linux_x64_Aptio_5.x_TOOLS_* 與 toolchains/）。
# 由 extension 的 docker_build.sh 自動帶入，不需手動指定。
#
# 工具烘在固定路徑 /opt/veb，與宿主的 VEB 目錄位置無關 —— 同一份 image
# 在不同人的機器上都能用。容器用的環境腳本由 extension 產生，指向 /opt/veb。
FROM ubuntu:24.04

LABEL org.opencontainers.image.title="veb-bios-build" \
      org.opencontainers.image.description="AMI Aptio V BIOS build env (GB/VR) - INTERNAL ONLY, DO NOT PUSH" \
      internal.only="true" \
      do.not.push="true"

ENV DEBIAN_FRONTEND=noninteractive
ENV VEB_ROOT=/opt/veb

# ubuntu:24.04 預設走 archive.ubuntu.com。實測在台灣只有 ~6kB/s，且 noble /
# noble-updates 的 InRelease 會連線失敗 —— 症狀是 main 的套件全部「no installation
# candidate」，看起來像套件不存在，其實是索引沒抓到。
# APT_MIRROR 可在 build 時覆寫成當地鏡像。
ARG APT_MIRROR=http://tw.archive.ubuntu.com/ubuntu
RUN set -eux; \
    for f in /etc/apt/sources.list.d/ubuntu.sources /etc/apt/sources.list; do \
        if [ -f "$f" ]; then \
            sed -i "s|http://archive.ubuntu.com/ubuntu|${APT_MIRROR}|g" "$f"; \
        fi; \
    done; \
    printf 'Acquire::Retries "5";\nAcquire::http::Timeout "30";\n' > /etc/apt/apt.conf.d/99retry

# cpp 明列而非依賴 build-essential 間接帶入 —— NVIDIA imagegen 直接呼叫 /usr/bin/cpp
# 預處理 DTS。宿主從 22.04 升 24.04 時曾發生套件仍是 ii 但該檔案遺失。
#
# python3-yaml 是 GB 必要的：Nvidia/GraceFwBinPkg/Binaries/imagegen.py 用系統 python3
# 執行並 import yaml。（VR 走 build 過程自建的 .venv，不受影響；pyfdt 隨專案樹附帶。）
#
# openjdk-8 給 GB(TOOLS_54)，openjdk-21 給 VR(TOOLS_59)，兩者必須共存。
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential cpp make bc \
        gawk device-tree-compiler p7zip-full \
        python3 python3-pip python3-venv \
        python3-requests python3-yaml python3-cryptography \
        openjdk-8-jdk openjdk-21-jdk \
        git curl ca-certificates file rsync xz-utils uuid-dev \
        bind9-dnsutils locales \
    && rm -rf /var/lib/apt/lists/*

# 整個 VEB 根目錄一次複製。刻意不用 COPY Linux_x64_Aptio_5.x_TOOLS_* /opt/veb/ ——
# 萬用字元對到多個目錄時，Docker 會把各目錄的「內容」合併進目的地而非保留目錄本身，
# 三個 TOOLS 版本會互相覆蓋。且 TOOLS 版本號因機器而異，無法寫死。
# 大檔由 context 根目錄的 .dockerignore 排除（extension 自動產生）。
COPY . /opt/veb/

# AMI tools 相依舊版 OpenSSL。noble 的 archive 沒有 libssl1.1，用 VEB 目錄隨附的
# jammy deb。若該檔不存在就略過 —— 不是所有 TOOLS 版本都需要。
#
# 同時對應原 setup-build-environment.sh 的 setup_tools_overrides()。
# chmod 777 沿用原腳本作法，讓任意 UID 執行的 build 都能寫入 Tools 目錄。
RUN set -eux; \
    if ls /opt/veb/libssl1.1_*.deb >/dev/null 2>&1; then \
        dpkg -i /opt/veb/libssl1.1_*.deb; \
    fi; \
    for t in /opt/veb/Linux_x64_Aptio_5.x_TOOLS_*/Tools; do \
        [ -d "$t" ] || continue; \
        mkdir -p "$t/Overrides"; \
        cp /usr/bin/openssl "$t/Overrides/"; \
    done; \
    chmod -R 777 /opt/veb/Linux_x64_Aptio_5.x_TOOLS_* 2>/dev/null || true; \
    if [ -d /opt/veb/toolchains ]; then chmod -R a+rX /opt/veb/toolchains; fi

# AMISVN JavaHL（若該 TOOLS 版本有附）。缺少不影響 BIOS build 本身。
RUN set -eux; \
    for z in /opt/veb/Linux_x64_Aptio_5.x_TOOLS_*/VisualeBios/AMISVN_JavaHL_Libraries.zip; do \
        [ -f "$z" ] || continue; \
        mkdir -p /usr/local/lib/AmiSvnlib; \
        7z x "$z" -r -o/usr/local/lib/AmiSvnlib/ -y >/dev/null; \
    done; \
    if [ -d /usr/local/lib/AmiSvnlib ]; then \
        echo /usr/local/lib/AmiSvnlib > /etc/ld.so.conf.d/amisvn.conf; \
        ldconfig; \
    fi

# 容器以 --user $(id -u):$(id -g) 執行，讓 build 產物歸屬宿主使用者而非 root。
# 該 UID 在 image 裡沒有 passwd 紀錄，因此 HOME 由 docker_build.sh 指到可寫位置。
RUN locale-gen en_US.UTF-8 || true
ENV LANG=en_US.UTF-8

CMD ["/bin/bash"]
