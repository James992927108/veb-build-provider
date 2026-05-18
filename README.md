# VEB Build Provider v3.7.0
VEB Build Provider 是一款專為 [VEB 專案](https://github.com/James992927108/veb-build-provider) 打造的 Visual Studio Code 擴充套件，提供一鍵建置、Enhanced Debug 日誌分析與 EDK2 語言支援功能，協助開發者更高效地管理 VEB 專案的開發與除錯流程。

## 📋 目錄

- [功能特色](#-功能特色)
- [專案架構](#-專案架構)
- [安裝方式](#-安裝方式)
- [使用說明](#-使用說明)
- [使用指南](./USAGE_GUIDE.md) 📖
- [常見問題](#-常見問題)
- [版本歷史](#-版本歷史)
- [貢獻方式](#-貢獻方式)
- [授權](#-授權)

---

## 🚀 功能特色

### 🏗️ 核心建置功能
- **一鍵建置**：快速執行 VEB 專案的建置流程，支援完整的建置鏈
- **專案清理**：一鍵清理專案產生的暫存或編譯檔案，保持專案整潔
- **自動環境偵測**：✨ **新功能** 透過 Python 腳本自動偵測 Linux 建置環境與工具鏈路徑
- **命令面板支援**：所有功能皆可透過 VS Code 命令面板 (`Ctrl+Shift+P`) 呼叫
- **快捷鍵觸發**：預設建置指令已綁定快捷鍵，使用更方便


### 🔍 Enhanced Debug 分析系統 ✨ **Phase 2 新功能**
- **統一切換面板**：`EnhancedDebugProvider` 整合模組管理與日誌分析，雙模式無縫切換
- **Timeline 視圖**：按模組分組顯示執行序列，支援展開/收縮的階層化時間軸
- **雙向定位導航**：TreeView ↔ 日誌檔案完整雙向跳轉，精確行號級定位
- **智能檔案搜尋**：支援 Override 檔案優先級的跨資料夾導航
- **多重觸發方式**：右鍵選單、快捷鍵 (`Ctrl+Shift+L`)、狀態列按鈕
- **大檔案支援**：處理 >100MB 日誌檔案，支援模組分組載入
- **Ctrl+Click 跳轉**：從日誌檔案一鍵跳轉到對應源碼位置

### 📝 開發工具
- **EDK2 語言支援**：提供 EDK2/BIOS 相關檔案的語法高亮與格式化功能
- **Debug 工具**：內建 Debug Snippet 插入功能，協助開發除錯
- **模組管理**：EDK2 模組掃描、增強與管理功能

### 🔧 模塊化配置 ✨ **v3.3.0 新功能**
- **按需載入**：可選擇啟用/停用特定功能模塊，實現客製化配置
- **輕量版本**：純語法高亮版本，適合效能敏感或資源受限環境
- **靈活組合**：構建工具、調試分析、語言支持、Makefile 工具可獨立控制
- **即時切換**：透過設定檔案快速調整擴展功能範圍

### ⚙️ 全域配置系統 ✨ **v3.4.0 新功能**
- **動態版本管理**：版本號統一從 package.json 自動讀取，無需手動同步
- **集中參數管理**：專案名稱、版本、路徑等核心參數統一配置
- **Python 腳本整合**：debug_mode.py 和 release_mode.py 自動使用正確版本號
- **開發者友善**：減少硬編碼，提高程式碼維護性

---

## 📁 專案架構

```text
veb-build-provider/
├── 📁 config/                     # 統一配置檔案
│   ├── 📁 languages/              # 語言配置
│   │   ├── edk2_*.conf.json       # EDK2 相關語言配置
│   │   └── language-configuration_*.json
│   ├── 📁 syntaxes/               # 語法高亮定義
│   │   ├── BiosLanguage.tmLanguage_*.json
│   │   └── edk2_*.tmLanguage.json
│   └── 📁 snippets/               # 程式碼片段 (✨ 重新整合)
│       └── edk2_c.snippet.json
├── 📁 src/                        # 主要程式碼 (模組化架構)
│   ├── 📁 veb-build/              # VEB 建置模組
│   │   ├── 📁 commands/           # 建置相關指令
│   │   │   └── buildCommands.ts   # 建置指令實作 (✨ 支援動態版本)
│   │   ├── 📁 tools/              # 建置工具
│   │   │   └── expandMakefileVars.ts # Makefile 變數展開工具
│   │   └── index.ts               # VEB 建置模組入口
│   ├── 📁 edk2-debug/             # EDK2 除錯模組
│   │   ├── 📁 analysis/           # Enhanced Debug 解析器模組
│   │   │   └── enhancedLogParser.ts # Enhanced Debug 格式解析器
│   │   ├── 📁 commands/           # 除錯相關指令
│   │   │   └── edk2DebugCommands.ts # EDK2 除錯指令 (統一管理)
│   │   ├── 📁 core/               # 核心功能
│   │   │   ├── crossFolderNavigator.ts # 跨資料夾智能導航器
│   │   │   ├── edk2ModuleProvider.ts   # EDK2 模組提供者
│   │   │   ├── infParser.ts            # INF 檔案解析器
│   │   │   ├── moduleEnhancer.ts       # 模組增強器
│   │   │   ├── moduleScanner.ts        # 模組掃描器
│   │   │   └── projectAnalyzer.ts      # 專案分析器
│   │   ├── 📁 providers/          # VS Code 服務提供者
│   │   │   ├── enhancedDebugProvider.ts # 統一面板 TreeDataProvider (✨ Phase 2)
│   │   │   └── logLinkProvider.ts # Enhanced Debug DocumentLinkProvider
│   │   ├── constants.ts           # 除錯常數定義
│   │   ├── index.ts               # EDK2 除錯模組入口
│   │   └── types.ts               # 除錯型別定義
│   ├── 📁 language-support/       # 語言支援模組
│   │   ├── 📁 commands/           # 語言指令
│   │   │   ├── formatterCommands.ts    # 格式化指令實作
│   │   │   └── providerCommands.ts     # 提供者指令
│   │   ├── 📁 core/               # 核心邏輯實現
│   │   │   ├── edk2Parser.ts      # EDK2 解析器
│   │   │   └── edk2Formatter.ts   # EDK2 格式化器
│   │   ├── 📁 providers/          # VS Code 服務提供者
│   │   │   ├── definitionProvider.ts    # 定義跳轉
│   │   │   ├── symbolProvider.ts        # 符號導覽
│   │   │   └── formattingProvider.ts    # 自動格式化
│   │   └── index.ts               # 語言支援模組入口
│   ├── 📁 shared/                 # 共用模組
│   │   ├── 📁 config/             # 全域配置系統 (✨ v3.4.0 新功能)
│   │   │   ├── globalConfig.ts    # 動態版本與專案配置
│   │   │   └── index.ts           # 配置系統統一匯出
│   │   ├── 📁 ui/                 # UI 元件
│   │   │   └── statusBar.ts       # 狀態列元件
│   │   ├── 📁 utils/              # 共用工具函式
│   │   │   ├── commandRegistry.ts # 指令註冊器
│   │   │   ├── logger.ts          # 日誌工具
│   │   │   ├── constants.ts       # 全域常數
│   │   │   └── file.ts            # 檔案工具
│   │   └── index.ts               # 共用模組入口
│   └── extension.ts               # 擴充套件入口點
├── 📁 tools/                      # 統一工具檔案 (✨ 重新整合)
│   ├── 📁 scripts/                # 建置腳本
│   │   ├── env_discovery.py       # Linux 環境自動偵測 (✨ 新功能)
│   │   ├── ExpandMakefileVars.py  # Makefile 變數展開
│   │   ├── PrepareEnvScript.bat   # Windows 環境準備
│   │   └── PrepareEnvLinuxScript.sh # Linux 環境準備
│   ├── debug_mode.py              # 除錯模式工具
│   ├── release_mode.py            # 發布模式工具
│   └── tee.exe                    # Windows tee 工具
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

### 快速開始

**前置要求**: 確保已安裝 VS Code 並開啟 VEB 專案資料夾

#### 第一次使用
1. **F8** - 初始化專案環境，建立 tasks.json 並設定環境變數
2. **F7** - 執行第一次建置

#### Enhanced Debug 分析
1. **開啟面板** - 側邊欄 → "VEB Build" → "Enhanced Debug"
2. **載入日誌** - 點擊 "Open Log File" 選擇 .log 檔案
3. **開始分析** - 點擊 TreeView 項目跳轉到對應日誌行

#### 除錯工具
- **Ctrl+F1/F2/F3** - 插入 Debug 程式碼片段
- **Ctrl+Shift+F5** - 開啟傳統日誌分析功能

### 🎯 常見使用場景

#### 場景1: 系統啟動卡住除錯
1. 開啟最新的啟動日誌檔案
2. 切換到 Log Analysis 模式  
3. 查看最後執行的模組，定位卡住位置

#### 場景2: 模組載入順序分析
1. 在 Timeline 視圖中觀察 PEI/DXE 階段
2. 比較異常與正常版本的載入順序
3. 使用雙向定位快速檢查源碼

### 進階操作

- **雙向導航**: 在日誌檔案中按 **Ctrl+Shift+L** 定位到 TreeView
- **源碼跳轉**: 在日誌檔案中 **Ctrl+Click** 跳轉到源碼位置
- **模式切換**: 點擊面板標題的 "Module Manager" / "Log Analysis" 按鈕
- **開啟位置設定**: 面板工具列 → "Change Log File Open Location"

📖 **完整功能說明請參考：[使用指南 USAGE_GUIDE.md](./USAGE_GUIDE.md)**

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

### Enhanced Debug 面板沒有顯示？

確認：
1. 已開啟包含 .inf 檔案的 EDK2 專案
2. 重新載入視窗: `Ctrl+Shift+P` → "Developer: Reload Window"

### 日誌解析失敗？

確認日誌格式是否包含 Enhanced Debug 資訊，範例：
- `PeiCore.Entry(75CC694B)`
- `Loading PEIM 7A6DF3DB-1C0A-45C2-8251-AFE794D7D6B3`

### 如何新增/修改指令？

編輯 `package.json` 的 `contributes.commands` 與 `src/extension.ts` 內的註冊邏輯。

---

## 📈 版本歷史

| 版本號 | 發布日期 |
|--------|----------|
| v3.5.0 | 2026-03-06 |
| v3.4.0 | 2025-09-26 |
| v3.3.0 | 2025-08-16 |
| v3.2.0 | 2025-07-17 |
| v3.1.0 | 2025-07-10 |

> **重要提醒**：此版本歷史表格格式為 `release_mode.py` 腳本自動化流程的固定格式，請勿任意修改！


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

> 本專案持續開發中，詳細技術規劃請參考：[VSCode Extension Development Roadmap](./VSCode_Extension_Development_Roadmap.md)，歡迎大家共同參與完善！
 
