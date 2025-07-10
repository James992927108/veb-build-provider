# VEB Build Provider

VEB Build Provider 是一款專為 [VEB 專案](https://github.com/James992927108/veb-build-provider) 打造的 Visual Studio Code 擴充套件，提供一鍵建置與清理功能，協助開發者更高效地管理 VEB 專案的常見開發流程。

---

## 功能特色

- **一鍵建置**：快速執行 VEB 專案的建置流程。
- **專案清理**：一鍵清理專案產生的暫存或編譯檔案。
- **命令面板支援**：所有功能皆可透過 VS Code 命令面板 (`Ctrl+Shift+P`) 呼叫。
- **快捷鍵觸發**：預設建置指令已綁定快捷鍵，使用更方便。

---

## 安裝方式

1. **下載專案原始碼**  
git clone <https://github.com/James992927108/veb-build-provider.git>
cd veb-build-provider

2. **安裝依賴並編譯**  
npm install
npm run compile

3. **打包 VSIX 並安裝**  
若尚未安裝 `vsce`，請先執行 `npm install -g vsce`  

產生的 `.vsix` 檔案可直接在 VS Code 內安裝。

打包指令`vsce package`

---

## 使用說明

### 指令與快捷鍵

| 指令名稱                 | 指令 ID                         | 預設快捷鍵  | 適用語言/條件                         | 功能說明                       |
| ------------------------ | ------------------------------- | ----------- | ------------------------------------- | ------------------------------ |
| 初始化任務               | `vebBuild.buildTool.initTask`   | F8          | 全域                                  | 初始化 VEB 專案相關任務        |
| 建置 VEB 專案            | `vebBuild.buildTool.vebBuild`   | F7          | 全域                                  | 執行 VEB 專案建置              |
| 重建 VEB 專案            | `vebBuild.buildTool.vebReBuild` | F9          | 全域                                  | 清理並重新建置 VEB 專案        |
| EDK2/Bios 語言格式化     | `vebBuild.formatter.formatEdk2` | Shift+Alt+F | `BiosLanguage_sdl` 或 `edk2_uni` 檔案 | 格式化 EDK2/Bios 語言檔案      |
| 插入 Debug User Snippet  | `editor.action.insertSnippet`   | Ctrl+F1     | C/C++ 檔案                            | 插入自定義 debug_user snippet  |
| 插入 Debug Start Snippet | `editor.action.insertSnippet`   | Ctrl+F2     | C/C++ 檔案                            | 插入自定義 debug_start snippet |
| 插入 Debug End Snippet   | `editor.action.insertSnippet`   | Ctrl+F3     | C/C++ 檔案                            | 插入自定義 debug_end snippet   |

- **命令面板呼叫**：按下 `Ctrl+Shift+P`，輸入 `VEB`，即可看到所有相關指令。
- **自訂快捷鍵**：可於 VS Code 的 `keybindings.json` 新增或修改快捷鍵。

---

## 常見問題

### 1. 編譯失敗或無法啟動

請嘗試清除 node_modules 與編譯產物後重裝：
rd /s /q node_modules
rd /s /q out
del package-lock.json

npm install
npm run compile

### 2. 如何新增/修改指令？

請編輯 `package.json` 的 `contributes.commands` 與 `src/extension.ts` 內的註冊邏輯。

---

## 貢獻方式

歡迎 Issue 與 Pull Request！  
如有建議或錯誤回報，請至 [GitHub Issues](https://github.com/James992927108/veb-build-provider/issues) 留言。

---

## 版本管理

建議使用 `git tag` 管理版本，例如：
git tag v1.6.0
git push origin v1.6.0

---

## 授權

MIT License

---

## 聯絡方式

如有任何問題，歡迎聯絡 [James992927108](https://github.com/James992927108)。

---

## 專案結構

```專案結構
.
├── .vscode/                       # VSCode 設定
├── .github/                       # GitHub Actions, Issue 與 PR 模板
├── src/
│   ├── commands/                  # 所有 VSCode Command 的註冊與實作
│   │   ├── buildCommands.ts
│   │   ├── formatterCommands.ts
│   │   ├── edk2DebugCommands.ts
│   │   ├── logAnalysisCommands.ts
│   │   └── index.ts
│   ├── providers/                 # 語言服務 Providers（Definition/Symbol/Completion）
│   │   └── languageProviders.ts
│   ├── utils/                     # 共用工具函式（Logger、Command Registry 等）
│   │   ├── commandRegistry.ts
│   │   ├── logger.ts
│   │   ├── constants.ts           # 全域常數定義
│   │   └── file.ts
│   ├── edk2Debug/                 # EDK2 除錯相關核心邏輯
│   ├── edk2Formatter/             # EDK2 程式碼格式化實作
│   ├── edk2Language/              # EDK2 語言功能（Definition/Symbol/Completion Providers）
│   ├── tools/                     # 各式輔助工具（SnippetTools、Makefile 變數展開等）
│   ├── ui/                        # UI 元件（StatusBar, TreeView Icons 等）
│   └── extension.ts               # Extension 啟動與停用程式碼
├── README.md                      # 專案說明與此處結構文件
├── package.json
├── tsconfig.json
└── .gitignore

```

> 本專案仍持續開發中，歡迎大家共同參與完善！