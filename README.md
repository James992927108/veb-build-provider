# VEB Build Provider v3.3.0
VEB Build Provider 是一款專為 [VEB 專案](https://github.com/James992927108/veb-build-provider) 打造的 Visual Studio Code 擴充套件，提供一鍵建置與清理功能，協助開發者更高效地管理 VEB 專案的常見開發流程。

## 📋 目錄

- [功能特色](#-功能特色)
- [專案架構](#-專案架構)
- [安裝方式](#-安裝方式)
- [使用說明](#-使用說明)
- [詳細使用指南](./USAGE_GUIDE.md) 📖
- [常見問題](#-常見問題)
- [版本歷史](#-版本歷史)
- [貢獻方式](#-貢獻方式)
- [授權](#-授權)

---

## 🚀 功能特色

- **🏗️ 一鍵建置**：快速執行 VEB 專案的建置流程，支援完整的建置鏈
- **🧹 專案清理**：一鍵清理專案產生的暫存或編譯檔案，保持專案整潔
- **⌨️ 命令面板支援**：所有功能皆可透過 VS Code 命令面板 (`Ctrl+Shift+P`) 呼叫
- **🔧 快捷鍵觸發**：預設建置指令已綁定快捷鍵，使用更方便
- **📝 EDK2 語言支援**：提供 EDK2/BIOS 相關檔案的語法高亮與格式化功能
- **🐛 Debug 工具**：內建 Debug Snippet 插入功能，協助開發除錯
- **📊 日誌分析**：提供日誌分析與視覺化功能，快速定位問題

---

## 📁 專案架構

```text
veb-build-provider/
├── 📁 config/                     # 語言配置檔案
│   ├── 📁 languages/              # 各種語言的語法配置
│   │   ├── edk2_*.conf.json       # EDK2 相關語言配置
│   │   └── language-configuration_*.json
│   └── 📁 syntaxes/               # 語法高亮定義
│       ├── BiosLanguage.tmLanguage_*.json
│       └── edk2_*.tmLanguage.json
├── 📁 src/                        # 主要程式碼 (模組化架構)
│   ├── 📁 veb-build/              # VEB 建置模組
│   │   ├── 📁 commands/           # 建置相關指令
│   │   │   └── buildCommands.ts   # 建置指令實作
│   │   ├── 📁 tools/              # 建置工具
│   │   │   └── expandMakefileVars.ts # Makefile 變數展開工具
│   │   └── index.ts               # VEB 建置模組入口
│   ├── 📁 edk2-debug/             # EDK2 除錯模組
│   │   ├── 📁 commands/           # 除錯相關指令
│   │   │   └── edk2DebugCommands.ts # EDK2 除錯指令
│   │   ├── 📁 analyzer/           # 分析器模組
│   │   │   ├── jsonLogParser.ts   # JSON 日誌解析器
│   │   │   └── logAnalyzer.ts     # 日誌分析器
│   │   ├── 📁 enhancer/           # 增強器模組
│   │   │   └── moduleEnhancer.ts  # 模組增強器
│   │   ├── 📁 provider/           # 提供者模組
│   │   │   ├── edk2ModuleProvider.ts # EDK2 模組提供者
│   │   │   └── index.ts           # 提供者入口
│   │   ├── 📁 scanner/            # 掃描器模組
│   │   │   ├── index.ts           # 掃描器入口
│   │   │   ├── infParser.ts       # INF 檔案解析器
│   │   │   ├── moduleScanner.ts   # 模組掃描器
│   │   │   ├── projectAnalyzer.ts # 專案分析器
│   │   │   └── README.md          # 掃描器說明文件
│   │   ├── 📁 visualization/      # 視覺化模組
│   │   │   └── htmlReportGenerator.ts # HTML 報告產生器
│   │   ├── constants.ts           # 除錯常數定義
│   │   ├── index.ts               # EDK2 除錯模組入口
│   │   └── types.ts               # 除錯型別定義
│   ├── 📁 language-support/       # 語言支援模組
│   │   ├── 📁 commands/           # 語言指令
│   │   │   ├── formatterCommands.ts      # 格式化指令實作
│   │   │   └── formatterCommandsEntry.ts # 格式化指令入口
│   │   ├── 📁 core/               # 核心邏輯實現
│   │   │   ├── edk2Parser.ts      # EDK2 解析器
│   │   │   ├── edk2Formatter.ts   # EDK2 格式化器
│   │   │   └── types.ts           # 型別定義
│   │   ├── 📁 providers/          # VS Code 服務提供者
│   │   │   ├── definitionProvider.ts    # 定義跳轉
│   │   │   ├── symbolProvider.ts        # 符號導覽
│   │   │   └── formattingProvider.ts    # 自動格式化
│   │   ├── registry.ts            # 統一註冊管理
│   │   └── index.ts               # 語言支援模組入口
│   ├── 📁 log-analysis/           # 日誌分析模組
│   │   ├── 📁 commands/           # 日誌分析指令
│   │   │   └── logAnalysisCommands.ts # 日誌分析指令實作
│   │   └── index.ts               # 日誌分析模組入口
│   ├── 📁 shared/                 # 共用模組
│   │   ├── 📁 ui/                 # UI 元件
│   │   │   └── statusBar.ts       # 狀態列元件
│   │   ├── 📁 utils/              # 共用工具函式
│   │   │   ├── commandRegistry.ts # 指令註冊器
│   │   │   ├── logger.ts          # 日誌工具
│   │   │   ├── constants.ts       # 全域常數
│   │   │   └── file.ts            # 檔案工具
│   │   └── index.ts               # 共用模組入口
│   └── extension.ts               # 擴充套件入口點
├── 📁 resource/                   # 資源檔案
│   ├── 📁 icons/                  # 圖示檔案
│   └── 📁 snippets/               # 程式碼片段
├── 📁 scripts/                    # 建置腳本
├── 📁 templates/                  # 範本檔案
├── 📄 package.json                # 套件配置
├── 📄 tsconfig.json               # TypeScript 配置
└── 📄 README.md                   # 專案說明文件
```

---

## 💾 安裝方式

### 🔧 從原始碼編譯安裝

```bash
# 1. 下載專案原始碼
git clone https://github.com/James992927108/veb-build-provider.git
cd veb-build-provider

# 2. 安裝依賴並編譯
npm install
npm run compile

# 3. 打包並安裝 (需先安裝 vsce: npm install -g vsce)
vsce package
```

安裝產生的 `.vsix` 檔案：在 VS Code 中按 `Ctrl+Shift+P` → 輸入 `Extensions: Install from VSIX...` → 選擇檔案

### 🏪 從 VS Code Marketplace 安裝 (即將推出)

直接在 VS Code 擴充套件商店搜尋 "VEB Build Provider" 進行安裝。

---

## ⚡ 使用說明

### 📌 核心指令與快捷鍵

| 功能 | 指令 ID | 快捷鍵 | 說明 |
|------|---------|--------|------|
| 🏗️ 初始化任務 | `vebBuild.buildTool.initTask` | `F8` | 初始化 VEB 專案相關任務 |
| 🚀 建置專案 | `vebBuild.buildTool.vebBuild` | `F7` | 執行 VEB 專案建置 |
| 🔄 重建專案 | `vebBuild.buildTool.vebReBuild` | `F9` | 清理並重新建置 VEB 專案 |
| 📝 格式化程式碼 | `vebBuild.formatter.formatEdk2` | `Shift+Alt+F` | 格式化 EDK2/BIOS 語言檔案 |

### 🐛 Debug Snippets

| 功能 | 快捷鍵 | 適用檔案 | 說明 |
|------|--------|----------|------|
| Debug User | `Ctrl+F1` | C/C++ | 插入自定義 debug_user snippet |
| Debug Start | `Ctrl+F2` | C/C++ | 插入自定義 debug_start snippet |
| Debug End | `Ctrl+F3` | C/C++ | 插入自定義 debug_end snippet |

**使用技巧**：

- 按 `Ctrl+Shift+P` 開啟命令面板，輸入 `VEB` 查看所有相關指令
- 可在 VS Code 的 `keybindings.json` 中自訂快捷鍵
- 📖 **詳細功能說明請參考：[完整使用指南](./USAGE_GUIDE.md)**

---

## ❓ 常見問題

### 編譯失敗或無法啟動

```bash
# 清除快取並重新安裝
rd /s /q node_modules
rd /s /q out
del package-lock.json
npm install
npm run compile
```

### 如何新增/修改指令？

編輯 `package.json` 的 `contributes.commands` 與 `src/extension.ts` 內的註冊邏輯。

---

## 📈 版本歷史

| 版本號 | 發布日期 |
|--------|----------|
| v3.3.0 | 2025-08-14 |
| v3.2.0 | 2025-07-17 |
| v3.1.0 | 2025-07-10 |

---

## 🤝 貢獻方式

歡迎 Issue 與 Pull Request！如有建議或錯誤回報，請至 [GitHub Issues](https://github.com/James992927108/veb-build-provider/issues) 留言。

---

## 📄 授權

MIT License

---

## 📞 聯絡方式

如有任何問題，歡迎聯絡 [James992927108](https://github.com/James992927108)。

---

> 本專案仍持續開發中，歡迎大家共同參與完善！
