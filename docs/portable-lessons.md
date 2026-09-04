# 可移植的經驗：2026-09-04 ~ 09-05

這份文件記的是**換到別的專案仍然成立**的東西。起因是把 BIOS build 容器化，
但底下多數條目跟 BIOS、跟 AMI 工具鏈都無關 —— 那些只是踩到它們的場合。

專案專屬的細節（deadsnakes、AMI TOOLS 版本、Java 8/21 並存等）記在
`docker-build.md`，不放這裡。

每一條都標了當時的**症狀**，因為下次遇到時你先看到的是症狀，不是原因。

---

## 一、套件狀態不等於檔案存在

**症狀**：`FileNotFoundError: 'cpp'`，但 `dpkg -l cpp` 顯示 `ii`（已安裝），
`dpkg -L cpp` 也宣稱它擁有 `/usr/bin/cpp`。

**原因**：distro 升級（22.04 → 24.04）過程中檔案遺失，套件狀態沒跟著更新。

**通用做法**：`dpkg -l | grep` 這種檢查抓不到這種狀況。要驗證環境完整性用

```bash
sudo dpkg -V              # 列出所有與套件紀錄不符的檔案（含 missing）
sudo apt install --reinstall <pkg>
```

升級後跑一次 `dpkg -V` 很便宜。當時全系統只有兩個檔案遺失，其中一個就是
讓 build 掛掉的那個 —— 若沒掃，只會看到一個毫無關聯的 Python 例外。

**推論**：任何「檢查環境有沒有裝好」的腳本，都不該只查套件狀態。要查
關鍵執行檔是否真的存在（`[[ -x /usr/bin/cpp ]]`），以及關鍵模組是否真的
import 得起來（`python3 -c "import yaml"`）。

---

## 二、容器裡的 apt 鏡像

**症狀**：`E: Package 'build-essential' has no installation candidate`。
看起來像套件不存在，實際上 `build-essential` 當然存在。

**原因**：`ubuntu:24.04` 預設走 `archive.ubuntu.com`。在台灣實測只有 ~6 kB/s，
而且 `noble` / `noble-updates` 的 InRelease 直接連線失敗，只有 backports 抓到。
索引沒下載完 → main 裡的套件全部沒有候選版本。

**通用做法**：Dockerfile 第一件事就是換鏡像，並留一個 build-arg 方便換地區。

```dockerfile
ARG APT_MIRROR=http://tw.archive.ubuntu.com/ubuntu
RUN sed -i "s|http://archive.ubuntu.com/ubuntu|${APT_MIRROR}|g" \
        /etc/apt/sources.list.d/ubuntu.sources; \
    printf 'Acquire::Retries "5";\nAcquire::http::Timeout "30";\n' \
        > /etc/apt/apt.conf.d/99retry
```

實測差異：32.5 MB / 4 秒，對比修正前 4.9 MB / 12 分 51 秒。

**辨識法**：`apt-get update` 的輸出若有 `Failed to fetch ... InRelease`
但只是 `W:` 警告，後面的 `E: has no installation candidate` 就是它的後果，
不是獨立問題。

---

## 三、`COPY dir* dest/` 會合併目錄內容

**症狀**：Dockerfile 裡 `COPY tools_* /opt/` 之後，`/opt/` 底下不是預期的
`tools_54/`、`tools_58/`，而是三份內容互相覆蓋的一坨。

**原因**：Docker 的 `COPY` 對目錄是複製「內容」而非目錄本身。單一來源時
`COPY src dst` 的 `dst` 就是那個目錄所以看不出問題；萬用字元對到多個目錄時，
每一份的內容都被倒進同一個 `dst`。

**通用做法**：來源目錄數量不固定時，複製整個 context 再靠 `.dockerignore`
排除，不要用萬用字元：

```dockerfile
COPY . /opt/veb/
```

`.dockerignore` 必須放在 **context 根目錄**才生效（不是 Dockerfile 旁邊）。

---

## 四、容器內 PID 1 會丟棄訊號

**症狀**：Ctrl+C 對容器內的長時間工作完全無效，行程繼續跑。

**原因**：核心不對 PID 1 套用預設訊號動作。沒有註冊 handler 的 SIGINT/SIGTERM
會被直接丟棄，不是「被忽略後仍終止」，是根本不發生任何事。

**`--init` 不是解法**（實測過）：tini 只把訊號轉給它的直接子行程；如果那是
非互動的 bash，bash 不會再往下傳給它正在 `wait` 的子行程。

**通用做法**：從宿主端明確終止。

```bash
CONTAINER_NAME="job-$(id -u)-$$"
stop_container() { docker kill "$CONTAINER_NAME" >/dev/null 2>&1 || true; }
trap 'stop_container' INT TERM
docker run --rm --name "$CONTAINER_NAME" ... 
```

但單靠上面這段還是不會動 —— 見下一條。

---

## 五、bash 在前景指令執行期間不跑 trap

**症狀**：明明設了 `trap ... INT`，送 SIGINT 卻毫無反應。

