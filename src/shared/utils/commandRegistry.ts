// src/utils/commandRegistry.ts

import * as vscode from 'vscode';
import { logMessage, handleError } from './logger';

/**
 * Command registration options interface
 */
export interface CommandRegistrationOptions {
    /** Whether to log successful registration */
    logSuccess?: boolean;
    /** Whether to log errors during registration */
    logErrors?: boolean;
    /** Custom error message prefix */
    errorPrefix?: string;
    /** Whether to show error messages to user */
    showErrorToUser?: boolean;
}

/**
 * Default options for command registration
 */
const DEFAULT_OPTIONS: Required<CommandRegistrationOptions> = {
    logSuccess: true,
    logErrors: true,
    errorPrefix: 'Command registration failed',
    showErrorToUser: false
};

/**
 * Registers a VS Code command with enhanced error handling and logging
 * @param context The extension context for managing subscriptions
 * @param commandId The unique command identifier
 * @param handler The command handler function
 * @param options Optional configuration for registration behavior
 * @returns The disposable for the registered command
 */
export function registerCommandWithLog(
    context: vscode.ExtensionContext,
    commandId: string,
    handler: (...args: any[]) => any,
    options?: CommandRegistrationOptions
): vscode.Disposable | null {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    try {
        // Validate inputs
        if (!context) {
            throw new Error('Extension context is required');
        }
        if (!commandId || typeof commandId !== 'string') {
            throw new Error('Valid command ID is required');
        }
        if (!handler || typeof handler !== 'function') {
            throw new Error('Command handler function is required');
        }

        // Create wrapper handler with error handling
        const wrappedHandler = createErrorHandledWrapper(commandId, handler, opts);

        // Register the command
        const disposable = vscode.commands.registerCommand(commandId, wrappedHandler);

        // Add to context subscriptions for automatic cleanup
        context.subscriptions.push(disposable);

        if (opts.logSuccess) {
            logMessage(`✓ Registered command: ${commandId}`);
        }

        return disposable;
    } catch (error) {
        const errorMessage = `${opts.errorPrefix}: ${commandId} - ${error instanceof Error ? error.message : String(error)}`;

        if (opts.logErrors) {
            handleError(errorMessage);
        }

        if (opts.showErrorToUser) {
            vscode.window.showErrorMessage(`Failed to register command: ${commandId}`);
        }

        return null;
    }
}

/**
 * Creates an error-handled wrapper for command handlers
 * @param commandId The command identifier for error reporting
 * @param handler The original handler function
 * @param options Registration options
 * @returns Wrapped handler function
 */
