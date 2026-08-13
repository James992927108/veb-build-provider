# Optimization Backlog — veb-build-provider

來源：多 agent 平行分析（workflow `wf_bddb2ada-0e4`，5 agents，2026-08-13）。
原則：**每項改動前先有測試護住 → 改 → 跑 `npm test` 驗證無回歸 → commit**。不得盲改。
安全性上限：唯一基準 `npm run compile` + `npm test` 全綠才能推進。

## 測試安全網（已建立）
- `npm test` — headless mocha（vscode stub），目前 logger 基底測試通過
- `npm run test:syntax` — grammar scope 一致性

## 優先化藍圖（多 agent 合成）

### Quick Wins（低風險、高價值，先做）
- [x] OPT-5  spawn error handler + 非 Windows 用 python3 — `expandMakefileVars.ts` (P1)
- [x] OPT-6  還原 Windows build-log 時間戳 HHMMSS — `buildCommands.ts` (P2)
- [x] OPT-18 移除 dead imports/branch — `expandMakefileVars.ts`、`logLinkProvider.ts` 等
- [x] OPT-13/20 logging 政策：console.warn/console.error→logX；initLogger logMessage→logInfo；中文註解→英文 — `globalConfig.ts`、`infParser.ts`、`moduleEnhancer.ts`、`logger.ts`
- [x] OPT-11 修正 getRootPath whitespace no-op — `edk2Parser.ts`
- [x] OPT-22 DRY 錯誤描述 — `shared/utils/file.ts`

### P1
- [ ] OPT-1  INF go-to-definition 回歸（dead provider audit 前先鎖測試）— `edk2Parser.ts`
- [x] OPT-2  workspaceRoot 貫穿 scanInfFiles — `moduleScanner.ts`
- [x] OPT-3  以 debug 檔控 gate parseLogLine 每行 logDebug — `enhancedLogParser.ts`
- [x] OPT-4  統一 VEB-name 擷取 helper — `buildCommands.ts`

### P2
- [ ] OPT-7  verifyWith fixer 單行 if 解析一致性 — `moduleEnhancer.ts`
- [x] OPT-8  findFiles 截斷 100 問題 — `crossFolderNavigator.ts`
- [x] OPT-9  UniLineFormatter 漏 #language 噴 undefined — `edk2Formatter.ts`
- [x] OPT-10 CRLF `\r` 殘留 — `symbolProvider.ts`
- [ ] OPT-12 tasks.json 用 object+JSON.stringify — `buildCommands.ts`
- [x] OPT-14 預編譯 exclude regex — `moduleScanner.ts`
- [x] OPT-15 去重 4 個 definition provider — `definitionProvider.ts`
- [x] OPT-16 提取 extractValue + 校驗非空 — `buildCommands.ts`
- [x] OPT-17 tasks.json 只讀一次 — `buildCommands.ts`
- [ ] OPT-19 收斂整個文件 formatter — `edk2Formatter.ts`
- [x] OPT-21 gate outputChannel.show() — `extension.ts`

## 需先補回歸測試的高風險區（改之前）
- edk2-debug：crossFolderNavigator、moduleScanner、logLinkProvider.performJump、moduleEnhancer
- language-support：symbolProvider(CRLF)、edk2Formatter(UniLineFormatter/formatContent)
- veb-build：buildCommands（VEB-name、tasks.json、timestamp）

## 測試策略
- 純邏輯抽取後用 headless mocha + vscode stub 測試
- 重點 helper：VEB-name 擷取、getFormattedTimestamp、describeError、getRootPath、UniLineFormatter