**原因**：bash 會把訊號處理延後到**前景指令返回之後**才執行 trap。若那個
前景指令正是長時間不返回的那一個（`docker run`、`ssh`、`make`），trap 永遠
不會觸發。

**通用做法**：把長指令丟到背景，用 `wait` 等待 —— `wait` 是可被訊號打斷的。

```bash
trap 'cleanup' INT TERM
long_running_command &
PID=$!
wait "$PID"
RC=$?          # 被訊號打斷時是 128+signum
trap - INT TERM
```

順帶：改成背景執行後，若該指令會讀終端機 stdin 會收到 SIGTTIN 被停住。
不需要 stdin 的話明確關掉（`< /dev/null`），或不要傳 `docker run -i`。

---

## 六、背景執行的腳本收不到 SIGINT（測試陷阱）

**症狀**：寫測試驗證「Ctrl+C 能不能中斷」，結果測出來永遠無效 —— 但實際
手動操作是有效的。

**原因**：bash 對用 `&` 啟動的 job 會把 SIGINT/SIGQUIT 設成 `SIG_IGN`（POSIX
規定）。所以「腳本背景執行 → `kill -INT`」這種測法，量到的是 harness 的行為，
不是被測程式的。

我在這上面連續錯了兩次，第二次還特地改成對整個行程群組送訊號，結論依然是錯的。

**通用做法**：要測終端機互動行為就得用真的 pty。VS Code 的
`terminal.sendText("\x03")` 等同往 pty 寫入 ^C 字元：

```python
import pty, os, subprocess
master, slave = pty.openpty()
proc = subprocess.Popen([script], stdin=slave, stdout=slave, stderr=slave,
                        preexec_fn=os.setsid)
os.close(slave)
# ... 等它跑起來
os.write(master, b"\x03")
```

**更一般的教訓**：測試量到「沒有效果」時，先確認 harness 有沒有把待測的
機制本身給關掉了。負面結果比正面結果更容易是測錯。

---

## 七、`cmd | tee` 的退出碼是 tee 的

**症狀**：build 明明失敗，CI / IDE 卻顯示成功。

**原因**：管線的退出碼取自最後一個指令。`make | tee log` 回報的是 `tee` 的
狀態，幾乎永遠是 0。

這個專案的 VS Code task 從一開始就是這樣寫的，所以**它從來沒有回報過失敗**，
而且沒人發現 —— 因為失敗時終端機上看得到錯誤，沒有人去確認 task 的退出碼。

**通用做法**：

```bash
set -o pipefail          # 整段腳本適用
# 或針對單一管線
cmd 2>&1 | tee log
RC=${PIPESTATUS[0]}
```

**延伸**：任何「依退出碼決定行為」的功能（通知、CI gate、重試）在修好這點
之前都是假的。我們是先修退出碼，才有辦法做出有意義的成功/失敗通知。

---

## 八、VS Code Remote 的 extension 目錄是分開的

**症狀**：`code --install-extension` 說安裝成功，`code --list-extensions`
也顯示新版本，但 VS Code 視窗裡就是舊版，reload 幾次都一樣。

**原因**：Remote-SSH / tunnel 視窗讀的是 `~/.vscode-server/extensions/`，
而本機 `code` CLI 裝進 `~/.vscode/extensions/`。兩者完全獨立。

**通用做法**：用 server 端自己的 CLI 安裝。

```bash
# 最近使用的 server 從 lru.json 第一筆取得
SRV=$(head -c 200 ~/.vscode-server/cli/servers/lru.json | grep -o 'Stable-[a-f0-9]*' | head -1)
~/.vscode-server/cli/servers/$SRV/server/bin/code-server \
    --install-extension path/to.vsix --force
```

或直接在 Remote 視窗裡用 Extensions 面板的 "Install from VSIX..."。

**辨識法**：`ls ~/.vscode-server/extensions/` 有東西，就代表在用 Remote。

---

## 九、路徑格式正確不代表路徑存在

**症狀**：新機器上工具明明沒裝，程式卻判定「環境就緒」，然後在後面某個
不相關的地方失敗。

**原因**：環境偵測在找不到東西時回傳了設定檔裡寫死的預設路徑。那串路徑
格式完全合法，任何只做「解析」的檢查都會通過。

**通用做法**：解析與存在性是兩件事，分開處理。純函式負責解析（可測、
不碰 IO），呼叫端負責 `stat`：

```ts
const root = deriveRoot(toolsDir);              // 只解析格式
const usable = root ? await exists(root) : false; // 呼叫端確認存在
```

並且把這個責任分工寫進測試，否則下一個人又會只信回傳值：

```ts
it('parses a well-formed path even when nothing exists there (callers must stat)', ...)
```

**延伸**：靜默 fallback 到寫死的預設值，比直接報錯更糟 —— 它把「缺東西」
變成「另一個地方壞掉」，而那個地方跟真正的原因毫無關聯。

---

## 十、容器預設 UTC

**症狀**：容器產生的檔名時間戳與宿主差幾小時，排序與比對全亂。

