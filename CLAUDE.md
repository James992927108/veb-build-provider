# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VSCode extension called "veb-build-provider" that provides comprehensive VEB (UEFI/EDK2) project development support, including build tools, debug analysis, and language support for EDK2/BIOS firmware development.

## Key Development Commands

### Building and Testing
```bash
# Compile TypeScript to JavaScript
npm run compile

# Watch mode for development
npm run watch

# Package extension for distribution
vsce package
```

### Logging System
The project uses a multi-level logging system (`src/shared/utils/logger.ts`):
- Use `logInfo()` for general information
- Use `logDebug()` for detailed debugging
- Use `logError()` for errors
- Use `logWarn()` for warnings  
- Use `logSummary()` for important stage summaries

**Important**: When refactoring logging, replace generic `logMessage()` calls with appropriate level-specific functions.

## Architecture Overview

### Modular Structure
The extension follows a modular architecture with three main modules:

1. **VEB Build Module** (`src/veb-build/`)
   - Build commands and task management
   - Key files: `commands/buildCommands.ts`, `tools/expandMakefileVars.ts`
   - Handles F7 (VEB Build), F8 (Init Task), F9 (VEB ReBuild) keybindings

2. **EDK2 Debug Module** (`src/edk2-debug/`)
   - Enhanced Debug log analysis and module management
   - Core providers: `enhancedDebugProvider.ts` (unified TreeView), `logLinkProvider.ts`
   - Analysis engine: `analysis/enhancedLogParser.ts`
   - Module scanning: `core/moduleScanner.ts`, `core/edk2ModuleProvider.ts`

3. **Language Support Module** (`src/language-support/`)
   - EDK2 file type support (.inf, .dsc, .dec, .fdf, .uni, .vfr)
   - Formatting and parsing: `core/edk2Formatter.ts`, `core/edk2Parser.ts`

### Key Components

#### Build System Integration
- Uses VSCode task listeners (`vscode.tasks.onDidStartTask`, `vscode.tasks.onDidEndTask`)
- Tracks build times and VEB file names from tasks.json configuration
- Cross-platform support (Windows batch, Linux shell scripts)

#### Enhanced Debug Analysis
- **Unified Provider**: `enhancedDebugProvider.ts` provides dual-mode TreeView (Module Manager ↔ Log Analysis)
- **Log Parser**: Parses EDK2 Enhanced Debug format with timeline grouping
- **Navigation**: Bidirectional navigation between TreeView and log files
- **File Handling**: Supports large log files (>100MB) with module-based loading

#### Language Support
- Custom language definitions for VEB (.veb), SDL (.sdl), and EDK2 formats
- Syntax highlighting via TextMate grammars in `config/syntaxes/`
- Code snippets for C/C++ EDK2 development

## Important File Locations

### Configuration
- `package.json` - Extension manifest with commands, keybindings, and language definitions
- `tsconfig.json` - TypeScript compiler configuration
- `config/` - Language configurations, syntaxes, and snippets

### Core Source Files
- `src/extension.ts` - Extension entry point and module registration
- `src/shared/utils/logger.ts` - Centralized logging system
- `src/veb-build/commands/buildCommands.ts` - Build time tracking and task management
- `src/edk2-debug/providers/enhancedDebugProvider.ts` - Enhanced Debug TreeView provider

### Build Output
- `out/` - Compiled JavaScript output
- Generated .vsix files for distribution

## Development Patterns

### Task Listener Pattern
The extension uses VSCode task listeners to monitor build progress:
```typescript
const taskStartListener = vscode.tasks.onDidStartTask((e) => {
    // Track start time and extract VEB file name
});

const taskEndListener = vscode.tasks.onDidEndTask((e) => {
    // Calculate duration and display build info
});
```

### Module Registration Pattern
Each module exports a registration function:
```typescript
export function registerVebBuildModule(context: vscode.ExtensionContext) {
    // Register commands, providers, and listeners
}
```

### Provider Architecture
TreeView providers follow VSCode's data provider pattern with refresh capabilities and context-aware filtering.

## Key VSCode Integration Points

### Commands and Keybindings
- F7: `vebBuild.buildTool.vebBuild`
- F8: `vebBuild.buildTool.initTask` 
- F9: `vebBuild.buildTool.vebReBuild`
- Ctrl+Shift+F5-F8: Various EDK2 debug commands
- Ctrl+Shift+L: Enhanced Debug navigation

### Activity Bar
- Custom "VEB Build" activity bar with Enhanced Debug TreeView
- Dual-mode interface switching between Module Manager and Log Analysis

### Context Awareness
- Extension activates on `.inf` files (EDK2 projects)
- Context variables control UI visibility: `vebBuild.hasEdk2Workspace`

## Testing and Quality

### Log Level Management
- Development: Set `CURRENT_LOG_LEVEL = LogLevel.DEBUG` in `logger.ts`
- Release: Set `CURRENT_LOG_LEVEL = LogLevel.INFO`

### Build Verification
Always run `npm run compile` after changes to ensure TypeScript compilation succeeds.

## Common Development Tasks

### Adding New Commands
1. Add command definition to `package.json` `contributes.commands`
2. Add keybinding to `package.json` `contributes.keybindings` 
3. Implement command handler in appropriate module
4. Register command in module's registration function

### Extending Language Support
1. Add language definition to `package.json` `contributes.languages`
2. Create grammar file in `config/syntaxes/`
3. Add grammar reference to `package.json` `contributes.grammars`

### Logger Refactoring Status
**Active Task**: Converting `logMessage()` calls to specific log levels
- Completed: Core build and language modules
- Remaining: 9 files in `edk2-debug` module (see `LOG_REFACTOR_REMAINING_TASKS.md`)

The refactoring follows this pattern:
```typescript
// Before
import { logMessage } from '../../shared/utils/logger';
logMessage('Module loaded successfully');

// After  
import { logInfo } from '../../shared/utils/logger';
logInfo('Module loaded successfully');
```