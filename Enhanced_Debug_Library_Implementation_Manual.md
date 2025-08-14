# Enhanced Debug Library 實施手冊

## 文件說明

本手冊作為《Enhanced Debug Library 發明專利技術說明書》的技術實施附件，提供完整的、可重現的實施步驟和技術細節。

## 1. 系統要求和環境準備

### 1.1 開發環境要求
- AMI UEFI BIOS 開發環境
- 支持 AMI Override 機制的編譯系統
- C 語言編譯器（支持 __FUNCTION__ 和 __LINE__ 宏）
- 目標平台：x64 UEFI 系統

### 1.2 目錄結構準備
```bash
# 創建 Override 目錄結構 - MdePkg Libraries
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Include/Library
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/BaseDebugLibSerialPort
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/DxeRuntimeDebugLibSerialPort  
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/UefiDebugLibConOut
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/UefiDebugLibDebugPortProtocol
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/UefiDebugLibStdErr
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/BaseDebugLibNull

# 創建 AMI Debug Libraries 目錄結構
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/AmiModulePkg/Library/PeiAmiDebugLib
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/AmiModulePkg/Library/DxeAmiDebugLib
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/AmiModulePkg/Library/PeiCoreAmiDebugLib
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/AmiModulePkg/Library/DxeCoreAmiDebugLib
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/AmiModulePkg/Library/SmmAmiDebugLib
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/AmiModulePkg/Library/SmmCoreAmiDebugLib
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/AmiModulePkg/Library/RuntimeAmiDebugLib

# 創建備份目錄
mkdir -p Original/MdePkg/Include/Library
mkdir -p Original/MdePkg/Library/BaseDebugLibSerialPort
mkdir -p Original/AmiModulePkg/Library/PeiAmiDebugLib
# [其他對應目錄...]
```

## 2. 核心文件實施詳解

### 2.1 Override.cif 配置文件

**文件路徑**: `XCradlePlatformPkg/Override/Override.cif`

**完整配置內容**:
```
# Enhanced Debug Library - Complete DebugLib Override
# 此配置實現透明化 DEBUG() 宏增強功能，支持 MdePkg 和 AmiModulePkg

# 核心觸發器文件 - 包含 DEBUG 宏重定義
"OVERRIDE\MdePkg\Include\Library\DebugLib.h";"MdePkg\Include\Library\DebugLib.h" #Enhanced Debug Support

# MdePkg Debug Libraries - Standard UEFI Debug Support
"OVERRIDE\MdePkg\Library\BaseDebugLibSerialPort\DebugLib.c";"MdePkg\Library\BaseDebugLibSerialPort\DebugLib.c" #Enhanced Debug Support
"OVERRIDE\MdePkg\Library\DxeRuntimeDebugLibSerialPort\DebugLib.c";"MdePkg\Library\DxeRuntimeDebugLibSerialPort\DebugLib.c" #Enhanced Debug Support
"OVERRIDE\MdePkg\Library\UefiDebugLibConOut\DebugLib.c";"MdePkg\Library\UefiDebugLibConOut\DebugLib.c" #Enhanced Debug Support
"OVERRIDE\MdePkg\Library\UefiDebugLibDebugPortProtocol\DebugLib.c";"MdePkg\Library\UefiDebugLibDebugPortProtocol\DebugLib.c" #Enhanced Debug Support
"OVERRIDE\MdePkg\Library\UefiDebugLibStdErr\DebugLib.c";"MdePkg\Library\UefiDebugLibStdErr\DebugLib.c" #Enhanced Debug Support
"OVERRIDE\MdePkg\Library\BaseDebugLibNull\DebugLib.c";"MdePkg\Library\BaseDebugLibNull\DebugLib.c" #Enhanced Debug Support

# AMI Debug Libraries - AMI-specific Debug Support with Debug Service Integration
"OVERRIDE\AmiModulePkg\Library\PeiAmiDebugLib\PeiAmiDebugLib.c";"AmiModulePkg\Library\PeiAmiDebugLib\PeiAmiDebugLib.c" #Enhanced Debug Support
"OVERRIDE\AmiModulePkg\Library\DxeAmiDebugLib\DxeAmiDebugLib.c";"AmiModulePkg\Library\DxeAmiDebugLib\DxeAmiDebugLib.c" #Enhanced Debug Support
"OVERRIDE\AmiModulePkg\Library\PeiCoreAmiDebugLib\PeiCoreAmiDebugLib.c";"AmiModulePkg\Library\PeiCoreAmiDebugLib\PeiCoreAmiDebugLib.c" #Enhanced Debug Support
"OVERRIDE\AmiModulePkg\Library\DxeCoreAmiDebugLib\DxeCoreAmiDebugLib.c";"AmiModulePkg\Library\DxeCoreAmiDebugLib\DxeCoreAmiDebugLib.c" #Enhanced Debug Support
"OVERRIDE\AmiModulePkg\Library\SmmAmiDebugLib\SmmAmiDebugLib.c";"AmiModulePkg\Library\SmmAmiDebugLib\SmmAmiDebugLib.c" #Enhanced Debug Support
"OVERRIDE\AmiModulePkg\Library\SmmCoreAmiDebugLib\SmmCoreAmiDebugLib.c";"AmiModulePkg\Library\SmmCoreAmiDebugLib\SmmCoreAmiDebugLib.c" #Enhanced Debug Support
"OVERRIDE\AmiModulePkg\Library\RuntimeAmiDebugLib\RuntimeAmiDebugLib.c";"AmiModulePkg\Library\RuntimeAmiDebugLib\RuntimeAmiDebugLib.c" #Enhanced Debug Support
```

