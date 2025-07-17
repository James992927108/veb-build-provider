# VEB Build Provider

VEB Build Provider 是一款專為 [VEB 專案](https://github.com/James992927108/veb-build-provider) 打造的 Visual Studio Code 擴充套件，提供一鍵建置與清理功能，協助開發者更高效地管理 VEB 專案的常見開發流程。

## 📋 目錄

- [功能特色](#-功能特色)
- [專案架構](#-專案架構)
- [安裝方式](#-安裝方式)
- [使用說明](#-使用說明)
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
- **� 日誌分析**：提供日誌分析與視覺化功能，快速定位問題

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
├── 📁 src/                        # 主要程式碼
│   ├── 📁 commands/               # VSCode 指令實作
│   │   ├── buildCommands.ts       # 建置相關指令
│   │   ├── formatterCommands.ts   # 格式化指令
│   │   ├── edk2DebugCommands.ts   # 除錯指令
│   │   ├── logAnalysisCommands.ts # 日誌分析指令
│   │   └── index.ts
│   ├── 📁 providers/              # 語言服務提供者
│   │   └── languageProviders.ts   # 定義/符號/自動完成
│   ├── 📁 utils/                  # 共用工具函式
│   │   ├── commandRegistry.ts     # 指令註冊器
│   │   ├── logger.ts              # 日誌工具
│   │   ├── constants.ts           # 全域常數
│   │   └── file.ts                # 檔案工具
│   ├── 📁 edk2Debug/              # EDK2 除錯核心邏輯
│   ├── 📁 edk2Formatter/          # EDK2 程式碼格式化
│   ├── 📁 edk2Language/           # EDK2 語言功能
│   ├── 📁 tools/                  # 輔助工具
│   ├── 📁 ui/                     # UI 元件
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