**通用做法**：唯讀掛入宿主的 `/etc/localtime`。glibc 直接讀這個檔，
**不需要在 image 裡裝 tzdata**：

```bash
docker run -v /etc/localtime:/etc/localtime:ro ...
```

---

## 十一、bind mount 的產物擁有者

**症狀**：容器跑完後，宿主的工作目錄多出一堆 root 所有的檔案，之後
本機工具寫不進去。

**通用做法**：

```bash
docker run --user "$(id -u):$(id -g)" -v "$PWD:$PWD" -w "$PWD" ...
```

該 UID 在 image 裡通常沒有 passwd 紀錄，所以 `HOME` 要另外指到可寫位置
（`-e HOME=/tmp/xxx`），否則有些工具會在 `/` 底下亂寫或直接失敗。

---

## 十二、不要編輯正在執行的 shell script

**症狀**：腳本跑到一半報 `unexpected EOF while looking for matching quote`，
而且行號超過檔案總行數。

**原因**：bash 是邊讀邊執行，會記住檔案偏移量。執行期間修改檔案會讓後續
讀取落在錯誤的位置。

**通用做法**：等它跑完再改。行號大於檔案總行數就是這個狀況的明確特徵。

---

## 十三、同一棵樹上的併發 build

**症狀**：連結階段報某個中間產物 `No such file or directory`，但你去看
那個檔案明明存在，時間戳還很新。

**原因**：兩個 build 同時在同一個輸出目錄跑。一個正在重建那個中間檔，
另一個剛好要讀它。

**通用做法**：對別人正在使用的工作目錄動手之前，先確認沒有 build 在跑：

```bash
docker ps --format '{{.Image}} {{.Status}}'
pgrep -af 'make|build.sh'
```

**辨識法**：錯誤訊息裡的檔案「現在存在且時間戳接近失敗時間」，幾乎就是
併發，不是真的缺檔。

---

## 十四、行為退化，單元測試抓不到

**症狀**：功能完全正常、測試全綠，但使用者說「跟以前不一樣」。

這次的實例：容器模式把 `make > log` 之後只印尾段，結果 build 期間終端機
十幾分鐘完全沒有輸出。功能正確，體驗是壞的。

**通用做法**：這類「跑得動但不對」的性質，只能釘實作本身。直接讀腳本內容
斷言：

```ts
const script = fs.readFileSync(path.join(process.cwd(), 'tools/run.sh'), 'utf8');
it('streams output live through tee instead of redirecting to a file', () => {
  assert.ok(/cmd 2>&1 \| tee/.test(script));
  assert.ok(!/cmd >/.test(script));
});
```

醜，但它擋得住。斷言旁邊要寫清楚**為什麼**這樣寫，否則下一個人會覺得這是
無謂的限制而拿掉。

註：測試被編譯到別的目錄時，`__dirname` 的相對層數會變。用 `process.cwd()`
（測試框架通常從專案根執行）比較穩。

---

## 十五、git worktree 與容器裡的 git

- worktree 的 `.git` 是**檔案**不是目錄。只把 worktree 掛進容器是 clone 不了的，
  要用主 repo 當來源，分支物件本來就在共用的物件庫裡：
  `git clone -b <branch> /path/to/main-repo`
- `safe.directory` 要加的是 **`.git` 那個路徑**，不只是工作目錄。git 的錯誤
  訊息會直接告訴你要加哪一個，照著加即可。
- `ubuntu:24.04` 基底映像**已經佔用 uid 1000**（`ubuntu` 使用者），所以在裡面
  `useradd` 出來的第一個帳號是 1001，與宿主掛進來的檔案擁有者不符，於是觸發
  dubious ownership。

---

## 一句話版本

| # | 條目 |
|---|---|
| 1 | 套件 `ii` 不代表檔案在，用 `dpkg -V` |
| 2 | 容器 apt 先換鏡像，「套件不存在」多半是索引沒抓到 |
| 3 | `COPY dir* dst/` 會合併內容，改用 `COPY . dst/` + `.dockerignore` |
| 4 | 容器 PID 1 丟棄訊號，`--init` 救不了，從宿主 `docker kill` |
| 5 | bash 前景指令執行期間不跑 trap，改背景 + `wait` |
| 6 | 背景 job 的 SIGINT 是 `SIG_IGN`，測互動行為要用 pty |
| 7 | `cmd \| tee` 的退出碼是 tee 的，要 `pipefail` 或 `PIPESTATUS` |
| 8 | Remote 的 extension 目錄與本機分開，要用 server 端 CLI 裝 |
| 9 | 路徑格式合法 ≠ 路徑存在，解析與 stat 要分開 |
| 10 | 容器預設 UTC，掛 `/etc/localtime` 即可，不必裝 tzdata |
| 11 | bind mount 加 `--user`，並把 `HOME` 指到可寫處 |
| 12 | 不要編輯正在執行的 shell script |
| 13 | 併發 build 會產生「檔案存在卻說找不到」 |
| 14 | 體驗退化要靠斷言實作內容來擋 |
| 15 | worktree 的 `.git` 是檔案；`safe.directory` 要指 `.git` |
