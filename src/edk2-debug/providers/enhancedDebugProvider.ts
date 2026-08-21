// src/edk2-debug/providers/enhancedDebugProvider.ts

import * as vscode from 'vscode';
import * as path from 'path';
import { Edk2ModuleProvider } from '../core/edk2ModuleProvider';
import { EnhancedLogParser } from '../analysis/enhancedLogParser';
import { applyLogFilter, logFilterDescription, LogFilter } from '../analysis/logFilter';
import { logError, logInfo, logDebug, handleError } from '../../shared/utils/logger';

export type DebugMode = 'modules' | 'logs';

export interface LogAnalysisItem {
    label: string;
    sequence?: number;
    module?: string;
    function?: string;
    line?: number;
    message?: string;
    logLine?: string;
    phase?: string;
    logFileLineNumber?: number; // Line number in the original log file
}

export class EnhancedDebugProvider implements vscode.TreeDataProvider<any> {
    private _onDidChangeTreeData: vscode.EventEmitter<any | undefined | null | void> = new vscode.EventEmitter<any | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<any | undefined | null | void> = this._onDidChangeTreeData.event;

    private currentMode: DebugMode = 'modules';
    private moduleProvider: Edk2ModuleProvider;
    private logParser: EnhancedLogParser;
    private currentLogFile?: string;
    private logAnalysisData: LogAnalysisItem[] = [];
    private logFilter: LogFilter = {};
    private treeView?: vscode.TreeView<any>;
    private statusBarItem?: vscode.StatusBarItem;

    constructor(private workspaceRoot: string, private context: vscode.ExtensionContext) {
        this.moduleProvider = new Edk2ModuleProvider(workspaceRoot);
        this.logParser = new EnhancedLogParser();
        
        // Restore last used mode
        this.currentMode = this.context.workspaceState.get('enhancedDebug.lastMode', 'modules') as DebugMode;
        
        // Create status bar item
        this.createStatusBarItem();
    }

    // Set TreeView reference
    setTreeView(treeView: vscode.TreeView<any>) {
        this.treeView = treeView;
        this.moduleProvider.setTreeView(treeView);
        this.updateTreeViewTitle();
    }

    // Switch mode
    async switchMode(mode: DebugMode): Promise<void> {
        this.currentMode = mode;
        await this.context.workspaceState.update('enhancedDebug.lastMode', mode);
        this.updateTreeViewTitle();
        this._onDidChangeTreeData.fire(undefined);
        logInfo(`Switched to ${mode} mode`);
    }

    // Update TreeView title
    private updateTreeViewTitle(): void {
        if (!this.treeView) return;

        const modeNames = {
            modules: 'Module Manager',
            logs: 'Log Analysis'
        };

        this.treeView.title = `Enhanced Debug - ${modeNames[this.currentMode]}`;
        
        // Update message
        this.updateTreeViewMessage();
    }

    // Update TreeView message
    private updateTreeViewMessage(): void {
        if (!this.treeView) return;

        switch (this.currentMode) {
            case 'modules':
                // Delegate to moduleProvider for handling
                break;
            case 'logs':
                if (this.currentLogFile) {
                    const fileName = path.basename(this.currentLogFile);
                    const totalEntries = this.logAnalysisData.length;
                    const visibleEntries = this.getFilteredLogEntries().length;
                    const filterDesc = logFilterDescription(this.logFilter);
                    let message = `Log: ${fileName} | ${visibleEntries}/${totalEntries} entries`;
                    if (filterDesc) {
                        message += ` | Filter: ${filterDesc}`;
                    }
                    this.treeView.message = message;
                } else {
                    this.treeView.message = 'No log file loaded. Click "Open Log File" to start analysis.';
                }
                break;
        }
    }

    getCurrentMode(): DebugMode {
        return this.currentMode;
    }

    // TreeDataProvider implementation
    getParent(element: any): any | undefined {
        if (this.currentMode === 'modules') {
            return this.moduleProvider.getParent(element);
        }
        return undefined;
    }

    getChildren(element?: any): Thenable<any[]> {
        switch (this.currentMode) {
            case 'modules':
                return this.moduleProvider.getChildren(element);
            case 'logs':
                return this.getLogChildren(element);
            default:
                return Promise.resolve([]);
        }
    }

