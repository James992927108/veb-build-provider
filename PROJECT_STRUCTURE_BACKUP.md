# VEB Build Provider 專案結構備份

記錄時間：2025-07-18

## 主要資料夾結構

```
veb-build-provider/
├── package.json                   # 專案配置文件
├── tsconfig.json                  # TypeScript 配置
├── README.md                      # 說明文件
├── CHANGELOG.md                   # 變更日誌
├── REFACTORING_REPORT.md          # 重構報告
├── USAGE_GUIDE.md                 # 使用指南
├── VERIFICATION_CHECKLIST.md     # 驗證清單
├── test.veb                       # VEB 測試文件
├── release.py                     # 發布腳本
├── verify_functionality.sh       # 功能驗證腳本
└── vsc-extension-quickstart.md   # VS Code 擴展快速開始

├── config/                        # 配置文件
│   ├── languages/                 # 語言配置文件
│   │   ├── edk2_*.conf.json      # EDK2 相關語言配置
│   │   ├── language-configuration_*.json  # 語言配置
│   └── syntaxes/                  # 語法高亮文件
│       ├── BiosLanguage.tmLanguage_*.json
│       ├── edk2_*.tmLanguage.json
│       └── language-x86_64-assembly.tmLanguage.json

├── resource/                      # 資源文件
│   ├── icons/                     # 圖標文件
│   │   ├── cpu.svg, cube.svg, dep.svg, etc.
│   └── snippets/                  # 程式碼片段
│       └── edk2_c.snippet.json

├── scripts/                       # 腳本文件
│   ├── ExpandMakefileVars.py     # Makefile 變數展開腳本
│   ├── PrepareEnvScript.bat      # Windows 環境準備腳本
│   ├── PrepareEnvLinuxScript.sh  # Linux 環境準備腳本
│   └── sol_log_analyzer.py       # SOL 日誌分析器

├── src/                          # 原始碼
│   ├── extension.ts              # 主擴展文件
│   │
│   ├── edk2-debug/               # EDK2 調試功能
│   │   ├── constants.ts          # 常數定義
│   │   ├── index.ts              # 模組入口
│   │   ├── types.ts              # 類型定義
│   │   ├── analysis/             # 分析功能
│   │   │   ├── htmlReportGenerator.ts
│   │   │   ├── jsonLogParser.ts
│   │   │   └── logAnalyzer.ts
│   │   ├── commands/             # 命令處理
│   │   │   └── edk2DebugCommands.ts
│   │   └── core/                 # 核心功能
│   │       ├── edk2ModuleProvider.ts
│   │       ├── infParser.ts
│   │       ├── moduleEnhancer.ts
│   │       ├── moduleScanner.ts
│   │       └── projectAnalyzer.ts
│   │
│   ├── language-support/         # 語言支援功能
│   │   ├── index.ts              # 模組入口
│   │   ├── registry.ts           # 註冊器
│   │   ├── commands/             # 命令處理
│   │   │   ├── formatterCommands.ts
│   │   │   └── formatterCommandsEntry.ts
│   │   ├── core/                 # 核心功能
│   │   │   ├── edk2Formatter.ts
│   │   │   └── edk2Parser.ts
│   │   └── providers/            # 提供者
│   │       ├── definitionProvider.ts
│   │       ├── formattingProvider.ts
│   │       └── symbolProvider.ts
│   │
│   ├── log-analysis/             # 日誌分析功能
│   │   ├── index.ts              # 模組入口
│   │   └── commands/             # 命令處理
│   │       └── logAnalysisCommands.ts
│   │
│   ├── shared/                   # 共享功能
│   │   ├── index.ts              # 模組入口
│   │   ├── ui/                   # 使用者介面
│   │   │   └── statusBar.ts
│   │   └── utils/                # 工具程式
│   │       ├── commandRegistry.ts
│   │       ├── constants.ts
│   │       ├── file.ts
│   │       └── logger.ts
│   │
│   └── veb-build/                # VEB 建置功能
│       ├── index.ts              # 模組入口
│       ├── commands/             # 命令處理
│       │   └── buildCommands.ts  # 建置命令 (核心功能)
│       └── tools/                # 工具程式
│           └── expandMakefileVars.ts

├── out/                          # 編譯輸出 (與 src/ 結構相同)
├── node_modules/                 # 相依套件
├── temp/                         # 暫存文件
├── templates/                    # 模板文件
│   └── debug_report.html
├── test_files/                   # 測試文件
│   ├── test.dsc
│   └── test.inf
└── tools/                        # 工具程式
    └── tee.exe
```

## 核心建置功能文件

**重要：** `src/veb-build/commands/buildCommands.ts` 是核心建置功能文件，包含：
- VEB 建置任務初始化 (`handleInitTask`)
- VEB 建置執行 (`handleVebBuild`)
- VEB 重建執行 (`handleVebReBuild`)
- 終端控制 (`handleterminateTerminal`)
- 任務配置生成 (`BuildDefaultTask`)

## 功能模組說明

1. **edk2-debug/**: EDK2 調試和分析功能
2. **language-support/**: 語言支援和格式化功能
3. **log-analysis/**: 日誌分析功能
4. **veb-build/**: VEB 建置系統核心功能
5. **shared/**: 各模組共享的工具和常數

## 配置文件

- **config/languages/**: 各種 EDK2 文件類型的語言配置
- **config/syntaxes/**: TextMate 語法高亮定義
- **resource/**: 圖標和程式碼片段資源

## 還原狀態更新

**還原完成時間：** 2025-07-18

### 還原操作摘要
- ✅ **源版本：** v3.2.0 (commit: 029182e) - 功能正常的版本
- ✅ **目標結構：** 當前模組化結構 (`src/veb-build/commands/buildCommands.ts`)
- ✅ **還原內容：** 核心建置功能 (`BuildDefaultTask`, `handleInitTask`, 等)
- ✅ **路徑調整：** 更新 import 路徑以適配新的模組化結構
- ✅ **編譯測試：** 通過 TypeScript 編譯
- ✅ **Git 提交：** `a655e71` - "restore: Successfully restore core build functionality from v3.2.0 (029182e) to current modular structure"

### 重要變更
1. **功能還原：** 從簡化版本還原到完整的 VEB 文件解析和任務生成功能
2. **模組化適配：** 保持當前的模組化文件結構，只更新核心建置邏輯
3. **路徑修正：** 所有 import 路徑已更新為 `../../shared/utils/*` 格式

此結構記錄將用於程式碼還原後的重構參考。
