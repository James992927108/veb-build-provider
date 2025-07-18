# EDK2 Language Support 功能驗證清單

## 🔍 **驗證項目**

### 1. **Definition Provider (定義跳轉功能)**

#### 測試步驟：
1. 開啟 EDK2 專案
2. 在 .dsc 檔案中，將游標放在 `!include` 語句上
3. 按 F12 或右鍵選擇 "Go to Definition"
4. 驗證是否正確跳轉到對應檔案

#### 測試檔案類型：
- [ ] `.dsc` 檔案中的 `!include` 語句
- [ ] `.dec` 檔案中的 `!include` 語句
- [ ] `.inf` 檔案中的 `!include` 語句
- [ ] `.fdf` 檔案中的 `INF` 語句
- [ ] `.vfr` 檔案中的 `!include` 語句

### 2. **Symbol Provider (符號導覽功能)**

#### 測試步驟：
1. 開啟 EDK2 檔案
2. 按 Ctrl+Shift+O 或查看 "Outline" 面板
3. 驗證是否顯示正確的符號結構

#### 測試檔案類型：
- [ ] `.dsc` 檔案 - 顯示 sections 和 key-value pairs
- [ ] `.dec` 檔案 - 顯示 sections 和 entries
- [ ] `.inf` 檔案 - 顯示 sections 和 source files
- [ ] `.fdf` 檔案 - 顯示 sections 和 INF modules

### 3. **Formatting Provider (自動格式化功能)**

#### 測試步驟：
1. 開啟 EDK2 檔案，故意添加不規範的格式
2. 按 Ctrl+Shift+I (文件格式化) 或 Ctrl+K Ctrl+F (選擇範圍格式化)
3. 驗證格式化是否正確

#### 測試檔案類型：
- [ ] `.dsc` 檔案格式化
- [ ] `.dec` 檔案格式化
- [ ] `.inf` 檔案格式化
- [ ] `.fdf` 檔案格式化
- [ ] `.vfr` 檔案格式化

### 4. **命令式格式化功能 (保持相容性)**

#### 測試步驟：
1. 按 Ctrl+Shift+P 開啟命令面板
2. 搜尋 "Format EDK2"
3. 執行命令，驗證功能正常

- [ ] `vebBuild.formatter.formatEdk2` 命令可用

### 5. **工作區檢測功能**

#### 測試步驟：
1. 開啟包含 EDK2 檔案的工作區
2. 查看擴展日誌，確認檢測到 EDK2 檔案
3. 驗證語言功能被正確啟動

- [ ] EDK2 工作區檢測正常
- [ ] 語言服務正確啟動

### 6. **除錯功能整合**

#### 測試步驟：
1. 測試除錯相關命令是否正常工作
2. 驗證 infParser 是否正確解析 .inf 檔案

- [ ] 除錯功能正常
- [ ] INF 檔案解析正常

## 🧪 **測試用例檔案**

建議創建以下測試檔案：

### test.dsc
```
[Defines]
  PLATFORM_NAME = TestPlatform
  PLATFORM_GUID = 12345678-1234-1234-1234-123456789abc

!include MdePkg/MdePkg.dec

[Components]
  TestPkg/TestModule.inf
```

### test.dec
```
[Defines]
  DEC_SPECIFICATION = 0x00010005
  PACKAGE_NAME = TestPkg
  PACKAGE_GUID = 87654321-4321-4321-4321-cba987654321

!include IncludeFile.dec

[Includes]
  Include
```

### test.inf
```
[Defines]
  INF_VERSION = 0x00010005
  BASE_NAME = TestModule
  FILE_GUID = abcdef12-3456-7890-abcd-ef1234567890
  MODULE_TYPE = DXE_DRIVER

[Sources]
  TestModule.c
  TestModule.h
```

## 🔧 **驗證工具**

可以使用以下方式驗證：

1. **手動測試**：按照上述清單逐項測試
2. **日誌檢查**：查看 VS Code 輸出面板中的擴展日誌
3. **功能對比**：與重構前的版本對比功能

## ✅ **驗證通過標準**

- 所有定義跳轉功能正常
- 符號導覽正確顯示結構
- 自動格式化按預期工作
- 命令式格式化保持可用
- 工作區檢測正確
- 除錯功能不受影響
- 擴展啟動無錯誤
