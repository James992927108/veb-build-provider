// src/utils/commandRegistry.ts

import * as vscode from 'vscode';
import { logInfo, logDebug, handleError } from './logger';

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
            logInfo(`✓ Registered command: ${commandId}`);
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
            logDebug(`→ Executing command: ${commandId}`);
            const result = await Promise.resolve(handler(...args));
            logInfo(`✓ Command completed: ${commandId}`);
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








