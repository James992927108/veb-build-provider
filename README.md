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

| 指令名稱                   | 指令 ID                         | 預設快捷鍵   | 適用語言/條件                         | 功能說明                                 |
| -------------------------- | ------------------------------- | ------------ | ------------------------------------- | ---------------------------------------- |
| 初始化任務                 | `vebBuild.buildTool.initTask`            | F8           | 全域                                  | 初始化 VEB 專案相關任務                  |
| 建置 VEB 專案              | `vebBuild.buildTool.vebBuild`            | F7           | 全域                                  | 執行 VEB 專案建置                        |
| 重建 VEB 專案              | `vebBuild.buildTool.vebReBuild`          | F9           | 全域                                  | 清理並重新建置 VEB 專案                  |
| EDK2/Bios 語言格式化       | `formatter.Edk2Formatter`       | Shift+Alt+F  | `BiosLanguage_sdl` 或 `edk2_uni` 檔案 | 格式化 EDK2/Bios 語言檔案                |
| 插入 Debug User Snippet    | `editor.action.insertSnippet`   | Ctrl+F1      | C/C++ 檔案                            | 插入自定義 debug_user snippet            |
| 插入 Debug Start Snippet   | `editor.action.insertSnippet`   | Ctrl+F2      | C/C++ 檔案                            | 插入自定義 debug_start snippet           |
| 插入 Debug End Snippet     | `editor.action.insertSnippet`   | Ctrl+F3      | C/C++ 檔案                            | 插入自定義 debug_end snippet             |

- **命令面板呼叫**：按下 `Ctrl+Shift+P`，輸入 `VEB`，即可看到所有相關指令。
- **自訂快捷鍵**：可於 VS Code 的 `keybindings.json` 新增或修改快捷鍵。

---

## 常見問題

### 1. 編譯失敗或無法啟動

請嘗試清除 node_modules 與編譯產物後重裝：
rm -rf node_modules
rm -rf out
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
├── scripts/                     # 外部腳本與自動化工具
│   ├── ExpandMakefileVars.py
│   ├── PrepareEnvLinuxScript.sh
│   └── PrepareEnvScript.bat
│
├── src/                         # TypeScript 主程式碼
│   ├── edk2Formatter/           # EDK2 格式化相關模組
│   │   ├── edk2Formatter.ts
│   │   ├── formatSdl.ts
│   │   └── formatUni.ts
│   │
│   ├── edk2Language/            # EDK2 語言支援
│   │   └── edk2Language.ts
│   │
│   ├── tools/                   # 開發輔助工具
│   │   ├── expandMakefileVars.ts
│   │   └── SnippetTools.ts
│   │
│   ├── utils/                   # 共用工具
│   │   ├── file.ts
│   │   └── logger.ts
│   │
│   ├── VebBuild/                # VEB 專案初始化與建置
│   │   ├── initTask.ts
│   │   └── terminal.ts
│   │
│   ├── constants.ts             # 全域常數
│   ├── extension.ts             # VS Code Extension 入口
│   └── TreeProvider.ts          # 樹狀結構 UI 元件
│
├── syntaxes/                    # VS Code 語法高亮設定
│
├── temp/                        # 暫存資料夾
│
├── Tool/                        # 外部工具（如 tee.exe）
│   └── tee.exe
│
├── .eslintrc.json               # ESLint 設定
├── .gitignore                   # Git 忽略清單
├── package.json                 # NPM 專案設定
├── package-lock.json            # NPM 鎖定檔
└── README.md                    # 專案說明文件

src/
├── edk2Debug/                    # 新增的 EDK2 Debug 主模組
│   ├── index.ts                 # 模組出口
│   ├── types.ts                 # 型別定義
│   ├── constants.ts             # 常數定義
│   ├── scanner/                 # 掃描子模組
│   │   ├── index.ts
│   │   ├── infParser.ts         # INF 檔案解析器
│   │   ├── moduleScanner.ts     # 模組掃描器
│   │   └── projectAnalyzer.ts   # 專案分析器
│   └── provider/                # 資料提供者
│       ├── index.ts
│       └── edk2ModuleProvider.ts # 模組樹狀視圖提供者
├── utils/                       # 現有工具模組（擴展）
│   ├── logger.ts               # 擴展日誌功能
│   └── file.ts                 # 擴展檔案處理
└── extension.ts                # 主擴展檔案（整合命令）

```

> 本專案仍持續開發中，歡迎大家共同參與完善！