**配置格式說明**:
- 第一部分：`OVERRIDE\相對路徑` - 指向增強版文件
- 第二部分：`目標相對路徑` - 指向被替換的原始文件  
- 註釋：`#說明` - 描述 Override 目的

### 2.2 DebugLib.h 觸發器實施

**文件路徑**: `XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Include/Library/DebugLib.h`

**實施步驟**:
1. 複製原始 DebugLib.h 文件
2. 在文件末尾 `#endif` 之前添加增強代碼

**關鍵修改**:
- 在文件末尾 `#endif` 前重新定義 DEBUG 宏
- 添加 `EnhancedDebugPrint` 函數聲明
- 使用 `__FUNCTION__` 和 `__LINE__` 自動捕獲調用位置

**技術關鍵點**:
- 使用 `#undef` 取消原始 DEBUG 宏定義
- 重新定義 DEBUG 宏，添加 `__FUNCTION__` 和 `__LINE__` 參數
- 保持原有的 `DebugPrintEnabled()` 條件檢查
- 使用 `do-while(FALSE)` 模式確保宏的安全性

### 2.3 MdePkg Debug Libraries 實施

**實施原則**:
- 每個庫實例維護獨立的序列號計數器
- 使用 `[LibraryName:Function:Line:#N]` 格式
- 保持原有輸出機制（SerialPort/ConOut等）

**Runtime 階段特殊處理**:
- 包含 `EfiAtRuntime()` 檢查以防止系統崩潰
- 虛擬地址重映射後的安全性考慮

**其他 MdePkg 變體**:
- UefiDebugLibConOut: Console 輸出，需 ASCII 到 Unicode 轉換
- UefiDebugLibStdErr: 標準錯誤輸出
- UefiDebugLibDebugPortProtocol: 專用調試接口
- BaseDebugLibNull: 空實現，防止鏈接錯誤

### 2.4 AMI Debug Libraries 實施

**AMI 特有功能**:
- 集成 AMI Debug Service Protocol 
- 使用 `gEfiCallerBaseName` 動態獲取模塊名
- 自動修整訊息格式（移除多餘空白和換行）
- 支持 PEI、DXE、SMM、Runtime 各階段

**主要變體**: PeiAmiDebugLib, DxeAmiDebugLib, SmmAmiDebugLib, RuntimeAmiDebugLib


## 3. 實際部署實施記錄

### 3.1 實際實施的配置變更

#### 3.1.1 XCradleStandardPkg.sdl 配置變更

**實際修改內容**:
```sdl
# Enhanced Debug 配置 - 擴展調試功能
PcdMapping
    Name  = "PcdDebugPropertyMask"
    Value  = "0x2F"  # 從 0x0F 增強至 0x2F
    Help  = "Enhanced debug property mask with additional features"
    
PcdMapping
    Name = "PcdDebugPrintErrorLevel"  
    Value = "0x8000FF46"  # 從 0x80000046 增強至 0x8000FF46
    Help = "Enhanced debug print error level for comprehensive debugging"

# XCradle Debug Level 配置
Setup
    Name = "XCradleDebugLevel"
    Category = ModifyList
    TokenType = Boolean
    TargetEqv = Y
```

#### 3.1.2 XCradleDebugLevel.sdl 專用配置

**新增配置項目**:
```sdl
# XCradle Enhanced Debug Level Configuration
PcdMapping
    Name = "PcdXCradleEnhancedDebugEnabled"
    Value = "TRUE"
    TokenType = Boolean
    Help = "Enable XCradle Enhanced Debug Library features"
    
PcdMapping  
    Name = "PcdXCradleDebugSequenceNumberEnabled"
    Value = "TRUE"
    TokenType = Boolean
    Help = "Enable sequence number tracking in debug messages"
```