    getTreeItem(element: any): vscode.TreeItem {
        switch (this.currentMode) {
            case 'modules':
                return this.moduleProvider.getTreeItem(element);
            case 'logs':
                return this.getLogTreeItem(element);
            default:
                return new vscode.TreeItem('Unknown');
        }
    }

    // Log Analysis mode child items
    private async getLogChildren(element?: LogAnalysisItem): Promise<LogAnalysisItem[]> {
        const filtered = this.getFilteredLogEntries();

        if (!element) {
            // Root node - display module groups or log entries
            if (filtered.length === 0) {
                if (this.logAnalysisData.length === 0) {
                    return [{
                        label: '📁 Click "Open Log File" to load Enhanced Debug logs',
                    }];
                }
                return [{
                    label: '🔍 No log entries match the current filter',
                    message: 'Adjust or clear the filter to see more entries.',
                }];
            }

            // Group by module
            const groupedByModule = new Map<string, LogAnalysisItem[]>();

            for (const item of filtered) {
                if (item.module) {
                    if (!groupedByModule.has(item.module)) {
                        groupedByModule.set(item.module, []);
                    }
                    groupedByModule.get(item.module)!.push(item);
                }
            }

            // Create module group items
            const groupItems: LogAnalysisItem[] = [];
            for (const [moduleName, entries] of groupedByModule) {
                groupItems.push({
                    label: `📂 ${moduleName}`,
                    module: moduleName,
                    message: `${entries.length} entries`,
                });
            }

            return groupItems.sort((a, b) => a.label.localeCompare(b.label));
        } else {
            // Expand module - display log entries for this module
            if (element.module) {
                return filtered
                    .filter(item => item.module === element.module && item.sequence !== undefined)
                    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
            }
        }

        return [];
    }

    // Log entries matching the active filter
    private getFilteredLogEntries(): LogAnalysisItem[] {
        return applyLogFilter(this.logAnalysisData, this.logFilter);
    }

