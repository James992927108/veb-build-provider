// src/utils/file.ts

import { logInfo, logDebug, handleError } from './logger';

import * as fs from 'fs/promises';

/**
 * Build a human-readable description from an arbitrary thrown value.
 */
export function describeError(error: any): string {
    return error instanceof Error ? error.stack || error.message : String(error);
}

/**
 * Escape backslashes in a file path (for Windows compatibility).
 * @param filePath The input file path.
 * @returns The escaped file path.
 */
export function escapePath(filePath: string): string {
    return filePath.replace(/\\/g, '\\\\');
}

/**
 * Read the content of a file as a UTF-8 string.
 * @param filePath The path to the file.
 * @returns The file content as string, or '' if failed.
 */
export async function readFile(filePath: string): Promise<string> {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        logDebug(`Successfully read file: ${filePath}`);
        return content;
    } catch (error) {
        handleError(`Failed to read file: ${filePath}: ${describeError(error)}`);
        return '';
    }
}

/**
 * Write a string to a file as UTF-8.
 * @param filePath The path to the file.
 * @param content The content to write.
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
    try {
        await fs.writeFile(filePath, content, 'utf8');
        logDebug(`Successfully wrote to file: ${filePath}`);
    } catch (error) {
        handleError(`Failed to write to file: ${filePath}: ${describeError(error)}`);
    }
}

/**
 * Copy a file from source to target if the target does not exist.
 * @param source The source file path.
 * @param target The target file path.
 */
export async function copyFile(source: string, target: string): Promise<void> {
    try {
        await fs.access(target);
        logDebug(`${target} already exists`);
    } catch {
        try {
            await fs.copyFile(source, target);
            logDebug(`Copied ${source} to ${target} successfully`);
        } catch (error) {
            handleError(`Failed to copy file from ${source} to ${target}: ${describeError(error)}`);
        }
    }
}