function createErrorHandledWrapper(
    commandId: string,
    handler: (...args: any[]) => any,
    options: Required<CommandRegistrationOptions>
): (...args: any[]) => Promise<any> {
    return async (...args: any[]) => {
        try {
            logMessage(`→ Executing command: ${commandId}`);
            const result = await Promise.resolve(handler(...args));
            logMessage(`✓ Command completed: ${commandId}`);
            return result;
        } catch (error) {
            const errorMessage = `Command execution failed [${commandId}]: ${error instanceof Error ? error.message : String(error)}`;

            if (options.logErrors) {
                handleError(errorMessage);
            }

            if (options.showErrorToUser) {
                vscode.window.showErrorMessage(`Error executing ${commandId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }

            // Re-throw to maintain error propagation if needed
            throw error;
        }
    };
}

/**
 * Registers multiple commands at once
 * @param context The extension context
 * @param commands Array of command registration data
 * @param options Global options for all command registrations
 * @returns Array of disposables for registered commands
 */
export function registerCommands(
    context: vscode.ExtensionContext,
    commands: Array<{
        commandId: string;
        handler: (...args: any[]) => any;
        options?: CommandRegistrationOptions;
    }>,
    globalOptions?: CommandRegistrationOptions
): vscode.Disposable[] {
    const disposables: vscode.Disposable[] = [];

    logMessage(`Registering ${commands.length} commands...`);

    for (const { commandId, handler, options } of commands) {
        const mergedOptions = { ...globalOptions, ...options };
        const disposable = registerCommandWithLog(context, commandId, handler, mergedOptions);

        if (disposable) {
            disposables.push(disposable);
        }
    }

    logMessage(`Successfully registered ${disposables.length}/${commands.length} commands`);
    return disposables;
}

/**
 * Registers a command that executes another VS Code command
 * @param context The extension context
 * @param commandId The new command identifier
 * @param targetCommandId The existing VS Code command to execute
 * @param args Optional arguments to pass to the target command
 * @param options Registration options
 * @returns The disposable for the registered command
 */
export function registerCommandProxy(
    context: vscode.ExtensionContext,
    commandId: string,
    targetCommandId: string,
    args?: any[],
    options?: CommandRegistrationOptions
): vscode.Disposable | null {
    const handler = async () => {
        logMessage(`Proxying command ${commandId} to ${targetCommandId}`);
        return vscode.commands.executeCommand(targetCommandId, ...(args || []));
    };

    return registerCommandWithLog(context, commandId, handler, {
        ...options,
        errorPrefix: `Command proxy registration failed`
    });
}

/**
 * Registers a command with specific text editor requirements
 * @param context The extension context
 * @param commandId The command identifier
 * @param handler The handler function that receives the text editor
 * @param options Registration options
 * @returns The disposable for the registered command
 */
export function registerTextEditorCommand(
    context: vscode.ExtensionContext,
    commandId: string,
    handler: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => void,
    options?: CommandRegistrationOptions
): vscode.Disposable | null {
    try {
        const disposable = vscode.commands.registerTextEditorCommand(commandId, handler);
        context.subscriptions.push(disposable);

        if (options?.logSuccess !== false) {
            logMessage(`✓ Registered text editor command: ${commandId}`);
        }

        return disposable;
    } catch (error) {
        const errorMessage = `Text editor command registration failed: ${commandId} - ${error instanceof Error ? error.message : String(error)}`;

        if (options?.logErrors !== false) {
            handleError(errorMessage);
        }

        return null;
    }
}

/**
 * Utility function to check if a command exists
 * @param commandId The command identifier to check
 * @returns Promise that resolves to true if command exists
 */
export async function commandExists(commandId: string): Promise<boolean> {
    try {
        const commands = await vscode.commands.getCommands(true);
        return commands.includes(commandId);
    } catch (error) {
        logMessage(`Error checking command existence for ${commandId}: ${error}`);
        return false;
    }
}

/**
 * Gets all available commands (including internal ones)
 * @returns Promise that resolves to array of command IDs
 */
export async function getAllCommands(): Promise<string[]> {
    try {
        return await vscode.commands.getCommands(true);
    } catch (error) {
        handleError(`Failed to get commands list: ${error}`);
        return [];
    }
}

/**
 * Executes a command safely with error handling
 * @param commandId The command to execute
 * @param args Arguments to pass to the command
 * @returns Promise that resolves to the command result or null on error
 */
export async function executeCommandSafely<T = any>(
    commandId: string,
    ...args: any[]
): Promise<T | null> {
    try {
        logMessage(`Executing command: ${commandId}`);
        const result = await vscode.commands.executeCommand<T>(commandId, ...args);
        logMessage(`Command executed successfully: ${commandId}`);
        return result;
    } catch (error) {
        handleError(`Command execution failed [${commandId}]: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
}

/**
 * Creates a disposable collection for managing multiple command registrations
 * @returns Disposable collection manager
 */
export function createCommandRegistry(): {
    register: (context: vscode.ExtensionContext, commandId: string, handler: (...args: any[]) => any, options?: CommandRegistrationOptions) => void;
    registerMultiple: (context: vscode.ExtensionContext, commands: Array<{ commandId: string; handler: (...args: any[]) => any; options?: CommandRegistrationOptions }>) => void;
    dispose: () => void;
    getRegisteredCommands: () => string[];
} {
    const disposables: vscode.Disposable[] = [];
    const registeredCommands: string[] = [];

    return {
        register: (context, commandId, handler, options) => {
            const disposable = registerCommandWithLog(context, commandId, handler, options);
            if (disposable) {
                disposables.push(disposable);
                registeredCommands.push(commandId);
            }
        },

        registerMultiple: (context, commands) => {
            const newDisposables = registerCommands(context, commands);
            disposables.push(...newDisposables);
            registeredCommands.push(...commands.map(cmd => cmd.commandId));
        },

        dispose: () => {
            disposables.forEach(d => d.dispose());
            disposables.length = 0;
            registeredCommands.length = 0;
            logMessage('Command registry disposed');
        },

        getRegisteredCommands: () => [...registeredCommands]
    };
}
