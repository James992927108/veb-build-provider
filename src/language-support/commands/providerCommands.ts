// src/language-support/commands/providerCommands.ts

import * as vscode from 'vscode';
import { logInfo, logDebug, logError } from '../../shared/utils/logger';

// Import all providers
import {
    Edk2FdfDefinitionProvider,
    Edk2DscDefinitionProvider,
    Edk2DecDefinitionProvider,
    Edk2InfDefinitionProvider,
    Edk2VfrDefinitionProvider
} from '../providers/definitionProvider';

import {
    Edk2DscSymbolProvider,
    Edk2DecSymbolProvider,
    Edk2FdfSymbolProvider,
    Edk2InfSymbolProvider
} from '../providers/symbolProvider';

import {
    Edk2DocumentFormattingProvider,
    Edk2DocumentRangeFormattingProvider
} from '../providers/formattingProvider';

/**
 * Registers all EDK2 language providers
 * @param context The extension context for registering disposables
 */
export function registerLanguageProviders(context: vscode.ExtensionContext): void {
    logDebug("Starting unified language providers registration");

    try {
        // Register Definition Providers
        registerDefinitionProviders(context);
        
        // Register Symbol Providers
        registerSymbolProviders(context);
        
        // Register Formatting Providers
        registerFormattingProviders(context);

        logDebug("All unified language providers registered successfully");
    } catch (error) {
        logError(`Error registering unified language providers: ${error}`);
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
            logDebug(`Registered ${description}`);
        } catch (error) {
            logError(`Failed to register ${description}: ${error}`);
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
            logDebug(`Registered ${description}`);
        } catch (error) {
            logError(`Failed to register ${description}: ${error}`);
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

            logDebug(`Registered formatting providers for ${language}`);
        } catch (error) {
            logError(`Failed to register formatting providers for ${language}: ${error}`);
        }
    });
}




