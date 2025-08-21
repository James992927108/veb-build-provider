// src/language-support/commands/formatterCommands.ts

import * as vscode from 'vscode';
import * as fs from "fs";
import * as readline from "readline";
import * as util from 'util';
import { formatUni, formatSdl } from '../core/edk2Formatter';
import { logInfo, logDebug, logError, logSummary, handleError, outputChannel } from '../../shared/utils/logger';
import { registerCommandWithLog } from '../../shared/utils/commandRegistry';

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
        logInfo('File formatted successfully!');
    } catch (error) {
        const errorMessage = `Failed to write file: ${error instanceof Error ? error.message : String(error)}`;
        logError(errorMessage);
        throw new Error(errorMessage);
    }
}

async function findMaxLength(filepath: string, fileEncoding: BufferEncoding): Promise<number> {
    return new Promise((resolve, reject) => {
        let maxLength = 0;
        
        const readStream = fs.createReadStream(filepath);
        readStream.setEncoding(fileEncoding);
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });

        readStream.once('error', (err) => {
            reject(new Error(`Failed to read file: ${err.message}`));
        });

        rl.on('line', (line: string) => {
            const match = line.match(/^#string\s+(\w+)/);
            if (match) {
                const length = match[1].length;
                if (length > maxLength) {
                    maxLength = length;
                }
            }
        });

        rl.on('close', () => {
            rl.close();
            readStream.destroy();
            resolve(maxLength);
        });
    });
}

export async function Edk2Formatter(): Promise<void> {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error('No active editor found');
        }

        const document = editor.document;
        const filepath = document.fileName;
        
        logDebug(`Starting Edk2Formatter for file: ${filepath}`);

        // Detect file encoding
        const encodingType = await detectFileEncoding(filepath);
        logDebug(`Detected encoding: ${encodingType}`);

        const encodingConfig = ENCODING_MAP[encodingType];
        if (!encodingConfig) {
            throw new Error(`Unsupported encoding: ${encodingType}`);
        }

        const { buffer: fileEncoding, needsMaxLength } = encodingConfig;

        // Determine formatter type based on file extension
        const fileExtension = filepath.toLowerCase();
        let formattedString: string;

        if (fileExtension.endsWith('.uni')) {
            // UNI file formatting
            if (needsMaxLength) {
                const maxStringLength = await findMaxLength(filepath, fileEncoding);
                formattedString = await formatUni(filepath, fileEncoding, maxStringLength);
            } else {
                formattedString = await formatUni(filepath, fileEncoding, 0);
            }
        } else if (fileExtension.endsWith('.sdl')) {
            // SDL file formatting
            formattedString = await formatSdl(filepath, fileEncoding);
        } else {
            throw new Error(`Unsupported file type: ${fileExtension}`);
        }

        // Write back to file
        await writeBacktoFile(filepath, fileEncoding, formattedString);
        
        // Reload the document in VS Code
        await vscode.commands.executeCommand('workbench.action.files.revert');
        
        logInfo("Edk2Formatter completed successfully");
        
    } catch (error) {
        const errorMessage = `Edk2Formatter failed: ${error instanceof Error ? error.message : String(error)}`;
        handleError(errorMessage);
        throw new Error(errorMessage);
    }
}

export default Edk2Formatter;

// Command registration
export function registerFormatterCommands(context: vscode.ExtensionContext): void {
    registerCommandWithLog(context, 'vebBuild.formatter.formatEdk2', handleEdk2Formatter);
}

async function handleEdk2Formatter(): Promise<void> {
    try {
        logDebug("Starting Edk2Formatter");
        await Edk2Formatter();
        logInfo("Edk2Formatter completed successfully");
    } catch (error) {
        handleError(`Edk2Formatter failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
