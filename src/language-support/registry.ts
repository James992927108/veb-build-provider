// src/language-support/registry.ts

import * as vscode from 'vscode';
import { logMessage } from '../shared/utils/logger';

// Import all providers
import {
    Edk2FdfDefinitionProvider,
    Edk2DscDefinitionProvider,
    Edk2DecDefinitionProvider,
    Edk2InfDefinitionProvider,
    Edk2VfrDefinitionProvider
} from './providers/definitionProvider';

import {
    Edk2DscSymbolProvider,
    Edk2DecSymbolProvider,
    Edk2FdfSymbolProvider,
    Edk2InfSymbolProvider
} from './providers/symbolProvider';

import {
    Edk2DocumentFormattingProvider,
    Edk2DocumentRangeFormattingProvider
} from './providers/formattingProvider';

/**
 * Registers all EDK2 language providers
 * @param context The extension context for registering disposables
 */
export function registerLanguageProviders(context: vscode.ExtensionContext): void {
    logMessage("Starting unified language providers registration");

    try {
        // Register Definition Providers
        registerDefinitionProviders(context);
        
        // Register Symbol Providers
        registerSymbolProviders(context);
        
        // Register Formatting Providers
        registerFormattingProviders(context);

        logMessage("All unified language providers registered successfully");
    } catch (error) {
        logMessage(`Error registering unified language providers: ${error}`);
        throw error;
    }
}

/**
 * Registers definition providers for various EDK2 file types
 */
function registerDefinitionProviders(context: vscode.ExtensionContext): void {
    const definitionProviders = [
        {
            language: 'edk2_fdf',
            provider: new Edk2FdfDefinitionProvider(),
            description: 'EDK2 FDF Definition Provider'
        },
        {
            language: 'edk2_dsc',
            provider: new Edk2DscDefinitionProvider(),
            description: 'EDK2 DSC Definition Provider'
        },
        {
            language: 'edk2_dec',
            provider: new Edk2DecDefinitionProvider(),
            description: 'EDK2 DEC Definition Provider'
        },
        {
            language: 'edk2_inf',
            provider: new Edk2InfDefinitionProvider(),
            description: 'EDK2 INF Definition Provider'
        },
        {
            language: 'edk2_vfr',
            provider: new Edk2VfrDefinitionProvider(),
            description: 'EDK2 VFR Definition Provider'
        }
    ];

    definitionProviders.forEach(({ language, provider, description }) => {
        try {
            const disposable = vscode.languages.registerDefinitionProvider(
                { scheme: 'file', language: language },
                provider
            );
            context.subscriptions.push(disposable);
            logMessage(`Registered ${description}`);
        } catch (error) {
            logMessage(`Failed to register ${description}: ${error}`);
        }
    });
}

/**
 * Registers document symbol providers for various EDK2 file types
 */
function registerSymbolProviders(context: vscode.ExtensionContext): void {
    const symbolProviders = [
        {
            language: 'edk2_dsc',
            provider: new Edk2DscSymbolProvider(),
            description: 'EDK2 DSC Symbol Provider'
        },
        {
            language: 'edk2_dec',
            provider: new Edk2DecSymbolProvider(),
            description: 'EDK2 DEC Symbol Provider'
        },
        {
            language: 'edk2_fdf',
            provider: new Edk2FdfSymbolProvider(),
            description: 'EDK2 FDF Symbol Provider'
        },
        {
            language: 'edk2_inf',
            provider: new Edk2InfSymbolProvider(),
            description: 'EDK2 INF Symbol Provider'
        }
    ];

    symbolProviders.forEach(({ language, provider, description }) => {
        try {
            const disposable = vscode.languages.registerDocumentSymbolProvider(
                { scheme: 'file', language: language },
                provider
            );
            context.subscriptions.push(disposable);
            logMessage(`Registered ${description}`);
        } catch (error) {
            logMessage(`Failed to register ${description}: ${error}`);
        }
    });
}

