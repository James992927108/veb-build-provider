# 容器化 BIOS Build

> ## ⚠ image 禁止 push
> image 內含 **AMI Aptio V BuildTools（NDA 授權）**。只能在內部機器本機 build，
> **不得推送到任何 registry（含私有）**。extension 刻意不提供 push 功能，
> 預設 tag `veb-bios-build:24.04` 也不帶 registry 前綴。

## 使用者要做什麼

裝好 VS Code 與本 extension，開啟專案，按 **F8** 跑 init task 選 `.veb` 檔，
然後照常按 build（`VebBuildTask`）。就這樣 —— 沒有額外步驟。

第一次 build 時若 image 不存在，`DockerBuild.sh` 會自動建置（數分鐘），之後直接重用。
**若機器上沒有 docker，會自動安裝**（`apt install docker.io`）。

### 自動安裝 docker 的兩個現實限制

**需要 sudo。** 安裝會在 build task 的終端機裡跳出密碼提示。這在互動使用下沒問題，
但非互動情境（CI、背景執行）若沒設 NOPASSWD 就會失敗 —— 屆時依 `mode` 決定回落或報錯。

**群組成員資格不會套用到已存在的 shell。** 安裝時會把使用者加進 `docker` group，
但既有的登入 session 不會立刻生效。`DockerBuild.sh` 會用 `sg docker` 重新執行自己一次
來繞過這點，所以**當次 build 不需要重新登入**；不過建議之後找時間登出登入一次，
讓後續所有終端機都自然帶有該群組。

安裝失敗時（不支援的發行版、沒有 sudo、daemon 起不來），`mode=auto` 會回落到宿主 build，
`mode=always` 則明確報錯。

## 為什麼要做這件事

2026-09-04 宿主從 Ubuntu 22.04 升到 24.04 後，`cpp` 套件的 dpkg 狀態仍是 `ii`，
但 `/usr/bin/cpp` 這個檔案在升級過程中消失了。NVIDIA 的 imagegen 用它預處理
MB1BCT / pinmux 的 DTS，於是 build 卡在 `CreateSpiImage`，錯誤訊息只有
`FileNotFoundError: 'cpp'`，跟真正的原因（distro 升級）完全看不出關聯。

這套環境對宿主的依賴本來就很脆弱，每跨一次 distro 都要重賭一次：

| 依賴 | 狀況 |
|---|---|
| `libssl1.1` | noble 的 archive 沒有，只能用 VEB 目錄隨附的 jammy deb 手動裝 |
| `libneon27-gnutls` | 24.04 起已從 archive 移除 |
| Java 8 **和** Java 21 | 必須同時存在（GB 用 8、VR 用 21） |
| `/usr/bin/cpp` | 被 imagegen 直接呼叫；套件 `ii` 不保證檔案還在 |
| `python3-yaml` | GB 的 `GraceFwBinPkg/Binaries/imagegen.py` 用系統 python3 import |

容器把這些全部釘住。

## 設定

| 設定 | 預設 | 說明 |
|---|---|---|
| `vebBuild.docker.mode` | `auto` | `auto` 有 docker 就用、沒有就回落宿主；`always` 一定走容器、缺條件時明確報錯；`never` 永遠走宿主 |
| `vebBuild.docker.image` | `veb-bios-build:24.04` | 本機 image tag |
| `vebBuild.docker.autoBuildImage` | `true` | image 不存在時自動建置 |
| `vebBuild.docker.autoInstall` | `true` | docker 不存在時自動安裝（`apt install docker.io`，需 sudo） |

## 命令

- **VEB: Build BIOS Docker Image** —— 手動重建 image（工具更新後用）
- **VEB: Check BIOS Docker Environment** —— 檢查容器內環境是否完整

## 產生的檔案

init task 會產生：

| 路徑 | 內容 |
|---|---|
| `<專案>/.vscode/PrepareEnvLinuxScript.sh` | 宿主環境（原有行為，不變） |
| `<專案>/.vscode/PrepareEnvDockerScript.sh` | 容器內環境，路徑指向 `/opt/veb` |
| `<專案>/.vscode/DockerBuild.sh` | 執行器（隨 extension 出貨的靜態檔） |
| `<VEB 根>/.veb-docker/Dockerfile` | image 定義 |
| `<VEB 根>/.dockerignore` | context 排除清單（已存在則不覆寫） |

## 設計要點

**image 內工具固定在 `/opt/veb`，與宿主的 VEB 目錄位置無關。**
宿主路徑因人而異，若直接沿用會讓 image 綁死在某台機器上。`toContainerEnv()`
負責把宿主 VEB 根前綴換成 `/opt/veb`，只換這一段，`JAVA_HOME` 之類的系統路徑不動。

**專案 bind mount 在與宿主相同的絕對路徑。**
log 與 `Build/` 產物落點跟宿主 build 完全一致，不需要另外找。

**以 `--user $(id -u):$(id -g)` 執行。**
產物歸屬宿主使用者，不會留下一堆 root-owned 檔案。該 UID 在 image 裡沒有
passwd 紀錄，因此 `HOME` 指到 `/tmp/vebhome`。

**`/etc/localtime` 唯讀掛入。**
容器預設 UTC，否則 build log 檔名的時間戳會與宿主差數小時，時序判讀容易出錯。
glibc 直接讀這個檔，所以不必在 image 裡裝 tzdata。

**Dockerfile 用 `COPY . /opt/veb/` 而非萬用字元。**
`COPY Linux_x64_Aptio_5.x_TOOLS_* /opt/veb/` 在對到多個目錄時，Docker 會把各目錄的
**內容**合併進目的地而非保留目錄本身，三個 TOOLS 版本會互相覆蓋。
且 TOOLS 版本號因機器而異，無法寫死。

## 目前的限制

`VebReleaseBuildTask` 與 `VebCustomBuildTask` 仍在宿主執行。
這兩個跑的是專案自己的腳本（`GB300_Release_Build.sh` / `CustomBuild.sh`），
內容因專案而異，貿然塞進容器風險較高。需要時再個別評估。

## 疑難排解

### `apt-get install` 說 build-essential 沒有候選版本

`ubuntu:24.04` 預設走 `archive.ubuntu.com`，在台灣實測只有 ~6 kB/s，且
`noble` / `noble-updates` 的 InRelease 直接連線失敗，只有 backports 抓到。
結果是 main 的套件全部「no installation candidate」，看起來像套件不存在，
實際上是索引沒抓到。

Dockerfile 已內建修正（改用 `tw.archive.ubuntu.com` + `Acquire::Retries`）。
實測差異：32.5 MB / 4 秒，對比修正前 4.9 MB / 12 分 51 秒。
換到其他國家的機器時，用 `--build-arg APT_MIRROR=<當地鏡像>` 覆寫。

### GB 失敗於 `ModuleNotFoundError: No module named 'yaml'`

GB 的 imagegen 用系統 python3 執行，需要 `python3-yaml`（Dockerfile 已含）。
VR 不受影響，因為它在 build 過程自建 `.venv`。`pyfdt` 隨專案樹附帶，不需系統套件。

### 想確認到底走了容器還是宿主

看 build 輸出開頭。走容器會印 `[docker] image: ...`；回落宿主會印
`[docker] 回落到宿主環境 build。` 並說明原因。
