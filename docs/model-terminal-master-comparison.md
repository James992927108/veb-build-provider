# 模型終端功能與 master 差異

比對時間：2026-09-08 10:59（Asia/Taipei）。

基準與當時的 `master` 均為 `64de92a068aa27482307bc0ff5ea71e4490c6319`。
主工作目錄 `git status --short` 為空；未觀察到 DeepSeek session 在此 repository 的已提交或未提交修改。因此目前沒有雙方改動的重疊或衝突，不能推測另一個 session 尚未寫入的工作。

功能位於獨立 worktree `veb-build-provider-terminal-tab-title`，分支 `feature/terminal-tab-title`。

| 範圍 | master | 功能分支 |
| --- | --- | --- |
| 模型前綴 | 無套件整合 | pro / flash / cloud / codex 的 OSC 標題設定 |
| 操作入口 | 無 | Set Up Model Terminal Titles、Open Model Terminal |
| 啟動 | 原有建置、除錯、語言模組 | 新增獨立 model-terminal 模組註冊 |
| 使用者 shell | 無管理流程 | 明確執行設定指令後檢查、備份、修改 launcher 與 bashrc |
| 終端外觀 | 沿用既有設定 | 設定指令套用左側分頁、OSC title、process description |
| 顯示限制 | 原生 VS Code 行為 | 仍為原生並排，未宣稱支援上下兩行 |
| 建置／Docker／EDK2 | 原有實作 | 未修改 |
| 套件版本 | 3.14.0 | 3.14.0，產物名稱帶 model-terminal 以識別測試版 |

## 檔案

- `src/model-terminal/configure.ts`：launcher/bashrc 轉換、設定值、shell 路徑引用。
- `src/model-terminal/index.ts`：設定交易、備份／還原、命令註冊、模型選擇與啟動。
- `src/extension.ts`、`package.json`：功能掛載、命令與設定宣告。
- `test/modelTerminal.test.ts`：14 個測試，含真實 bash 子程序與假 CLI；不連線模型服務。
- `README.md`、`docs/model-terminal-titles.md`、`.vscodeignore`：操作說明及套件內文件。
- 此差異紀錄。

## 驗證與整合

全套測試為 151 個 TypeScript/Mocha + 13 個 Python，全部通過。腳本轉換已對本機現有 launcher/bashrc 做唯讀 dry run：`bash -n` 通過、重複套用結果一致。現有使用者 settings.json 的 JSONC 解析通過。VSIX 打包通過；未在圖形 VS Code 中人工確認四個 CLI 的分頁，也未更動使用者檔案或安裝套件。

沒有新增執行依賴，沒有更動 lockfile。打包工具提示 repository 原本缺少 LICENSE 檔案，不影響此次打包結果。

後續若 master 有新提交，合併前應重新比較，優先查看 `package.json` 與 `src/extension.ts` 的命令、設定及啟動註冊。此紀錄只是上述時間的快照；此工作沒有合併、切換或提交到 master。
