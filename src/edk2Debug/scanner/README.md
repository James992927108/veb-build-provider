# EDK2 Scanner 模組結構簡化說明

## 簡化前的問題
1. **功能重複**: ProjectAnalyzer 和 edk2ModuleProvider 都在使用 ModuleScanner
2. **動態導入**: ModuleScanner 使用動態導入 InfParser，增加複雜性
3. **職責不清**: ProjectAnalyzer 實際上做了與 edk2ModuleProvider 類似的工作

## 簡化後的結構

### 📁 scanner/
```
├── 📄 index.ts          (統一API出口 + 便捷函數)
├── 📄 infParser.ts      (INF檔案解析器 - 單一職責)
├── 📄 moduleScanner.ts  (模組掃描器 - 主要介面)
└── 📄 projectAnalyzer.ts (專案統計分析器)
```

### 新的呼叫關係
```
edk2ModuleProvider.ts
├── 主要使用 ModuleScanner.scanAndParseWorkspace()
└── 統計功能使用 ProjectAnalyzer.getProjectStatistics()

ModuleScanner (核心類別)
├── 包含 InfParser 實例 (靜態導入)
├── scanInfFiles() - 掃描檔案路徑
├── scanWorkspace() - 掃描並返回路徑
├── scanAndParseWorkspace() - 掃描並解析所有INF
└── rescanModule() - 重新掃描單個模組

ProjectAnalyzer (統計分析)
└── 內部使用 ModuleScanner.scanAndParseWorkspace()
```

## 主要改進

### 1. 消除動態導入
**前**: `const { InfParser } = await import('./infParser');`
**後**: `import { InfParser } from './infParser';` + 類別成員

### 2. 統一API介面
ModuleScanner 現在提供：
- `scanInfFiles()` - 只掃描檔案路徑
- `scanAndParseWorkspace()` - 掃描並解析 (新增)
- `rescanModule()` - 重新掃描單個模組

### 3. 便捷函數
在 `index.ts` 中提供：
```typescript
// 快速掃描工作區
const modules = await scanWorkspace(workspaceRoot);

// 快速獲取專案統計
const stats = await getProjectStats(workspaceRoot);
```

### 4. 清晰的職責分工
- **InfParser**: 純粹的INF檔案解析
- **ModuleScanner**: 檔案掃描 + 解析的主要介面
- **ProjectAnalyzer**: 專案統計分析
- **index.ts**: 統一API出口 + 便捷函數

## 使用建議

### 對於 edk2ModuleProvider.ts
建議使用新的 `scanAndParseWorkspace()` 方法替換原來的分步驟操作：

```typescript
// 替換
const infPaths = await this.moduleScanner.scanWorkspace();
// 然後逐個解析...

// 使用
const modules = await this.moduleScanner.scanAndParseWorkspace();
```

### 對於新開發
直接使用便捷函數：
```typescript
import { scanWorkspace, getProjectStats } from '../scanner';

const modules = await scanWorkspace(workspaceRoot);
const stats = await getProjectStats(workspaceRoot);
```

## Build 資料夾排除
已在排除模式中添加所有build資料夾變體：
- `**/Build/**`
- `**/build/**` 
- `**/BUILD/**`
- `**/BuildBrh/**`
