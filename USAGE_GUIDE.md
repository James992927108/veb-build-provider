# VEB Build Provider 使用指南

本指南將詳細介紹如何使用 VEB Build Provider 擴充套件的各項功能，幫助您更高效地開發 VEB 專案。

## 📋 目錄

- [快速開始](#-快速開始)
- [核心功能](#-核心功能)
- [建置流程](#-建置流程)
- [Debug 功能](#-debug-功能)
- [語言支援](#-語言支援)
- [快捷鍵參考](#️-快捷鍵參考)
- [設定檔案](#設定檔案)
- [疑難排解](#疑難排解)

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
- **F8**：初始化專案，選擇專案後會自動建立 `tasks.json` 檔案
- **F9**：執行建置任務，觸發 `tasks.json` 中定義的 command

### 2. 語言支援
- EDK2 檔案的語法高亮和自動完成
- 支援 `.inf`、`.dsc`、`.fdf`、`.uni`、`.vfr` 等檔案類型
- 程式碼格式化功能

### 3. Debug 支援
- 快速插入除錯程式碼片段
- 支援 Debug User、Debug Start、Debug End 三種模式

---

## 📋 建置流程

### 使用步驟

1. **按 F8 初始化專案**
   - 選擇您的 VEB 專案
   - 系統會自動建立 `tasks.json` 檔案

2. **按 F9 執行建置**
   - 觸發 `tasks.json` 中定義的 command
   - 開始建置流程

---

## 🐛 Debug 功能

### Debug Snippets

VEB Build Provider 提供三種 Debug Snippets，方便在 C/C++ 程式碼中插入除錯程式碼：

`n#### 1. Debug User (`Ctrl+F1`)`n
插入使用者自定義除錯程式碼：

```c
// 插入的程式碼範例
DEBUG((DEBUG_INFO, "User Debug: %s\n", __FUNCTION__));
```

**使用方式**：
1. 在 C/C++ 檔案中按 `Ctrl+F1`
2. 輸入自定義除錯訊息
3. 程式碼會自動插入到游標位置

`n#### 2. Debug Start (`Ctrl+F2`)`n
標記除錯區塊開始：

```c
// 插入的程式碼範例
DEBUG((DEBUG_INFO, "=== DEBUG START: %s ===\n", __FUNCTION__));
```

`n#### 3. Debug End (`Ctrl+F3`)`n
標記除錯區塊結束：

```c
// 插入的程式碼範例
DEBUG((DEBUG_INFO, "=== DEBUG END: %s ===\n", __FUNCTION__));
```

---

## 📝 語言支援

### EDK2 檔案支援

VEB Build Provider 提供以下檔案類型的語言支援：

`n#### 1. .inf 檔案 (模組資訊檔)`n
- **語法高亮**：關鍵字、區段、GUID
- **自動完成**：常用區段和參數
- **錯誤檢查**：語法驗證

`n#### 2. .dsc 檔案 (平台描述檔)`n
- **語法高亮**：平台設定、模組路徑
- **導航功能**：快速跳轉到模組定義

`n#### 3. .fdf 檔案 (Flash 描述檔)`n
- **語法高亮**：Flash 佈局、區塊定義
- **格式化**：自動縮排和對齊

`n#### 4. .uni 檔案 (多語言字串檔)`n
- **語法高亮**：字串 ID、語言代碼
- **格式化**：Unicode 字串對齊

`n#### 5. .vfr 檔案 (視覺表單檔)`n
- **語法高亮**：表單元素、控制項
- **自動完成**：VFR 關鍵字

### 程式碼格式化

`n#### 使用方式`n
1. 開啟支援的檔案類型
2. 按 `Shift+Alt+F` 或右鍵選擇 "Format Document"
3. 擴充套件會自動格式化程式碼

`n#### 格式化設定`n
```json
{
  "vebBuild.formatter.indentSize": 2,
  "vebBuild.formatter.maxLineLength": 100,
  "vebBuild.formatter.alignComments": true
}
```

---

## ⌨️ 快捷鍵參考

### 核心功能快捷鍵

| 功能 | 快捷鍵 | 說明 |
|------|--------|------|
| 初始化專案 | `F8` | 選擇專案並建立 tasks.json |
| 執行建置 | `F9` | 觸發 tasks.json 中的 command |
| 格式化程式碼 | `Shift+Alt+F` | 格式化當前檔案 |

### Debug 快捷鍵

| 功能 | 快捷鍵 | 說明 |
|------|--------|------|
| Debug User | `Ctrl+F1` | 插入自定義除錯程式碼 |
| Debug Start | `Ctrl+F2` | 插入除錯區塊開始標記 |
| Debug End | `Ctrl+F3` | 插入除錯區塊結束標記 |

---
