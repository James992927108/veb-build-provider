import * as vscode from 'vscode';
import * as fs from "fs";
import * as readline from "readline";
import * as util from 'util';

import UnifiedFormatter from "./unifiedFormatter";
import { logMessage, handleError, outputChannel } from '../utils/logger';

// Type definitions
interface EncodingConfig {
    buffer: BufferEncoding;
    needsMaxLength: boolean;
}

const ENCODING_MAP: Record<string, EncodingConfig> = {
    'UTF-16LE': { buffer: 'utf16le', needsMaxLength: true },
    'ISO-8859-1': { buffer: 'utf8', needsMaxLength: false },
    'UTF-8': { buffer: 'utf8', needsMaxLength: false }
};

async function detectFileEncoding(filepath: string): Promise<string> {
    try {
        const chardet = require('chardet');
        const encodingType = chardet.detectFileSync(filepath);
        
        if (!encodingType) {
            throw new Error('Cannot detect file encoding');
        }
        
        return encodingType;
    } catch (error) {
        throw new Error(`File encoding detection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function writeBacktoFile(filepath: string, fileEncoding: BufferEncoding, fileString: string): Promise<void> {
    try {
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(filepath, fileString, { encoding: fileEncoding });
        logMessage('File formatted successfully!');
    } catch (error) {
        const errorMessage = `Failed to write file: ${error instanceof Error ? error.message : String(error)}`;
        logMessage(errorMessage);
        throw new Error(errorMessage);
    }
}

async function findMaxLength(filepath: string, fileEncoding: BufferEncoding): Promise<number> {
    return new Promise((resolve, reject) => {
        let maxLength = 0;
        let currentLength = 0;

        const readStream = fs.createReadStream(filepath);
        readStream.setEncoding(fileEncoding);
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity,
        });

        readStream.once("error", (err) => {
            logMessage("readStream error: " + err.message);
            reject(new Error(`Failed to read file: ${err.message}`));
        });

        rl.on("line", (line: string) => {
            const patternString = /^#string/;
            if (line.match(patternString)) {
                logMessage(line);
                const parts = line.split("#string")[1]?.trim().split(/\s+/);
                if (parts && parts.length > 0) {
                    currentLength = parts[0].length;
                    if (currentLength > maxLength) {
                        maxLength = currentLength;
                    }
                }
            }
        });

        rl.on("close", () => {
            rl.close();
            readStream.destroy();
            resolve(maxLength);
        });
    });
}

async function processFileByEncoding(filePath: string, fileEncoding: string): Promise<void> {
    const config = ENCODING_MAP[fileEncoding];
    if (!config) {
        throw new Error(`Unsupported file encoding: ${fileEncoding}`);
    }

    logMessage(`Processing file with encoding: ${fileEncoding}, buffer: ${config.buffer}`);

    const formatter = new UnifiedFormatter();
    let fileString: string;

    if (config.needsMaxLength) {
        // For UNI files (UTF-16LE)
        const maxStringLength = await findMaxLength(filePath, config.buffer);
        fileString = await formatter.format(filePath, config.buffer, 'uni', maxStringLength);
    } else {
        // For SDL files (UTF-8, ISO-8859-1)
        fileString = await formatter.format(filePath, config.buffer, 'sdl');
    }

    await writeBacktoFile(filePath, config.buffer, fileString);
}

/**
 * Format the currently active file in the editor based on its encoding.
 */
export async function Edk2Formatter(): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
        logMessage('No active editor found');
        return;
    }

    try {
        const filePath = activeEditor.document.uri.fsPath;
        logMessage('Processing file: ' + filePath);

        const fileEncoding = await detectFileEncoding(filePath);
        await processFileByEncoding(filePath, fileEncoding);
        
        logMessage('File formatting completed successfully');
    } catch (error) {
        const errorMessage = `Edk2Formatter failed: ${error instanceof Error ? error.message : String(error)}`;
        logMessage(errorMessage);
        handleError(error);
        throw error;
    }
}

export default Edk2Formatter;