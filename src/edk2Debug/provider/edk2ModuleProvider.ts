// src/edk2Debug/providers/edk2ModuleProvider.ts
import * as vscode from 'vscode';
import * as path from 'path';
import { ModuleScanner } from '../scanner/moduleScanner';
import { InfParser } from '../scanner/infParser';
import { ProjectAnalyzer } from '../scanner/projectAnalyzer';
import { Edk2InfMeta, Edk2Enhancement } from '../types';

export class Edk2ModuleProvider implements vscode.TreeDataProvider<Edk2InfMeta> {
  private _onDidChangeTreeData: vscode.EventEmitter<Edk2InfMeta | undefined | null | void> = new vscode.EventEmitter<Edk2InfMeta | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Edk2InfMeta | undefined | null | void> = this._onDidChangeTreeData.event;

  private modules: Edk2InfMeta[] = [];
  private moduleScanner: ModuleScanner;
  private infParser = new InfParser();
  private projectAnalyzer: ProjectAnalyzer;

  constructor(private workspaceRoot: string) {
    // Provide workspaceRoot parameter to ModuleScanner
    this.moduleScanner = new ModuleScanner(workspaceRoot);
    this.projectAnalyzer = new ProjectAnalyzer(workspaceRoot);
  }

  refresh(): Promise<void> {
    return this.scanModules().then(() => {
      this._onDidChangeTreeData.fire();
    });
  }

  async scanModules(): Promise<void> {
    try {
      if (this.workspaceRoot) {
        vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: "Scanning EDK2 modules...",
          cancellable: true
        }, async (progress, token) => {
          // Use correct method name
          const result = await this.moduleScanner.scanWorkspace(this.workspaceRoot);
          const metas: Edk2InfMeta[] = [];
          
          for (const infPath of result) {
            if (token.isCancellationRequested) {
              break;
            }
            
            progress.report({ 
              message: `Parsing ${path.basename(infPath)}`,
              increment: (100 / result.length)
            });
            
            const meta = await this.moduleScanner.rescanModule(infPath);
            if (meta) {
              metas.push(meta);
            }
          }
          
          this.modules = metas;
        });
      } else {
        // Use correct method name
        const result = await this.moduleScanner.scanWorkspace(this.workspaceRoot);
        const metas: Edk2InfMeta[] = [];
        
        for (const infPath of result) {
          const meta = await this.moduleScanner.rescanModule(infPath);
          if (meta) {
            metas.push(meta);
          }
        }
        
        this.modules = metas;
      }

      // Sort by module type and name
      this.modules.sort((a, b) => {
        if (a.moduleType !== b.moduleType) {
          return a.moduleType.localeCompare(b.moduleType);
        }
        return a.baseName.localeCompare(b.baseName);
      });

    } catch (error) {
      console.error('Scan modules error:', error);
      vscode.window.showErrorMessage(`Failed to scan EDK2 modules: ${error}`);
    }
  }

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
    
    // Set icon
    if (element.enhanced) {
      item.iconPath = new vscode.ThemeIcon('debug-alt', new vscode.ThemeColor('testing.iconPassed'));
    } else {
      item.iconPath = new vscode.ThemeIcon('circle-outline', new vscode.ThemeColor('testing.iconQueued'));
    }
    
    // Open INF file on click
    item.command = {
      command: 'vscode.open',
      title: 'Open',
      arguments: [vscode.Uri.file(element.filePath)]
    };
    
    return item;
  }

  getChildren(element?: Edk2InfMeta): Thenable<Edk2InfMeta[]> {
    if (!element) {
      return Promise.resolve(this.modules);
    }
    return Promise.resolve([]);
  }

  getModuleCount(): number {
    return this.modules.length;
  }

  async getAllModules(): Promise<Edk2InfMeta[]> {
    return this.modules;
  }

  async getModuleByPath(infPath: string): Promise<Edk2InfMeta | undefined> {
    return this.modules.find(m => m.filePath === infPath);
  }

  async updateModuleStatus(infPath: string, enhanced: boolean): Promise<void> {
    // Use rescanModule method
    const updatedModule = await this.moduleScanner.rescanModule(infPath);
    
    if (updatedModule) {
      const index = this.modules.findIndex(m => m.filePath === infPath);
      if (index !== -1) {
        this.modules[index] = updatedModule;
        this._onDidChangeTreeData.fire();
      }
    }
  }

  async getProjectStatistics() {
    return this.projectAnalyzer.getProjectStatistics();
  }
}
