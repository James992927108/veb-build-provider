# VEB Build Provider 使用指南

本指南將詳細介紹如何使用 VEB Build Provider 擴充套件的各項功能，幫助您更高效地開發 VEB 專案。

## 📋 目錄

- [快速開始](#-快速開始)
- [核心功能](#-核心功能)
- [語言支援](#-語言支援)
- [快捷鍵參考](#️-快捷鍵參考)
- [設定檔案](#設定檔案)

---

## 🚀 快速開始

### 1. 安裝與設定

1. **安裝擴充套件**
   - 按 `Ctrl+Shift+P` 開啟命令面板
   - 輸入 `Extensions: Install from VSIX...`
   - 選擇 `.vsix` 檔案進行安裝

2. **首次使用設定**
   - 開啟您的 VEB 專案資料夾
   - 按 `F8` 執行初始化任務
   - 等待初始化完成

### 2. 驗證安裝

安裝完成後，您應該能在 VS Code 中看到：
- 命令面板中出現 VEB 相關指令
- 狀態列顯示 VEB 專案資訊
- EDK2 檔案的語法高亮功能

---

## 🔧 核心功能

VEB Build Provider 提供以下核心功能：

### 1. 建置流程管理

- **F8**：初始化專案，選擇專案後會自動建立 `tasks.json` 檔案並加入 `PrepareEnvScript.bat` 作為初始環境變數
- **F7**：執行 VEB Build 任務
- **F9**：執行 VEB ReBuild 任務

### 2. Enhanced Debug Log 轉跳功能

一鍵從 Enhanced Debug 日誌檔案跳轉到對應的源碼位置，大幅提升除錯效率。

#### 使用步驟

1. **開啟日誌檔案**
   - 按 `Ctrl+Shift+F5` 或點擊 EDK2 Modules 面板中的日誌按鈕
   - 選擇包含 Enhanced Debug 輸出的日誌檔案（.log 或 .txt）

2. **跳轉到源碼**
   - 在日誌中找到 Enhanced Debug 格式的行，例如：
     ```
     [PeiCore:InternalPeiInstallPpi:523:#16] Install PPI: EfiPeiReadOnlyVariable2
     ```
   - **Ctrl+Click** 點擊函數名稱（如 `InternalPeiInstallPpi`）
   - 自動跳轉到對應的源碼檔案和行號 523

3. **智能檔案選擇**
   - 自動優先選擇 Override 目錄下的檔案
   - 如果找到多個匹配檔案，會顯示選擇清單
   - Override 檔案會標示 🔧 圖示，原始檔案標示 📄 圖示

#### 支援格式

支援標準 Enhanced Debug Library 格式：
```
[ModuleName:FunctionName:LineNumber:#Sequence] Debug Message
```

**實際範例**：
```
[NvramPei:PeiGetPlatformSetupChangeTabel:90:#39] Static CustomerID FF
```

### 3. Debug 程式碼片段

VEB Build Provider 提供三種 Debug Snippets，方便在 C/C++ 程式碼中插入除錯程式碼：

#### Debug User (Ctrl+F1)
插入使用者自定義除錯程式碼：

```c
DEBUG((DEBUG_INFO, "User Debug: %s\n", __FUNCTION__));
```

**使用方式**：
1. 在 C/C++ 檔案中按 `Ctrl+F1`
2. 輸入自定義除錯訊息
3. 程式碼會自動插入到游標位置

#### Debug Start (Ctrl+F2)
標記除錯區塊開始：

```c
DEBUG((DEBUG_INFO, "=== DEBUG START: %s ===\n", __FUNCTION__));
```

#### Debug End (Ctrl+F3)
標記除錯區塊結束：

```c
DEBUG((DEBUG_INFO, "=== DEBUG END: %s ===\n", __FUNCTION__));
```

---

## 📝 語言支援

VEB Build Provider 提供多種 EDK2 檔案類型的語言支援：

### 支援的檔案類型

- **.inf** - 模組資訊檔案，提供語法高亮和自動完成
- **.dsc** - 平台描述檔案，支援平台設定語法高亮
- **.fdf** - Flash 描述檔案，支援 Flash 佈局語法高亮
- **.uni** - 多語言字串檔案，支援字串 ID 和語言代碼高亮
- **.vfr** - 視覺表單檔案，支援表單元素語法高亮
- **.dec** - EDK2 Package 宣告檔案
- **.cif** - 組態資訊檔案

### 程式碼格式化

1. 開啟支援的檔案類型
2. 按 `Shift+Alt+F` 或右鍵選擇 "Format Document"
3. 擴充套件會自動格式化程式碼

---

## ⌨️ 快捷鍵參考

### 完整快捷鍵列表

| 功能 | 快捷鍵 | 說明 |
|------|--------|------|
| 初始化專案 | `F8` | 建立 tasks.json 並設定初始環境變數 |
| 執行建置 | `F7` | VEB Build |
| 重新建置 | `F9` | VEB ReBuild |
| 開啟日誌檔案 | `Ctrl+Shift+F5` | 開啟 Enhanced Debug Log 檔案 |
| Debug User | `Ctrl+F1` | 插入自定義除錯程式碼 |
| Debug Start | `Ctrl+F2` | 插入除錯區塊開始標記 |
| Debug End | `Ctrl+F3` | 插入除錯區塊結束標記 |
| 格式化程式碼 | `Shift+Alt+F` | 格式化當前檔案 |

### Enhanced Debug 轉跳

| 操作 | 方式 | 說明 |
|------|------|------|
| 跳轉到源碼 | `Ctrl+Click` | 點擊日誌中的函數名稱跳轉 |

---

## 🔧 設定檔案

### 基本設定

您可以在 VS Code 的 `settings.json` 中自訂擴充套件行為：

```json
{
  "vebBuild.formatter.speceOnUni": 8,
  "vebBuild.formatter.spaceOnSdlBefore": 4,
  "vebBuild.formatter.spaceOnSdlAfter": 15,
  "vebBuild.edk2Debug.autoScan": true,
  "vebBuild.edk2Debug.showProgress": true
}
```

### 常用設定項目

- `vebBuild.edk2Debug.autoScan` - 自動掃描 EDK2 模組
- `vebBuild.edk2Debug.showProgress` - 顯示掃描進度

---

## ⚙️ 模塊化配置 ✨ **v3.3.0 新功能**

VEB Build Provider v3.3.0 新增模塊化功能，允許您按需啟用/停用特定功能模塊，實現更靈活的擴展配置。

### 🎛️ 可用的模塊開關

在 VS Code 設定中，您可以控制以下四個獨立模塊：

```json
{
  "vebBuild.modules.enableBuildTools": true,      // VEB 構建工具
  "vebBuild.modules.enableDebugTools": false,     // EDK2 調試分析
  "vebBuild.modules.enableLanguageSupport": true, // 語言支持功能  
  "vebBuild.modules.enableMakefileTools": false   // Makefile 工具
}
```

### 📦 模塊功能詳解

| 模塊 | 功能範圍 | 包含內容 |
|------|----------|----------|
| **enableBuildTools** | VEB 構建功能 | • F7/F8/F9 快捷鍵<br>• 任務管理與追蹤<br>• 構建時間顯示<br>• 狀態列按鈕 |
| **enableDebugTools** | EDK2 調試分析 | • Enhanced Debug 日誌解析<br>• 模塊掃描與管理<br>• TreeView 雙向導航<br>• 大檔案支援 |
| **enableLanguageSupport** | 進階語言支持 | • 大綱視圖 (Outline)<br>• 跳轉定義 (F12)<br>• 符號搜索 (Ctrl+Shift+O)<br>• 代碼格式化<br>• 麵包屑導航 |
| **enableMakefileTools** | Makefile 工具 | • 變量展開功能<br>• 右鍵選單整合 |

> **注意**：基礎語法高亮功能始終可用，不受 `enableLanguageSupport` 影響。

### 🎯 使用場景範例

#### **純語法高亮版本** (最輕量)
```json
{
  "vebBuild.modules.enableBuildTools": false,
  "vebBuild.modules.enableDebugTools": false,
  "vebBuild.modules.enableLanguageSupport": false,
  "vebBuild.modules.enableMakefileTools": false
}
```
*適用於：僅需要 EDK2 文件語法高亮的輕量環境*

#### **開發專用版本**
```json
{
  "vebBuild.modules.enableBuildTools": true,
  "vebBuild.modules.enableDebugTools": false,
  "vebBuild.modules.enableLanguageSupport": true,
  "vebBuild.modules.enableMakefileTools": true
}
```
*適用於：日常開發，需要構建和語言支持，但不需要調試分析*

#### **調試專用版本**
```json
{
  "vebBuild.modules.enableBuildTools": false,
  "vebBuild.modules.enableDebugTools": true,
  "vebBuild.modules.enableLanguageSupport": true,
  "vebBuild.modules.enableMakefileTools": false
}
```
*適用於：專注於日誌分析和調試的場景*

#### **完整版本** (預設)
```json
{
  "vebBuild.modules.enableBuildTools": true,
  "vebBuild.modules.enableDebugTools": false,
  "vebBuild.modules.enableLanguageSupport": true,
  "vebBuild.modules.enableMakefileTools": false
}
```
*適用於：完整功能體驗*

### 💡 語言支持功能說明

當 `enableLanguageSupport = true` 時，您將獲得：

- **大綱視圖**：左側 Explorer 面板的 "OUTLINE" 顯示文件結構
- **跳轉定義**：`F12` 或 `Ctrl+Click` 跳轉到定義
- **符號搜索**：`Ctrl+Shift+O` 快速搜索配置項
- **代碼格式化**：格式化 .uni 和 .sdl 文件
- **麵包屑導航**：文件頂部的層次結構顯示

### 🔄 配置變更生效

修改模塊配置後，需要重新載入 VSCode 窗口：
- 按 `Ctrl+Shift+P` 開啟命令面板
- 執行 `Developer: Reload Window`

---

## 🔧 全域配置系統 ✨ **v3.4.0 新功能**

VEB Build Provider v3.4.0 引入全域配置系統，提供動態版本管理和集中化參數控制，大幅簡化開發和發布流程。

### 🎯 **核心特性**

#### **動態版本管理**
- 版本號統一從 `package.json` 自動讀取
- 建置任務 (`tasks.json`) 版本號自動同步
- Python 腳本 (`debug_mode.py`, `release_mode.py`) 自動使用正確版本號
- 無需手動維護多處版本資訊

#### **集中參數管理**
- 專案名稱、版本、發佈者等核心資訊統一配置
- 減少程式碼中的硬編碼字串
- 提高程式碼維護性和一致性

### 📝 **開發者使用說明**

#### **TypeScript 程式碼中使用**
```typescript
import { PROJECT_CONFIG } from '../../shared/config';

// 使用動態版本號
const version = PROJECT_CONFIG.VERSION;  // 自動從 package.json 讀取
const projectName = PROJECT_CONFIG.NAME; // 'veb-build-provider'
```

#### **配置檔案結構**
```
src/shared/config/
├── globalConfig.ts    # 主要配置檔案
└── index.ts          # 統一匯出
```

### 🔄 **版本更新流程**

使用全域配置系統後，版本更新變得更簡單：

1. **修改版本號** - 只需更新 `package.json` 中的版本號
2. **自動同步** - 所有相關檔案自動使用新版本號
3. **一致性保證** - 避免版本號不同步的問題

### 🛠️ **Python 腳本整合**

#### **Debug Mode 流程**
```bash
python tools/debug_mode.py
```
- 修改 `package.json` 版本為 debug 版本 (如 3.4.1)
- 編譯時 TypeScript 自動讀取新版本號
- 建置產生的 `tasks.json` 使用正確的 debug 版本號

#### **Release Mode 流程**
```bash
python tools/release_mode.py
```
- 自動遞增版本號並更新 `package.json`
- 所有相關檔案自動使用新版本號
- 無需手動修改 TypeScript 檔案

### 💡 **最佳實踐**

- ✅ **版本號管理**：只在 `package.json` 中維護版本號
- ✅ **配置參數**：新增全域參數時加入 `globalConfig.ts`
- ✅ **模組引用**：使用 `import { PROJECT_CONFIG } from '@/shared/config'`
- ❌ **避免硬編碼**：不要在程式碼中直接寫入版本號或專案名稱

---

### 其他設定項目

- `vebBuild.formatter.speceOnUni` - UNI 檔案格式化間距