/**
 * Registers formatting providers for various EDK2 file types
 */
function registerFormattingProviders(context: vscode.ExtensionContext): void {
    const edk2Languages = ['edk2_fdf', 'edk2_dsc', 'edk2_dec', 'edk2_inf', 'edk2_vfr'];
    const documentFormattingProvider = new Edk2DocumentFormattingProvider();
    const rangeFormattingProvider = new Edk2DocumentRangeFormattingProvider();

    edk2Languages.forEach(language => {
        try {
            // Register document formatting provider
            const docFormattingDisposable = vscode.languages.registerDocumentFormattingEditProvider(
                { scheme: 'file', language: language },
                documentFormattingProvider
            );
            context.subscriptions.push(docFormattingDisposable);

            // Register range formatting provider
            const rangeFormattingDisposable = vscode.languages.registerDocumentRangeFormattingEditProvider(
                { scheme: 'file', language: language },
                rangeFormattingProvider
            );
            context.subscriptions.push(rangeFormattingDisposable);

            logMessage(`Registered formatting providers for ${language}`);
        } catch (error) {
            logMessage(`Failed to register formatting providers for ${language}: ${error}`);
        }
    });
}

/**
 * Gets available language features for a specific language
 * @param languageId The language identifier
 * @returns Object containing available features for the language
 */
export function getLanguageFeatures(languageId: string): {
    hasDefinitionProvider: boolean;
    hasSymbolProvider: boolean;
    hasFormattingProvider: boolean;
} {
    const edk2Languages = ['edk2_fdf', 'edk2_dsc', 'edk2_dec', 'edk2_inf', 'edk2_vfr'];

    return {
        hasDefinitionProvider: edk2Languages.includes(languageId),
        hasSymbolProvider: ['edk2_dsc', 'edk2_dec', 'edk2_fdf', 'edk2_inf'].includes(languageId),
        hasFormattingProvider: edk2Languages.includes(languageId)
    };
}

/**
 * Activates language providers based on workspace context
 * @param context The extension context
 */
export function activateLanguageProviders(context: vscode.ExtensionContext): void {
    // Check if workspace contains EDK2 files
    const workspaceHasEdk2Files = checkWorkspaceForEdk2Files();
    
    if (workspaceHasEdk2Files) {
        logMessage("EDK2 files detected in workspace, activating unified language providers");
        registerLanguageProviders(context);
        
        // Set context for UI elements
        vscode.commands.executeCommand('setContext', 'vebBuild.hasEdk2Files', true);
    } else {
        logMessage("No EDK2 files detected, unified language providers available but not pre-activated");
        
        // Still register providers but don't set workspace context
        registerLanguageProviders(context);
        vscode.commands.executeCommand('setContext', 'vebBuild.hasEdk2Files', false);
    }
}

/**
 * Checks if the current workspace contains EDK2 files
 * @returns True if EDK2 files are found
 */
function checkWorkspaceForEdk2Files(): boolean {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return false;
    }

    // Use workspace.findFiles to check for common EDK2 file types
    const edk2FilePatterns = [
        '**/*.dsc',
        '**/*.dec',
        '**/*.inf',
        '**/*.fdf',
        '**/*.vfr'
    ];

    // This is a simplified check - in practice you might want to use async file search
    // For now, just check if any workspace folder seems to be an EDK2 project
    return workspaceFolders.some(folder => {
        const folderName = folder.name.toLowerCase();
        return folderName.includes('edk2') || 
               folderName.includes('uefi') || 
               folderName.includes('bios') ||
               folderName.includes('firmware');
    });
}

/**
 * Deactivates all language providers
 * Called during extension deactivation
 */
export function deactivateLanguageProviders(): void {
    logMessage("Deactivating unified language providers");
    // Providers are automatically disposed when extension context is disposed
    // This function is mainly for logging and cleanup if needed
}
