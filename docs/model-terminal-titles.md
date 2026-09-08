# 模型終端標題

此功能整合於 VEB Build Provider，獨立於 BIOS 建置工具，支援 Linux / bash。

| 啟動方式 | OSC title |
| --- | --- |
| `claude-cli pro` | `v4-pro: <目前資料夾>` |
| `claude-cli flash` | `v4-flash: <目前資料夾>` |
| `claude-cli cloud` 或選單 `c` / `C` | `claude: <目前資料夾>` |
| `codex` | `codex: <目前資料夾>` |

## 使用

1. 先安裝 Claude 與 Codex CLI，並準備既有的 `~/.local/bin/claude-cli`；套件不建立端點設定、不讀取 API key。
2. 在信任的工作區執行 `VEB Build: Set Up Model Terminal Titles`。
3. 關閉舊 shell 並新開 bash 終端，輸入上表指令。或執行 `VEB Build: Open Model Terminal`，選擇模型與工作區。

`vebBuild.modelTerminal.enabled` 控制套件指令註冊，預設 `true`，變更後 Reload Window。這是獨立功能，不依賴 `enableBuildTools`。關閉它不會刪除已安裝的 shell helper。`vebBuild.modelTerminal.launcherPath` 可指定既有 launcher，預設 `~/.local/bin/claude-cli`；支援絕對路徑與 `~/`，不展開其他 shell 變數。

## 套用內容

- 在 launcher 加入或辨識 `set_title()`，以 `printf '\033]0;%s: %s\007' "$label" "$(basename "$PWD")"` 寫 OSC 0，並 `export CLAUDE_CODE_DISABLE_TERMINAL_TITLE=1`。
- 在 pro / flash / cloud 的 `exec claude` 前呼叫 helper；舊版 menu / dispatch 的直接 cloud exec 改走 `launch_cloud`。
- 在 `.bashrc` 定義 `codex()`，先送 OSC，再用 `command codex "$@"` 執行，保留參數與退出碼。移除獨立 codex alias；自訂 codex 函式或無法辨識的 launcher 結構會停止套用。
- 使用 VS Code configuration API 修改使用者設定，保留 JSONC 註解及其他設定：

```jsonc
"terminal.integrated.tabs.enabled": true,
"terminal.integrated.tabs.location": "left",
"terminal.integrated.tabs.hideCondition": "never",
"terminal.integrated.tabs.title": "${sequence}",
"terminal.integrated.tabs.description": "${process}"
```

原規格的 `${local:process}` 不是官方文件列出的 process 變數，因此採用 `${process}`。只設 location 不會切換成兩行：原生 title 與 description 並排，由 VS Code 控制。[官方 Terminal Appearance](https://code.visualstudio.com/docs/terminal/appearance#_tab-text)。分頁太窄時需拖寬清單以看見描述。

## 範圍與還原

只有使用者執行設定指令才會改寫 launcher、`.bashrc` 及使用者終端設定；套件啟動不改寫這些檔案。每個有變更的 shell 檔案旁會留下 `.veb-title-<時間戳>.bak` 備份，保留執行權限；重複套用不新增內容。所有腳本先通過 `bash -n`，設定寫入失敗會嘗試還原本次修改，保留備份供人工恢復。

若要還原，先比較備份與目前檔案，僅移除本功能的 helper / 呼叫，避免覆蓋後續編輯；在 VS Code 設定頁重設上述五個終端設定，或填回自己的原值。

SSH / Dev Container 下，shell 檔案位於執行擴充套件的遠端主機；使用者、遠端、工作區設定有優先順序差異。套件會提示仍然覆蓋顯示設定的 key。`Open Model Terminal` 使用 `/bin/bash -ic`，載入 `.bashrc` 後執行所選 CLI；CLI 結束後該終端程序也結束。

## 驗證

自動測試使用暫存目錄內的假 CLI，不連線推論服務：檢查三個 Claude 模式、互動 cloud、codex 的 OSC bytes、環境變數、參數、退出碼、重複套用、語法錯誤拒絕與寫入失敗還原。

人工驗收：新開四個 bash 終端依序啟動四種 CLI，確認前綴、當下資料夾、process 描述與 Claude 啟動後標題保留。也測試互動選單 `c`。已開啟的終端不會回溯套用；後續若 CLI 主動再送 OSC，可能覆寫前綴（本功能依規格禁止 Claude 覆寫，不攔截 Codex 輸出）。尚未在圖形 VS Code 中完成此人工驗收，不能把 headless shell 測試視為畫面驗證。
