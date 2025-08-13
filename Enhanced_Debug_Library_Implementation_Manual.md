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
# 創建 Override 目錄結構
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Include/Library
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/BaseDebugLibSerialPort
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/DxeRuntimeDebugLibSerialPort  
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/UefiDebugLibConOut
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/UefiDebugLibDebugPortProtocol
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/UefiDebugLibStdErr
mkdir -p XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/BaseDebugLibNull

# 創建備份目錄
mkdir -p Original/MdePkg/Include/Library
mkdir -p Original/MdePkg/Library/BaseDebugLibSerialPort
# [其他對應目錄...]
```

## 2. 核心文件實施詳解

### 2.1 Override.cif 配置文件

**文件路徑**: `XCradlePlatformPkg/Override/Override.cif`

**完整配置內容**:
```
# Enhanced Debug Library - MdePkg DebugLib Override
# 此配置實現透明化 DEBUG() 宏增強功能

# 核心觸發器文件 - 包含 DEBUG 宏重定義
"OVERRIDE\MdePkg\Include\Library\DebugLib.h";"MdePkg\Include\Library\DebugLib.h" #Enhanced Debug Support

# PEI/DXE 階段主要實現 - 使用 SerialPort 輸出
"OVERRIDE\MdePkg\Library\BaseDebugLibSerialPort\DebugLib.c";"MdePkg\Library\BaseDebugLibSerialPort\DebugLib.c" #Enhanced Debug Support

# Runtime 階段實現 - 支持運行時調試
"OVERRIDE\MdePkg\Library\DxeRuntimeDebugLibSerialPort\DebugLib.c";"MdePkg\Library\DxeRuntimeDebugLibSerialPort\DebugLib.c" #Enhanced Debug Support

# Console 輸出實現 - DXE 階段可視化輸出
"OVERRIDE\MdePkg\Library\UefiDebugLibConOut\DebugLib.c";"MdePkg\Library\UefiDebugLibConOut\DebugLib.c" #Enhanced Debug Support

# DebugPort Protocol 實現 - 專用調試接口
"OVERRIDE\MdePkg\Library\UefiDebugLibDebugPortProtocol\DebugLib.c";"MdePkg\Library\UefiDebugLibDebugPortProtocol\DebugLib.c" #Enhanced Debug Support

# 標準錯誤輸出實現 - 錯誤信息專用通道
"OVERRIDE\MdePkg\Library\UefiDebugLibStdErr\DebugLib.c";"MdePkg\Library\UefiDebugLibStdErr\DebugLib.c" #Enhanced Debug Support

# Null 實現 - 防止鏈接錯誤
"OVERRIDE\MdePkg\Library\BaseDebugLibNull\DebugLib.c";"MdePkg\Library\BaseDebugLibNull\DebugLib.c" #Enhanced Debug Support
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

**關鍵增強代碼**:
```c
//
// Enhanced Debug Library - Transparent DEBUG() Macro Redefinition
// This section automatically enhances all DEBUG() calls with function name and line number
//
// NOTE: This must be at the end of the file to override the standard DEBUG macro
//

#ifdef DEBUG
#undef DEBUG
#define DEBUG(Expression) \
  do { \
    if (DebugPrintEnabled ()) { \
      _DEBUG_ENHANCED Expression; \
    } \
  } while (FALSE)

#define _DEBUG_ENHANCED(ErrorLevel, Format, ...) \
  EnhancedDebugPrint(ErrorLevel, __FUNCTION__, __LINE__, Format, ##__VA_ARGS__)
#endif

/**
  Enhanced debug print function with automatic function name, line number, and sequence tracking.
  
  This function formats debug messages with the pattern: [Module:Function:Line:#N] message
  where N is an incrementing sequence number for tracking debug call order.

  @param  ErrorLevel    The error level of the debug message.
  @param  FunctionName  Name of the calling function (__FUNCTION__).
  @param  LineNumber    Line number where DEBUG() was called (__LINE__).
  @param  Format        Format string for the debug message to print.
  @param  ...           Variable argument list based on format string.

**/
VOID
EFIAPI
EnhancedDebugPrint (
  IN  UINTN        ErrorLevel,
  IN  CONST CHAR8  *FunctionName,
  IN  UINT32       LineNumber,
  IN  CONST CHAR8  *Format,
  ...
  );
```