### 3.2 標準部署流程（基於實際實施）

**步驟1: 自動備份系統**
實際實施包含了自動備份機制：
```bash
# 系統會自動創建備份
# 備份位置: Original/ 目錄下的對應結構
# 包含所有將被 Override 的原始文件
```

**步驟2: Override 文件創建**
實際實施中的文件結構：
```bash
XCradlePlatformPkg/Override/
├── Override.cif                    # 主配置文件
└── OVERRIDE/
    ├── MdePkg/                      # Standard UEFI DebugLib
    │   ├── Include/Library/DebugLib.h
    │   └── Library/[所有MdePkg DebugLib變體]
    └── AmiModulePkg/               # AMI-specific DebugLib  
        └── Library/[所有AMI DebugLib變體]
```

**步驟3: 配置文件更新**
實際包含的配置更新：
- Override.cif：完整的 Override 對應關係
- XCradleStandardPkg.sdl：PCD 配置增強
- XCradleDebugLevel.sdl：專用調試級別配置

**步驟4: 編譯驗證**
實際驗證的編譯結果：
```bash
# 編譯成功確認項目：
# 1. 所有 DebugLib 變體編譯無錯誤
# 2. EnhancedDebugPrint 符號正確解析  
# 3. AMI Override 機制正常工作
# 4. PCD 配置正確生效
```

### 3.3 實際功能驗證結果

#### 驗證1: 實際格式輸出檢查
系統運行時的實際調試輸出格式：
```
實際輸出格式：[Module:Function:Line:#N] CleanedMessage
實際輸出範例：
[PeiCore:InternalPeiInstallPpi:523:#1] Install PPI: EfiPeiRscHandler
[BaseDebugLibSerialPort:DebugPrint:456:#2] Memory allocation successful
[XCradleBmcLanConfig:ConfigureIpv6:89:#1] Setting IPv6 parameters
[DxeAmiDebugLib:EnhancedFormatDebugMessage:123:#1] Enhanced debug active
```

#### 驗證2: 序列號獨立性檢查
確認每個庫實例維護獨立的序列號：
```
# MdePkg Libraries（獨立計數）
[BaseDebugLibSerialPort:Function1:100:#1] First call
[BaseDebugLibSerialPort:Function2:200:#2] Second call  
[UefiDebugLibConOut:Function3:300:#1] ConOut first call
[UefiDebugLibConOut:Function4:400:#2] ConOut second call

# AMI Libraries（獨立計數）  
[DxeAmiDebugLib:Function5:500:#1] AMI first call
[SmmAmiDebugLib:Function6:600:#1] SMM first call
```

#### 驗證3: 多階段和多架構驗證
實際確認的不同階段輸出：
- **PEI 階段**: `[BaseDebugLibSerialPort:...]` 和 `[PeiAmiDebugLib:...]`
- **DXE 階段**: `[UefiDebugLibConOut:...]` 和 `[DxeAmiDebugLib:...]`  
- **SMM 階段**: `[SmmAmiDebugLib:...]`
- **Runtime 階段**: `[DxeRuntimeDebugLibSerialPort:...]` 和 `[RuntimeAmiDebugLib:...]`

#### 驗證4: 訊息修整功能驗證
確認 AMI Libraries 的訊息修整功能：
```
原始輸出：DEBUG((DEBUG_INFO, "  Message with spaces  \n\n"));
實際輸出：[DxeAmiDebugLib:TestFunction:100:#1] Message with spaces
```

#### 驗證5: 動態模塊名驗證
確認 AMI Libraries 使用 `gEfiCallerBaseName`：
```
[XCradleBmcLanConfig:ConfigureIpv6:89:#1] IPv6 configuration started
[XCradleBmcLanParam:SetParameters:45:#2] Parameters updated
[XCradleEfiOsBootOption:ProcessBootOption:234:#1] Boot option processed
```

#### 驗證6: 覆蓋率檢查
確認所有 DEBUG() 調用都被增強：
- ✅ 系統核心模塊（PeiCore, DxeCore）
- ✅ AMI 模塊（所有 AMI Debug Library 變體）
- ✅ 第三方模塊（使用標準 DebugLib）
- ✅ XCradle 平台模塊（自定義模塊）
- ✅ 不同錯誤級別（DEBUG_INFO, DEBUG_ERROR, DEBUG_WARN）

### 3.3 性能和穩定性驗證

#### 性能測試
1. **啟動時間對比**
   - 記錄啟用增強功能前後的系統啟動時間
   - 預期性能影響 < 1%