    // Log Analysis mode TreeItem
    private getLogTreeItem(element: LogAnalysisItem): vscode.TreeItem {
        if (element.sequence !== undefined) {
            // Log entry
            const item = new vscode.TreeItem(`#${element.sequence} ${element.function}:${element.line}`, vscode.TreeItemCollapsibleState.None);
            item.description = element.message;
            item.tooltip = new vscode.MarkdownString(`
**Sequence**: #${element.sequence}  
**Module**: ${element.module}  
**Function**: ${element.function}:${element.line}  
**Message**: ${element.message}  
**Phase**: ${element.phase || 'Unknown'}  
**Log Line**: ${(element.logFileLineNumber || 0) + 1}  

---
**Click**: Jump to log file line  
**Right-click**: More options (jump to source code)
            `);
            
            item.contextValue = 'logEntry';
            item.iconPath = new vscode.ThemeIcon('debug-breakpoint-log', new vscode.ThemeColor('debugIcon.breakpointForeground'));
            
            // Command to jump to log file line
            item.command = {
                command: 'vebBuild.enhancedDebug.jumpToLogLine',
                title: 'Jump to Log Line',
                arguments: [{
                    logFilePath: this.currentLogFile,
                    logFileLineNumber: element.logFileLineNumber,
                    sequence: element.sequence,
                    module: element.module,
                    function: element.function,
                    line: element.line,
                    message: element.message
                }]
            };
            
            return item;
        } else {
            // Module group
            const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.Collapsed);
            item.description = element.message;
            item.contextValue = 'logGroup';
            item.iconPath = new vscode.ThemeIcon('folder', new vscode.ThemeColor('debugIcon.breakpointForeground'));
            return item;
        }
    }

    // Open log file
    async openLogFile(): Promise<void> {
        try {
            const fileUri = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: false,
                openLabel: 'Select Enhanced Debug Log File',
                filters: {
                    'Log Files': ['log', 'txt'],
                    'All Files': ['*']
                }
            });

            if (!fileUri || fileUri.length === 0) {
                return;
            }

            const logFilePath = fileUri[0].fsPath;
            
            // First, open the log file in the editor (right panel)
            await this.openLogFileInEditor(logFilePath);
            
            // Then, load and parse it for TreeView analysis
            await this.loadLogFile(logFilePath);
        } catch (error) {
            handleError(`Failed to open log file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Open log file in editor window
    private async openLogFileInEditor(filePath: string): Promise<void> {
        try {
            logDebug(`Opening log file in editor: ${filePath}`);
            
            const document = await vscode.workspace.openTextDocument(filePath);
            
            // Check user preference for log file opening location
            const config = vscode.workspace.getConfiguration('vebBuild.enhancedDebug');
            const openLocation = config.get('logFileOpenLocation', 'beside') as string;
            
            let viewColumn: vscode.ViewColumn;
            switch (openLocation) {
                case 'active':
                    viewColumn = vscode.ViewColumn.Active;
                    break;
                case 'one':
                    viewColumn = vscode.ViewColumn.One;
                    break;
                case 'two':
                    viewColumn = vscode.ViewColumn.Two;
                    break;
                case 'three':
                    viewColumn = vscode.ViewColumn.Three;
                    break;
                case 'beside':
                default:
                    viewColumn = vscode.ViewColumn.Beside;
                    break;
            }
            
            const editor = await vscode.window.showTextDocument(document, {
                viewColumn: viewColumn,
                preserveFocus: false, // Focus on the opened file
                preview: false // Open as permanent tab, not preview
            });

            logInfo(`Log file opened in editor successfully: ${path.basename(filePath)} (ViewColumn: ${openLocation})`);
            
            // Show success notification with file info
            const fileStats = await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
            const fileSizeKB = Math.round(fileStats.size / 1024);
            const fileSizeMB = fileSizeKB > 1024 ? (fileSizeKB / 1024).toFixed(1) + ' MB' : fileSizeKB + ' KB';
            
            // Count lines in the file for additional info
            const lineCount = document.lineCount;
            
            vscode.window.showInformationMessage(
                `Enhanced Debug log opened: ${path.basename(filePath)} (${fileSizeMB}, ${lineCount.toLocaleString()} lines)`
            );

        } catch (error) {
            handleError(`Failed to open log file in editor: ${error instanceof Error ? error.message : String(error)}`);
            throw error; // Re-throw so the parent function can handle it
        }
    }

    // Quick setting to change log file open location
    async changeLogFileOpenLocation(): Promise<void> {
        try {
            const currentLocation = vscode.workspace.getConfiguration('vebBuild.enhancedDebug').get('logFileOpenLocation', 'beside');
            
            const options = [
                { label: 'Beside current editor', value: 'beside', description: 'Open in a new column beside the current editor' },
                { label: 'Replace active editor', value: 'active', description: 'Replace the currently active editor' },
                { label: 'First editor column', value: 'one', description: 'Always open in the first editor column' },
                { label: 'Second editor column', value: 'two', description: 'Always open in the second editor column' },
                { label: 'Third editor column', value: 'three', description: 'Always open in the third editor column' }
            ];
            
            const selected = await vscode.window.showQuickPick(options, {
                placeHolder: `Current: ${currentLocation}. Select where to open Enhanced Debug log files:`,
                ignoreFocusOut: false
            });
            
            if (selected) {
                await vscode.workspace.getConfiguration('vebBuild.enhancedDebug').update(
                    'logFileOpenLocation', 
                    selected.value, 
                    vscode.ConfigurationTarget.Global
                );
                
                vscode.window.showInformationMessage(
                    `Enhanced Debug log files will now open: ${selected.label}`
                );
                
            logInfo(`Log file open location changed to: ${selected.value}`);
            }
        } catch (error) {
            handleError(`Failed to change log file open location: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Interactive log filter: text search / module / phase / clear
    async filterLogs(): Promise<void> {
        try {
            if (this.logAnalysisData.length === 0) {
                vscode.window.showWarningMessage('No Enhanced Debug log loaded. Open a log file first.');
                return;
            }

            const modules = Array.from(
                new Set(this.logAnalysisData.map((item) => item.module).filter((m): m is string => !!m))
            ).sort();
            // Phases already present in the loaded log (preserves canonical order).
            const phaseOrder = ['PEI', 'DXE', 'BDS', 'Runtime'];
            const phases = phaseOrder.filter((p) =>
                this.logAnalysisData.some((item) => item.phase === p)
            );

            const active = logFilterDescription(this.logFilter);
            const options = [
                { label: 'Search text', icon: '$(search)', description: this.logFilter.text ? `current: "${this.logFilter.text}"` : 'Match module, function or message' },
                { label: 'Filter by module', icon: '$(file-code)', description: this.logFilter.module ? `current: ${this.logFilter.module}` : `${modules.length} modules available` },
                { label: 'Filter by phase', icon: '$(clock)', description: this.logFilter.phase ? `current: ${this.logFilter.phase}` : phases.join(', ') },
                { label: 'Clear filter', icon: '$(clear-all)', description: active ? `active: ${active}` : 'no active filter' },
            ] as const;

            // `as const` labels are unique; `label` alone is the reliable key.
            const choice = await vscode.window.showQuickPick(
                options,
                { placeHolder: 'Filter Enhanced Debug logs', ignoreFocusOut: true }
            );
            if (!choice) {
                return;
            }

            switch (choice.label) {
                case 'Search text': {
                    const text = await vscode.window.showInputBox({
                        prompt: 'Filter log entries (matches module / function / message, case-insensitive)',
                        value: this.logFilter.text,
                        placeHolder: 'e.g. DMA or PEICORE',
                    });
                    if (text === undefined) { return; } // user cancelled
                    this.logFilter.text = text.trim() || undefined;
                    break;
                }
                case 'Filter by module': {
                    const items = [
                        { label: 'All modules', value: '' },
                        ...modules.map((m) => ({ label: m, value: m })),
                    ];
                    const selected = await vscode.window.showQuickPick(items, {
                        placeHolder: `Filter by module (current: ${this.logFilter.module || 'all'})`,
                    });
                    if (!selected) { return; }
                    this.logFilter.module = selected.value || undefined;
                    break;
                }
                case 'Filter by phase': {
                    const items = [
                        { label: 'All phases', value: '' },
                        ...phases.map((p) => ({ label: p, value: p })),
                    ];
                    const selected = await vscode.window.showQuickPick(items, {
                        placeHolder: `Filter by phase (current: ${this.logFilter.phase || 'all'})`,
                    });
                    if (!selected) { return; }
                    this.logFilter.phase = selected.value || undefined;
                    break;
                }
                case 'Clear filter': {
                    this.logFilter = {};
                    break;
                }
                default:
                    return;
            }

            logInfo(`Log filter updated: ${logFilterDescription(this.logFilter) || '(cleared)'}`);
            this.updateTreeViewMessage();
            this._onDidChangeTreeData.fire(undefined);
        } catch (error) {
            handleError(`Log filtering failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    clearLogFilter(): void {
        this.logFilter = {};
        this.updateTreeViewMessage();
        this._onDidChangeTreeData.fire(undefined);
        logInfo('Log filter cleared');
    }

    // Jump to specific line in log file
    async jumpToLogLine(jumpInfo: any): Promise<void> {
        try {
            if (!jumpInfo || typeof jumpInfo.logFileLineNumber !== 'number' || !jumpInfo.logFilePath) {
                vscode.window.showWarningMessage('Invalid log line information provided');
                return;
            }

            logDebug(`Jumping to log line: ${jumpInfo.logFilePath}:${jumpInfo.logFileLineNumber + 1} (Sequence #${jumpInfo.sequence})`);
            
            // Open the log file in editor
            const document = await vscode.workspace.openTextDocument(jumpInfo.logFilePath);
            const editor = await vscode.window.showTextDocument(document, {
                preserveFocus: false,
                preview: false
            });

            // Navigate to the specific line (convert from 0-based to 1-based)
            const targetLine = Math.max(0, Math.min(jumpInfo.logFileLineNumber, document.lineCount - 1));
            const position = new vscode.Position(targetLine, 0);
            
            // Get the full line for selection
            const lineText = document.lineAt(targetLine);
            const lineStart = new vscode.Position(targetLine, 0);
            const lineEnd = new vscode.Position(targetLine, lineText.text.length);
            
            // Highlight the entire line by selecting it
            editor.selection = new vscode.Selection(lineStart, lineEnd);
            editor.revealRange(
                new vscode.Range(lineStart, lineEnd), 
                vscode.TextEditorRevealType.InCenterIfOutsideViewport
            );

            // Show a brief notification with context info
            const contextInfo = jumpInfo.sequence ? 
                `#${jumpInfo.sequence} ${jumpInfo.module}:${jumpInfo.function}` : 
                'Log line';
            
            vscode.window.showInformationMessage(
                `Jumped to log line ${targetLine + 1}: ${contextInfo}`,
                { modal: false }
            );

            logDebug(`Successfully jumped to line ${targetLine + 1} in log file`);

        } catch (error) {
            handleError(`Failed to jump to log line: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Locate TreeView item from current cursor position in log file
    async locateInTreeView(): Promise<void> {
        try {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showWarningMessage('No active editor found');
                return;
            }

            // Check if current file is the loaded log file
            const currentFilePath = activeEditor.document.uri.fsPath;
            if (!this.currentLogFile || currentFilePath !== this.currentLogFile) {
                vscode.window.showWarningMessage('Current file is not the loaded Enhanced Debug log file');
                return;
            }

            // Get current cursor position
            const cursorPosition = activeEditor.selection.active;
            const currentLineNumber = cursorPosition.line; // 0-based
            const currentLineText = activeEditor.document.lineAt(currentLineNumber).text;

            logDebug(`Locating TreeView item from log line ${currentLineNumber + 1}: ${currentLineText.substring(0, 100)}...`);

            // Parse the current line to get Enhanced Debug info
            const parsed = this.logParser.parseLogLine(currentLineText.trim());
            if (!parsed || !parsed.isValid) {
                vscode.window.showWarningMessage('Current line is not a valid Enhanced Debug entry');
                return;
            }

            // Find matching item in logAnalysisData
            const matchingItem = this.logAnalysisData.find(item => 
                item.sequence === parsed.sequence &&
                item.module === parsed.module &&
                item.function === parsed.function &&
                item.line === parsed.line
            );

            if (!matchingItem) {
                vscode.window.showWarningMessage(`No TreeView item found for sequence #${parsed.sequence}`);
                return;
            }

            // Switch to logs mode if not already
            if (this.currentMode !== 'logs') {
                await this.switchMode('logs');
            }

            // Reveal the item in TreeView
            await this.revealItemInTreeView(matchingItem);

            // Show success notification
            vscode.window.showInformationMessage(
                `Located in TreeView: #${parsed.sequence} ${parsed.module}:${parsed.function}`,
                { modal: false }
            );

            logInfo(`Successfully located TreeView item for sequence #${parsed.sequence}`);

        } catch (error) {
            handleError(`Failed to locate in TreeView: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Reveal specific item in TreeView
    private async revealItemInTreeView(targetItem: LogAnalysisItem): Promise<void> {
        try {
            if (!this.treeView || !targetItem.module) {
                return;
            }

            // First, make sure TreeView is visible
            await vscode.commands.executeCommand('workbench.view.extension.veb-build-explorer');

            logDebug(`Attempting to reveal TreeView item: ${targetItem.module} #${targetItem.sequence}`);

            // Try to find and reveal the exact TreeView item
            // Since TreeView is grouped by modules, we need to work with the actual tree structure
            const moduleGroupItems = await this.getLogChildren(); // Get root items (module groups)
            
            // Find the module group that contains our target item
            const targetModuleGroup = moduleGroupItems.find(group => 
                group.module === targetItem.module
            );

            if (targetModuleGroup) {
                logDebug(`Found target module group: ${targetModuleGroup.label}`);
                
                try {
                    // First reveal and expand the module group
                    await this.treeView.reveal(targetModuleGroup, {
                        select: false,
                        focus: false,
                        expand: true
                    });
                    
                    // Wait a bit for expansion to complete
                    setTimeout(async () => {
                        try {
                            // Now get the children of this module group
                            const moduleChildren = await this.getLogChildren(targetModuleGroup);
                            
                            // Find the exact log entry
                            const targetLogEntry = moduleChildren.find(child =>
                                child.sequence === targetItem.sequence &&
                                child.module === targetItem.module &&
                                child.function === targetItem.function &&
                                child.line === targetItem.line
                            );

                            if (targetLogEntry) {
                                logDebug(`Found target log entry: ${targetLogEntry.label}`);
                                
                                // Reveal the specific log entry
                                await this.treeView!.reveal(targetLogEntry, {
                                    select: true,
                                    focus: true,
                                    expand: false
                                });
                                
                                logDebug(`TreeView item revealed successfully`);
                            } else {
                                logDebug(`Target log entry not found in module children`);
                            }
                        } catch (revealError) {
                            logDebug(`Failed to reveal log entry: ${revealError}`);
                        }
                    }, 300);
                    
                } catch (groupRevealError) {
                    logDebug(`Failed to reveal module group: ${groupRevealError}`);
                }
            } else {
                logDebug(`Target module group not found: ${targetItem.module}`);
            }

        } catch (error) {
            logDebug(`Error in revealItemInTreeView: ${error}`);
        }
    }

    // Create status bar item for quick access
    private createStatusBarItem(): void {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'vebBuild.enhancedDebug.locateInTreeView';
        this.updateStatusBarItem();
        this.context.subscriptions.push(this.statusBarItem);
    }

    // Update status bar item visibility and text
    updateStatusBarItem(): void {
        if (!this.statusBarItem) return;

        const activeEditor = vscode.window.activeTextEditor;
        const isLogFile = activeEditor && 
                          this.currentLogFile && 
                          activeEditor.document.uri.fsPath === this.currentLogFile;

        if (isLogFile) {
            this.statusBarItem.text = "$(search-view) Locate in TreeView";
            this.statusBarItem.tooltip = "Locate current log line in Enhanced Debug TreeView (Ctrl+Shift+L)";
            this.statusBarItem.show();
        } else {
            this.statusBarItem.hide();
        }
    }

    // Load log file for analysis
    private async loadLogFile(filePath: string): Promise<void> {
        try {
            logInfo(`Loading Enhanced Debug log: ${filePath}`);
            
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Parsing Enhanced Debug log...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 20, message: "Reading log file..." });
                
                const logContent = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
                const logText = Buffer.from(logContent).toString('utf8');
                
                progress.report({ increment: 40, message: "Parsing Enhanced Debug entries..." });
                
                const lines = logText.split('\n');
                const parsedEntries: LogAnalysisItem[] = [];
                
                for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                    const line = lines[lineIndex];
                    const trimmedLine = line.trim();
                    if (!trimmedLine) continue;
                    
                    const parsed = this.logParser.parseLogLine(trimmedLine);
                    if (parsed) {
                        parsedEntries.push({
                            label: `#${parsed.sequence} ${parsed.function}:${parsed.line}`,
                            sequence: parsed.sequence,
                            module: parsed.module,
                            function: parsed.function,
                            line: parsed.line,
                            message: parsed.message,
                            logLine: trimmedLine,
                            phase: this.determinePhase(parsed.sequence),
                            logFileLineNumber: lineIndex // Store the original line number (0-based)
                        });
                    }
                }
                
                progress.report({ increment: 90, message: "Building timeline view..." });
                
                this.currentLogFile = filePath;
                this.logAnalysisData = parsedEntries.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
                
                progress.report({ increment: 100, message: "Analysis complete" });
            });

            this.updateTreeViewMessage();
            this.updateStatusBarItem(); // Update status bar when log is loaded
            this._onDidChangeTreeData.fire(undefined);
            
            logInfo(`Loaded ${this.logAnalysisData.length} Enhanced Debug entries from ${path.basename(filePath)}`);
            
            vscode.window.showInformationMessage(
                `Enhanced Debug log loaded: ${this.logAnalysisData.length} entries parsed from ${path.basename(filePath)}`
            );
        } catch (error) {
            handleError(`Failed to load log file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Determine UEFI phase based on sequence number
    private determinePhase(sequence: number): string {
        // Simple phase determination logic - can be adjusted based on actual requirements
        if (sequence < 200) return 'PEI';
        if (sequence < 1000) return 'DXE';
        if (sequence < 5000) return 'BDS';
        return 'Runtime';
    }

    // Delegate module-related functionality to moduleProvider
    async refreshModules(): Promise<void> {
        await this.moduleProvider.refresh();
        if (this.currentMode === 'modules') {
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    searchModules(searchTerm: string): void {
        this.moduleProvider.searchModules(searchTerm);
        if (this.currentMode === 'modules') {
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    clearModuleSearch(): void {
        this.moduleProvider.clearSearch();
        if (this.currentMode === 'modules') {
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    setModuleTypeFilter(type: string | undefined): void {
        this.moduleProvider.setModuleTypeFilter(type);
        if (this.currentMode === 'modules') {
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    setModuleStatusFilter(status: 'all' | 'enhanced' | 'notEnhanced'): void {
        this.moduleProvider.setStatusFilter(status);
        if (this.currentMode === 'modules') {
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    async enhanceModule(moduleNode: any): Promise<void> {
        await this.moduleProvider.enhanceModule(moduleNode);
        if (this.currentMode === 'modules') {
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    async getProjectStatistics(): Promise<any> {
        return await this.moduleProvider.getProjectStatistics();
    }

    getAllModulesSync(): any[] {
        return this.moduleProvider.getAllModulesSync();
    }

    async getModuleByPath(infPath: string): Promise<any> {
        return await this.moduleProvider.getModuleByPath(infPath);
    }
}