**技術關鍵點**:
- 使用 `#undef` 取消原始 DEBUG 宏定義
- 重新定義 DEBUG 宏，添加 `__FUNCTION__` 和 `__LINE__` 參數
- 保持原有的 `DebugPrintEnabled()` 條件檢查
- 使用 `do-while(FALSE)` 模式確保宏的安全性

### 2.3 BaseDebugLibSerialPort 實施（核心實現）

**文件路徑**: `XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/BaseDebugLibSerialPort/DebugLib.c`

**完整實施代碼**:
```c
/**
  Enhanced debug print function with automatic function name, line number, and sequence tracking.
  
  This function is the core implementation for PEI and DXE phases using SerialPort output.
  It formats debug messages with the pattern: [Module:Function:Line:#N] message
  
  @param  ErrorLevel    The error level of the debug message.
  @param  FunctionName  Name of the calling function (__FUNCTION__).
  @param  LineNumber    Line number where DEBUG() was called (__LINE__).
  @param  Format        Format string for the debug message to print.
  @param  ...           Variable argument list based on format string.
**/
VOID
EFIAPI
EnhancedDebugPrint (
  IN  UINTN        ErrorLevel,
  IN  CONST CHAR8  *FunctionName,
  IN  UINT32       LineNumber,
  IN  CONST CHAR8  *Format,
  ...
  )
{
  CHAR8    Buffer[MAX_DEBUG_MESSAGE_LENGTH];
  VA_LIST  Marker;
  UINTN    Length;
  
  // Static sequence counter for debug call tracking
  // Each DebugLib instance maintains its own counter
  static UINT32 DebugSequenceNumber = 0;
  
  // Increment sequence number (atomic-like operation for single-threaded PEI/DXE)
  DebugSequenceNumber++;
  
  // Format enhanced prefix: [Module:Function:Line:#N] 
  // Module name is derived from the DebugLib variant name
  Length = AsciiSPrint (
    Buffer,
    sizeof (Buffer),
    "[BaseDebugLibSerialPort:%a:%d:#%d] ",
    FunctionName,
    LineNumber,
    DebugSequenceNumber
  );
  
  // Append original message with variable arguments
  VA_START (Marker, Format);
  Length += AsciiVSPrint (
    Buffer + Length,
    sizeof (Buffer) - Length,
    Format,
    Marker
  );
  VA_END (Marker);
  
  // Output via SerialPort (same as original mechanism)
  SerialPortWrite ((UINT8 *)Buffer, Length);
}
```

**實施要點**:
1. 維持與原 DebugLib 相同的函數簽名模式
2. 使用靜態變量追蹤調用序列
3. 保持原有的 SerialPort 輸出機制
4. 緩衝區大小與原實現保持一致

### 2.4 DxeRuntimeDebugLibSerialPort 實施（Runtime 支持）

**文件路徑**: `XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/DxeRuntimeDebugLibSerialPort/DebugLib.c`

**關鍵實施代碼**:
```c
VOID
EFIAPI
EnhancedDebugPrint (
  IN  UINTN        ErrorLevel,
  IN  CONST CHAR8  *FunctionName,
  IN  UINT32       LineNumber,
  IN  CONST CHAR8  *Format,
  ...
  )
{
  CHAR8    Buffer[MAX_DEBUG_MESSAGE_LENGTH];
  VA_LIST  Marker;
  UINTN    Length;
  
  static UINT32 DebugSequenceNumber = 0;
  
  // Critical: Skip during runtime if virtual addressing is active
  // This prevents system crashes in Runtime phase
  if (EfiAtRuntime ()) {
    return;
  }
  
  DebugSequenceNumber++;
  
  // Format with Runtime-specific module identifier
  Length = AsciiSPrint (
    Buffer,
    sizeof (Buffer),
    "[DxeRuntimeDebugLibSerialPort:%a:%d:#%d] ",
    FunctionName,
    LineNumber,
    DebugSequenceNumber
  );
  
  VA_START (Marker, Format);
  Length += AsciiVSPrint (
    Buffer + Length,
    sizeof (Buffer) - Length,
    Format,
    Marker
  );
  VA_END (Marker);
  
  SerialPortWrite ((UINT8 *)Buffer, Length);
}
```

