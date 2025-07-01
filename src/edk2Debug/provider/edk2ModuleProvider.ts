// src/edk2Debug/provider/edk2ModuleProvider.ts

import * as vscode from 'vscode';
import * as path from 'path';
import { ModuleScanner } from '../scanner/moduleScanner';
import { ProjectAnalyzer } from '../scanner/projectAnalyzer';
import { Edk2InfMeta } from '../types';
import { ModuleEnhancer } from '../enhancer/moduleEnhancer';
import { logMessage, logMessageWithLevel, handleError } from '../../utils/logger';

export class Edk2ModuleProvider implements vscode.TreeDataProvider<Edk2InfMeta> {
    private _onDidChangeTreeData: vscode.EventEmitter<Edk2InfMeta | undefined | null | void> = new vscode.EventEmitter<Edk2InfMeta | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Edk2InfMeta | undefined | null | void> = this._onDidChangeTreeData.event;

    private modules: Edk2InfMeta[] = [];
    private filteredModules: Edk2InfMeta[] = [];
    private searchTerm: string = '';
    private moduleScanner: ModuleScanner;
    private projectAnalyzer: ProjectAnalyzer;
    private filterModuleType: string | undefined = undefined;
    private filterStatus: 'all' | 'enhanced' | 'notEnhanced' = 'all';

    // Reference to TreeView for updating messages
    private treeView?: vscode.TreeView<Edk2InfMeta>;

    constructor(private workspaceRoot: string) {
        this.moduleScanner = new ModuleScanner(workspaceRoot);
        this.projectAnalyzer = new ProjectAnalyzer(workspaceRoot);
    }

    // Set TreeView reference
    setTreeView(treeView: vscode.TreeView<Edk2InfMeta>) {
        this.treeView = treeView;
    }

