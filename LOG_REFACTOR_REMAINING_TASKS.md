# 日誌重構剩餘任務清單

## 📋 項目概況

**目標**: 將所有 `logMessage` 調用重構為適當的日誌級別 (`logInfo`, `logDebug`, `logError`, `logWarn`, `logSummary`)

**進度**: 已完成約 60%，剩餘 40% 待處理

---

## ✅ 已完成的檔案

### 階段 1 & 2: 核心檔案 (已完成)
- ✅ `src/veb-build/commands/buildCommands.ts` - 25+ logMessage 調用已重構
- ✅ `src/edk2-debug/commands/edk2DebugCommands.ts` - 7 logMessage 調用已重構  
- ✅ `src/language-support/commands/formatterCommands.ts` - 7 logMessage 調用已重構

### 階段 3: 基礎檔案 (已完成)
- ✅ `src/language-support/providers/formattingProvider.ts` - 2 calls → logError
- ✅ `src/shared/utils/file.ts` - 4 calls → logInfo
- ✅ `src/language-support/commands/providerCommands.ts` - 8 calls → 6 logInfo + 2 logError
- ✅ `src/veb-build/tools/expandMakefileVars.ts` - 5 calls → mixed levels
- ✅ `src/extension.ts` - 3 calls → logInfo
- ✅ `src/shared/ui/statusBar.ts` - 7 calls → 4 logInfo + 3 logDebug
- ✅ `src/language-support/core/edk2Formatter.ts` - 無 logMessage 調用
- ✅ `src/language-support/core/edk2Parser.ts` - 5 calls → logDebug

---

## 🔄 剩餘待處理檔案

### 高優先級 - edk2-debug 模組 (複雜度: 中-高)

**這些是 EDK2 韌體除錯和分析核心模組，需要仔細分類**

1. **`src/edk2-debug/providers/enhancedDebugProvider.ts`**
   - **預估**: ~15-20 logMessage 調用
   - **複雜度**: 高 (樹狀視圖提供者，複雜的 UI 邏輯)
   - **建議分類**: UI 操作 → logInfo, 內部狀態 → logDebug, 失敗 → logError

2. **`src/edk2-debug/analysis/enhancedLogParser.ts`**
   - **預估**: ~10-15 logMessage 調用
   - **複雜度**: 高 (日誌解析引擎)
   - **建議分類**: 解析步驟 → logDebug, 完成狀態 → logInfo, 解析失敗 → logError

3. **`src/edk2-debug/core/crossFolderNavigator.ts`**
   - **預估**: ~8-10 logMessage 調用
   - **複雜度**: 中 (跨資料夾導航)
   - **建議分類**: 搜索失敗 → logError, 搜索步驟 → logDebug

4. **`src/edk2-debug/core/moduleEnhancer.ts`**
   - **預估**: ~10-12 logMessage 調用
   - **複雜度**: 中 (模組增強邏輯)
   - **建議分類**: 增強失敗 → logError, 增強步驟 → logDebug, 完成 → logInfo

5. **`src/edk2-debug/core/moduleScanner.ts`**
   - **預估**: ~15-20 logMessage 調用
   - **複雜度**: 中-高 (模組掃描引擎)
   - **建議分類**: 掃描統計 → logSummary, 掃描步驟 → logDebug, 錯誤 → logError

6. **`src/edk2-debug/core/edk2ModuleProvider.ts`**
   - **預估**: ~20-25 logMessage 調用
   - **複雜度**: 高 (EDK2 模組提供者核心)
   - **建議分類**: 模組載入 → logInfo, 失敗列表 → logError, 統計 → logSummary

### 低優先級 - 小型檔案 (複雜度: 低)

7. **`src/edk2-debug/providers/logLinkProvider.ts`**
   - **預估**: ~3-5 logMessage 調用
   - **複雜度**: 低 (日誌連結提供者)

8. **`src/edk2-debug/index.ts`**
   - **預估**: ~2-3 logMessage 調用
   - **複雜度**: 低 (模組入口點)

9. **`src/edk2-debug/commands/jumpToSourceCommand.ts`**
   - **預估**: ~3-5 logMessage 調用
   - **複雜度**: 低 (跳轉到源碼命令)

---

## 📏 分類標準指南

### 🔴 logError (錯誤)
- 檔案讀取失敗
- 解析失敗 
- 模組掃描失敗
- 任務執行失敗
- 找不到工作區

### 🟡 logWarn (警告)
- 設定不完整但可繼續
- 檔案不存在但有替代方案
- 相容性問題
- 棄用功能使用

### 🔵 logInfo (一般資訊)
- 任務開始/完成狀態
- 檔案讀取成功
- 使用者操作確認
- 重要狀態變更
- 模組載入完成

### 🟢 logDebug (除錯詳細)
- 詳細的執行步驟
- 變數值輸出
- 內部狀態變化
- 檔案路徑解析過程
- 演算法內部邏輯

### 🟣 logSummary (重要摘要)
- 編譯時間統計
- 模組掃描統計
- 分析結果摘要
- 性能指標
- 使用者關心的最終結果

---

## 🛠️ 實作步驟建議

### 對於每個檔案：

1. **讀取檔案**
   ```bash
   # 檢查 logMessage 使用情況
   grep -n "logMessage" [檔案路径]
   ```

2. **更新 import 語句**
   ```typescript
   // 從:
   import { logMessage, handleError } from '../../shared/utils/logger';
   
   // 改為:
   import { logMessage, logInfo, logDebug, logError, logSummary, handleError } from '../../shared/utils/logger';
   ```

3. **逐一分析並替換**
   - 根據上下文和訊息內容判斷適當級別
   - 保持訊息內容完全相同，只變更函數名稱

4. **驗證**
   - 確認所有 logMessage 調用已替換
   - 確認 import 語句正確
   - 檢查編譯錯誤

---

## 📊 預估工作量

- **總剩餘調用數**: ~90-130 個 logMessage 調用
- **預估時間**: 2-3 小時
- **建議批次處理順序**:
  1. 先處理小型檔案 (7-9) - 30分鐘
  2. 再處理中等複雜度檔案 (3-4) - 1小時  
  3. 最後處理高複雜度檔案 (1-2, 5-6) - 1-1.5小時

---

## 🔍 驗證完成度

完成後可用以下命令確認：

```bash
# 檢查剩餘的 logMessage 調用 (應該為 0)
find . -name "*.ts" -exec grep -c "logMessage" {} \; | awk '{sum+=$1} END {print "Remaining logMessage calls: " sum}'

# 檢查各日誌級別分布
find . -name "*.ts" -exec grep -o "logMessage\|logInfo\|logDebug\|logWarn\|logError\|logSummary" {} \; | sort | uniq -c
```

---

## 📝 注意事項

1. **保持訊息內容不變** - 只變更函數名稱
2. **仔細分析上下文** - edk2-debug 檔案邏輯複雜
3. **批量測試** - 完成一個檔案就測試編譯
4. **保留既有的 logError/logInfo 等調用** - 不要修改已經正確的調用

---

*最後更新: 2025-08-19*  
*建立者: Claude Code*