**Runtime 階段特殊考慮**:
- 必須檢查 `EfiAtRuntime()` 狀態
- Runtime 期間可能無法安全訪問某些硬件資源
- 虛擬地址重映射後的安全性考慮

### 2.5 UefiDebugLibConOut 實施（Console 輸出）

**文件路徑**: `XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/UefiDebugLibConOut/DebugLib.c`

**實施代碼**:
```c
VOID
EFIAPI
EnhancedDebugPrint (
  IN  UINTN        ErrorLevel,
  IN  CONST CHAR8  *FunctionName,
  IN  UINT32       LineNumber,
  IN  CONST CHAR8  *Format,
  ...
  )
{
  CHAR8    Buffer[MAX_DEBUG_MESSAGE_LENGTH];
  CHAR16   UnicodeBuffer[MAX_DEBUG_MESSAGE_LENGTH];
  VA_LIST  Marker;
  UINTN    Length;
  
  static UINT32 DebugSequenceNumber = 0;
  
  // Check if Console Output is available
  if (gST == NULL || gST->ConOut == NULL) {
    return;
  }
  
  DebugSequenceNumber++;
  
  // Format with ConOut-specific module identifier
  Length = AsciiSPrint (
    Buffer,
    sizeof (Buffer),
    "[UefiDebugLibConOut:%a:%d:#%d] ",
    FunctionName,
    LineNumber,
    DebugSequenceNumber
  );
  
  VA_START (Marker, Format);
  Length += AsciiVSPrint (
    Buffer + Length,
    sizeof (Buffer) - Length,
    Format,
    Marker
  );
  VA_END (Marker);
  
  // Convert ASCII to Unicode for ConOut
  AsciiStrToUnicodeStrS (Buffer, UnicodeBuffer, sizeof (UnicodeBuffer) / sizeof (CHAR16));
  
  // Output to Console
  gST->ConOut->OutputString (gST->ConOut, UnicodeBuffer);
}
```

**Console 輸出特點**:
- 需要 ASCII 到 Unicode 的字符轉換
- 檢查 System Table 和 ConOut 的可用性
- 適用於 DXE 階段的可視化調試

### 2.6 其他 DebugLib 變體實施

#### UefiDebugLibStdErr 實施
```c
VOID EFIAPI EnhancedDebugPrint (...) {
  // 檢查 StdErr 可用性
  if (gST == NULL || gST->StdErr == NULL) {
    return;
  }
  
  // 格式化並轉換為 Unicode
  // 輸出到 StdErr
  gST->StdErr->OutputString (gST->StdErr, UnicodeBuffer);
}
```

#### UefiDebugLibDebugPortProtocol 實施
```c
VOID EFIAPI EnhancedDebugPrint (...) {
  // 使用 DebugPort Protocol 輸出
  // 適用於專用調試接口
  UefiDebugLibDebugPortProtocolWrite (Buffer, Length);
}
```

#### BaseDebugLibNull 實施
```c
VOID EFIAPI EnhancedDebugPrint (...) {
  // Null implementation - do nothing
  // 防止鏈接錯誤，當系統不需要調試輸出時使用
}
```

## 3. 部署和驗證流程

### 3.1 標準部署流程