    // Unified filter logic and update TreeView message
    private applyAllFilters(): Edk2InfMeta[] {
        let filtered = this.modules;

        // 1. Apply search filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(m =>
                m.baseName.toLowerCase().includes(term) ||
                m.moduleType.toLowerCase().includes(term) ||
                m.filePath.toLowerCase().includes(term) ||
                m.entryPoint.toLowerCase().includes(term)
            );
        }

        // 2. Apply ModuleType filter
        if (this.filterModuleType) {
            filtered = filtered.filter(m => m.moduleType === this.filterModuleType);
        }

        // 3. Apply Status filter
        if (this.filterStatus === 'enhanced') {
            filtered = filtered.filter(m => m.enhanced);
        } else if (this.filterStatus === 'notEnhanced') {
            filtered = filtered.filter(m => !m.enhanced);
        }

        this.filteredModules = filtered;
        this.updateTreeViewMessage();
        return filtered;
    }

    // Update TreeView message
    private updateTreeViewMessage() {
        if (!this.treeView) return;

        const totalCount = this.modules.length;
        const filteredCount = this.filteredModules.length;

        let message = `Total INF files found: ${filteredCount}`;

        if (filteredCount !== totalCount) {
            message += ` (of ${totalCount})`;
        }

        const filterParts: string[] = [];
        if (this.searchTerm) {
            filterParts.push(`Search: "${this.searchTerm}"`);
        }
        if (this.filterModuleType) {
            filterParts.push(`Type: ${this.filterModuleType}`);
        }
        if (this.filterStatus !== 'all') {
            filterParts.push(`Status: ${this.filterStatus === 'enhanced' ? 'Enhanced' : 'Not Enhanced'}`);
        }

        if (filterParts.length > 0) {
            message += ` | Filters: ${filterParts.join(', ')}`;
        }

        this.treeView.message = message;
    }

    // getChildren uses unified filter logic
    getChildren(element?: Edk2InfMeta): Thenable<Edk2InfMeta[]> {
        if (!element) {
            return Promise.resolve(this.applyAllFilters());
        }
        return Promise.resolve([]);
    }

    // refresh method
    refresh(): Promise<void> {
        return this.scanModules().then(() => {
            this.applyAllFilters();
            this._onDidChangeTreeData.fire();
        });
    }

    // Search method
    searchModules(searchTerm: string): void {
        this.searchTerm = searchTerm.toLowerCase().trim();
        this.applyAllFilters();
        this._onDidChangeTreeData.fire();
    }

    // Clear search method
    clearSearch(): void {
        this.searchTerm = '';
        this.applyAllFilters();
        this._onDidChangeTreeData.fire();
    }

    // Filter by module type
    setModuleTypeFilter(type: string | undefined) {
        this.filterModuleType = type;
        this.applyAllFilters();
        this._onDidChangeTreeData.fire();
    }

    setStatusFilter(status: 'all' | 'enhanced' | 'notEnhanced') {
        this.filterStatus = status;
        this.applyAllFilters();
        this._onDidChangeTreeData.fire();
    }

    getAllModulesSync(): Edk2InfMeta[] {
        return this.modules;
    }

    // Enhanced error logging - scanModules method
    async scanModules(): Promise<void> {
        try {
            if (this.workspaceRoot) {
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Scanning EDK2 modules...",
                    cancellable: true
                }, async (progress, token) => {
                    const result = await this.moduleScanner.scanWorkspace(this.workspaceRoot);
                    const metas: Edk2InfMeta[] = [];

                    // Record failed files
                    const failedFiles: Array<{ path: string, reason: string }> = [];
                    let successCount = 0;

                    for (const infPath of result) {
                        if (token.isCancellationRequested) {
                            break;
                        }

                        progress.report({
                            message: `Parsing ${path.basename(infPath)}`,
                            increment: (100 / result.length)
                        });

                        try {
                            const meta = await this.moduleScanner.rescanModule(infPath);
                            if (meta) {
                                metas.push(meta);
                                successCount++;
                            } else {
                                // Record files that failed to parse but did not throw
                                failedFiles.push({
                                    path: infPath,
                                    reason: 'INF file parsing returned null (missing BASE_NAME or MODULE_TYPE)'
                                });
                                logMessage(`INF Parse Failed: ${infPath} - Missing required fields`);
                            }
                        } catch (error) {
                            // Record files that threw during parsing
                            const errorMessage = error instanceof Error ? error.message : String(error);
                            failedFiles.push({
                                path: infPath,
                                reason: `Parse exception: ${errorMessage}`
                            });
                            handleError(`INF Parse Error: ${infPath} - ${errorMessage}`);
                        }
                    }

                    this.modules = metas;

                    // Detailed statistics log output
                    logMessage(`=== EDK2 Debug Scanning Results ===`);
                    logMessage(`Total INF files found by scanner: ${result.length}`);
                    logMessage(`Successfully parsed INF files: ${successCount}`);
                    logMessage(`Failed to parse INF files: ${failedFiles.length}`);

                    // Output failed file list
                    if (failedFiles.length > 0) {
                        logMessage(`\n=== Failed INF Files List ===`);
                        failedFiles.forEach((failed, index) => {
                            logMessage(`${index + 1}. File: ${failed.path}`);
                            logMessage(`   Reason: ${failed.reason}`);
                        });
                        logMessage(`=== End of Failed Files List ===\n`);

                        // Show summary in VSCode notification
                        logMessageWithLevel(
                            `EDK2 Scan completed: ${successCount} successful, ${failedFiles.length} failed. Check OUTPUT for details.`,
                            'warn'
                        );
                    } else {
                        logMessageWithLevel(
                            `EDK2 Scan completed: ${successCount} INF files parsed successfully.`,
                            'info'
                        );
                    }
                });
            } else {
                // Handle case without progress (also with error logging)
                const result = await this.moduleScanner.scanWorkspace(this.workspaceRoot);
                const metas: Edk2InfMeta[] = [];
                const failedFiles: Array<{ path: string, reason: string }> = [];
                let successCount = 0;

                for (const infPath of result) {
                    try {
                        const meta = await this.moduleScanner.rescanModule(infPath);
                        if (meta) {
                            metas.push(meta);
                            successCount++;
                        } else {
                            failedFiles.push({
                                path: infPath,
                                reason: 'INF file parsing returned null (missing BASE_NAME or MODULE_TYPE)'
                            });
                            logMessage(`INF Parse Failed: ${infPath} - Missing required fields`);
                        }
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        failedFiles.push({
                            path: infPath,
                            reason: `Parse exception: ${errorMessage}`
                        });
                        handleError(`INF Parse Error: ${infPath} - ${errorMessage}`);
                    }
                }

                this.modules = metas;

                // Detailed statistics log (no progress version)
                logMessage(`=== EDK2 Debug Scanning Results ===`);
                logMessage(`Total INF files found by scanner: ${result.length}`);
                logMessage(`Successfully parsed INF files: ${successCount}`);
                logMessage(`Failed to parse INF files: ${failedFiles.length}`);

                if (failedFiles.length > 0) {
                    logMessage(`\n=== Failed INF Files List ===`);
                    failedFiles.forEach((failed, index) => {
                        logMessage(`${index + 1}. File: ${failed.path}`);
                        logMessage(`   Reason: ${failed.reason}`);
                    });
                    logMessage(`=== End of Failed Files List ===\n`);

                    logMessageWithLevel(
                        `EDK2 Scan completed: ${successCount} successful, ${failedFiles.length} failed. Check OUTPUT for details.`,
                        'warn'
                    );
                } else {
                    logMessageWithLevel(
                        `EDK2 Scan completed: ${successCount} INF files parsed successfully.`,
                        'info'
                    );
                }
            }

            // Sort by module type and name
            this.modules.sort((a, b) => {
                if (a.moduleType !== b.moduleType) {
                    return a.moduleType.localeCompare(b.moduleType);
                }
                return a.baseName.localeCompare(b.baseName);
            });

            // Apply filters and update message
            this.applyAllFilters();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            handleError(`Scan modules error: ${errorMessage}`);
            vscode.window.showErrorMessage(`Failed to scan EDK2 modules: ${errorMessage}`);
        }
    }

    // Other existing methods remain unchanged...
    getTreeItem(element: Edk2InfMeta): vscode.TreeItem {
        const item = new vscode.TreeItem(element.baseName, vscode.TreeItemCollapsibleState.None);

        item.tooltip = new vscode.MarkdownString(`
**Module Type**: ${element.moduleType}  
**Entry Point**: ${element.entryPoint}  
**Path**: ${element.filePath}  
**Status**: ${element.enhanced ? '✅ Enhanced' : '❌ Not Enhanced'}  
**Architectures**: ${element.architectures.join(', ')}  
**GUID**: ${element.guid}
    `);

        item.description = `${element.moduleType} ${element.enhanced ? '✓' : ''}`;
        item.contextValue = 'edk2Module';

        if (element.enhanced) {
            item.iconPath = new vscode.ThemeIcon('debug-alt', new vscode.ThemeColor('testing.iconPassed'));
        } else {
            item.iconPath = new vscode.ThemeIcon('circle-outline', new vscode.ThemeColor('testing.iconQueued'));
        }

        item.command = {
            command: 'vscode.open',
            title: 'Open',
            arguments: [vscode.Uri.file(element.filePath)]
        };

        return item;
    }

    getModuleCount(): number {
        return this.filteredModules.length;
    }

    async getAllModules(): Promise<Edk2InfMeta[]> {
        return this.filteredModules;
    }

    async getModuleByPath(infPath: string): Promise<Edk2InfMeta | undefined> {
        return this.modules.find(m => m.filePath === infPath);
    }

    async updateModuleStatus(infPath: string, enhanced: boolean): Promise<void> {
        const updatedModule = await this.moduleScanner.rescanModule(infPath);

        if (updatedModule) {
            const index = this.modules.findIndex(m => m.filePath === infPath);
            if (index !== -1) {
                this.modules[index] = updatedModule;
                this.applyAllFilters();
                this._onDidChangeTreeData.fire();
            }
        }
    }

    async getProjectStatistics() {
        return this.projectAnalyzer.getProjectStatistics();
    }

    async enhanceModule(moduleNode: Edk2InfMeta): Promise<void> {
        if (moduleNode?.filePath) {
            const ok = await ModuleEnhancer.enhance(moduleNode);
            if (ok) {
                vscode.window.showInformationMessage('Module enhancement succeeded');
                await this.updateModuleStatus(moduleNode.filePath, true);
            } else {
                vscode.window.showErrorMessage('Module enhancement failed');
            }
        }
    }
}