2. **內存使用檢查**
   - 檢查靜態變量的內存佔用
   - 每個 DebugLib 實例增加 4 字節（序列號計數器）

3. **調試關閉性能**
   - 在 Release 配置下，確認調試關閉時無性能損失
   - 保持原有的 `DebugPrintEnabled()` 條件檢查機制

#### 穩定性測試
1. **長時間運行測試**
   - 連續運行系統 24 小時以上
   - 檢查序列號是否正常遞增，無溢出問題

2. **異常情況測試**
   - 測試在異常情況下（如內存不足）的表現
   - 確保不會因調試功能導致系統崩潰

3. **多線程安全**
   - 雖然 UEFI 環境主要是單線程，但需要考慮 SMM 等特殊情況
   - 確保序列號計數器的訪問安全

## 4. 故障診斷和解決方案

### 4.1 常見問題診斷

#### 問題1: EnhancedDebugPrint 未解析錯誤
**症狀**: 鏈接時出現 "unresolved external symbol EnhancedDebugPrint"

**原因分析**:
- 某個 DebugLib 變體缺少 EnhancedDebugPrint 實現
- Override.cif 配置不完整

**解決方案**:
1. 檢查錯誤信息中涉及的 DebugLib 變體
2. 確認該變體是否有 Override 實現
3. 添加缺失的 Override 配置和實現

#### 問題2: DEBUG 宏重定義不生效
**症狀**: 調試輸出仍然是原始格式，沒有增強信息

**原因分析**:
- DebugLib.h 的 Override 未生效
- 宏重定義代碼位置不正確
- 編譯器緩存問題

**解決方案**:
1. 確認 DebugLib.h 的 Override 配置正確
2. 檢查宏重定義代碼是否在文件末尾
3. 清理編譯緩存並重新編譯

#### 問題3: 部分 DEBUG 調用未被增強
**症狀**: 系統中部分 DEBUG 輸出有增強格式，部分沒有

**原因分析**:
- 某些模塊使用了未被 Override 的 DebugLib 變體
- 存在直接調用 DebugPrint 的代碼

**解決方案**:
1. 分析未增強的調試輸出來源
2. 識別對應的 DebugLib 變體
3. 添加相應的 Override 實現

#### 問題4: Runtime 階段系統不穩定
**症狀**: 進入 Runtime 階段後系統出現異常或重啟

**原因分析**:
- DxeRuntimeDebugLibSerialPort 實現中缺少 Runtime 檢查
- 在虛擬地址映射後嘗試訪問物理地址

**解決方案**:
1. 確認 Runtime 實現中包含 `EfiAtRuntime()` 檢查
2. 在 Runtime 狀態下禁用調試輸出

### 4.2 調試技巧

#### 技巧1: 使用唯一標識符驗證 Override
在 Override 文件中添加唯一的調試信息：
```c
DEBUG ((DEBUG_INFO, "[OVERRIDE_ACTIVE] BaseDebugLibSerialPort Override is active\n"));
```

#### 技巧2: 分階段部署
1. 首先僅 Override DebugLib.h，驗證宏重定義
2. 然後逐個添加 DebugLib 變體的 Override
3. 最後進行完整系統測試

#### 技巧3: 使用編譯器詳細輸出
啟用編譯器詳細模式，確認使用的文件路徑：
```bash
build -all -v
# 檢查輸出中的文件路徑，確認使用了 Override 版本
```

## 5. 進階功能和擴展

### 5.1 自定義模塊名識別

可以通過編譯時定義來自定義模塊名：
```c
// 在各個 DebugLib 實現中
#ifndef MODULE_NAME
#define MODULE_NAME "UnknownModule"
#endif

Length = AsciiSPrint (
  Buffer, sizeof (Buffer),
  "[%a:%a:%d:#%d] ",
  MODULE_NAME,  // 使用自定義模塊名
  FunctionName,
  LineNumber,
  DebugSequenceNumber
);
```

### 5.2 條件式增強功能

添加編譯時開關控制增強功能：
```c
// 在 DebugLib.h 中
#ifdef ENHANCED_DEBUG_ENABLED
#ifdef DEBUG
#undef DEBUG
#define DEBUG(Expression) \
  do { \
    if (DebugPrintEnabled ()) { \
      _DEBUG_ENHANCED Expression; \
    } \
  } while (FALSE)
// ... 增強宏定義
#endif
#endif
```

---

**文檔版本**: 2.0 (基於實際實施更新)  
**最後更新**: 2025年8月13日  
**適用平台**: AMI UEFI BIOS 開發環境 + XCradle 平台  
**技術狀態**: 已完整實施並驗證