**步驟1: 備份原始文件**
```bash
# 備份所有將被 Override 的原始文件
cp MdePkg/Include/Library/DebugLib.h Original/MdePkg/Include/Library/
cp MdePkg/Library/BaseDebugLibSerialPort/DebugLib.c Original/MdePkg/Library/BaseDebugLibSerialPort/
# [備份其他文件...]
```

**步驟2: 創建 Override 文件**
```bash
# 複製原始文件到 Override 目錄
cp MdePkg/Include/Library/DebugLib.h XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Include/Library/
cp MdePkg/Library/BaseDebugLibSerialPort/DebugLib.c XCradlePlatformPkg/Override/OVERRIDE/MdePkg/Library/BaseDebugLibSerialPort/
# [複製其他文件...]
```

**步驟3: 修改 Override 文件**
- 按照本手冊的實施代碼修改各個文件
- 確保每個文件都包含正確的 EnhancedDebugPrint 實現

**步驟4: 更新 Override.cif**
- 將所有 Override 關係添加到配置文件中
- 確保路徑格式正確

**步驟5: 編譯驗證**
```bash
# 執行完整編譯
build -all

# 檢查編譯輸出，確認：
# 1. 無編譯錯誤
# 2. 無鏈接錯誤  
# 3. 無未解析符號錯誤
```

### 3.2 功能驗證方法

#### 驗證1: 格式檢查
運行系統並檢查調試輸出格式：
```
期望格式：[Module:Function:Line:#N] OriginalMessage
實際輸出例子：
[PeiCore:InternalPeiInstallPpi:523:#1] Install PPI: EfiPeiRscHandler
[BaseDebugLibSerialPort:DebugPrint:456:#2] Memory allocation successful
```

#### 驗證2: 序列號檢查
確認序列號正確遞增：
```
[Module:Function1:100:#1] First call
[Module:Function2:200:#2] Second call  
[Module:Function1:105:#3] Third call
```

#### 驗證3: 多階段檢查
確認不同 UEFI 階段都有正確的增強輸出：
- PEI 階段：`[BaseDebugLibSerialPort:...]`
- DXE 階段：`[UefiDebugLibConOut:...]` 或其他變體
- Runtime 階段：`[DxeRuntimeDebugLibSerialPort:...]`

#### 驗證4: 覆蓋率檢查
確認所有 DEBUG() 調用都被增強：
- 系統模塊的 DEBUG 調用
- 第三方模塊的 DEBUG 調用
- 不同錯誤級別的 DEBUG 調用

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

### 5.3 時間戳支持

為高精度調試添加時間戳：
```c
VOID EFIAPI EnhancedDebugPrint (...) {
  UINT64 TimeStamp = GetPerformanceCounter();
  
  Length = AsciiSPrint (
    Buffer, sizeof (Buffer),
    "[%a:%a:%d:#%d@%llu] ",
    ModuleName, FunctionName, LineNumber, DebugSequenceNumber, TimeStamp
  );
  // ...
}
```

## 6. 維護和更新指南

### 6.1 版本更新流程
1. **備份當前配置**：保存當前的 Override 配置和實現
2. **更新基礎平台**：更新底層 UEFI 平台代碼
3. **同步 Override 文件**：檢查並更新 Override 文件以匹配新版本
4. **重新測試驗證**：執行完整的功能和性能測試

### 6.2 團隊協作規範
1. **文檔同步**：保持技術文檔與實現同步
2. **代碼審查**：所有 Override 文件修改都需要代碼審查
3. **測試規範**：建立標準的測試流程和驗收標準
4. **變更記錄**：記錄所有技術變更和影響評估

### 6.3 長期維護建議
1. **定期審查**：定期審查 Override 實現的有效性
2. **性能監控**：持續監控系統性能影響
3. **功能擴展**：根據開發需求適當擴展功能
4. **標準化推廣**：在組織內標準化使用流程

---

**文檔版本**: 1.0  
**最後更新**: 2025年8月5日  
**適用平台**: AMI UEFI BIOS 開發環境  
**技術狀態**: 已驗證可用