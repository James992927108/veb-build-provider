import * as fs from 'fs';
import * as readline from "readline";
import * as vscode from 'vscode';
import { ONE_SPACE, HASH_STRING, HASH_LANGUAGE } from "../../shared/utils/constants";

// Formatter configuration interface
interface FormatterConfig {
    speceOnUni?: number;
    spaceOnSdlBefore?: number;
    spaceOnSdlAfter?: number;
}

// Line formatter interface
interface LineFormatter {
    formatLine(line: string, context: FormatterContext): string;
    getConfiguration(): FormatterConfig;
    needsMaxLength(): boolean;
}

// Formatting context
interface FormatterContext {
    config: FormatterConfig;
    maxStringLength?: number;
    spaceBefore: string;
    spaceAfter: string;
    langLineMaxSpaceAhead?: string;
}

// UNI formatter
export class UniLineFormatter implements LineFormatter {
    getConfiguration(): FormatterConfig {
        const config = vscode.workspace.getConfiguration('vebBuild.formatter');
        return { speceOnUni: config['speceOnUni'] };
    }

    needsMaxLength(): boolean {
        return true;
    }

    formatLine(line: string, context: FormatterContext): string {
        const patternString = /^#string/;
        const patternLanguage = /^#language/;
        
        if (line.match(patternString)) {
            // Handle #string lines
            const identifierName = line.split("#string")[1].trim().split(/\s+/)[0];
            const identifierNameLength = identifierName.length;
            const identifierLineMaxSpaceBehind = (context.maxStringLength || 0) - identifierNameLength;
            
            let spacesBetweenIdentifierAndLang = '';
            for (let i = 0; i < identifierLineMaxSpaceBehind; i++) {
                spacesBetweenIdentifierAndLang += ONE_SPACE;
            }
            spacesBetweenIdentifierAndLang += context.spaceBefore;
            
            const identifierValue = line.trim().split(HASH_LANGUAGE)[1];
            if (identifierValue === undefined) {
                // #string line without #language: leave it untouched instead of
                // emitting a literal "undefined" into the user's file.
                return line;
            }
            return HASH_STRING + identifierName + spacesBetweenIdentifierAndLang + HASH_LANGUAGE + identifierValue;
            
        } else if (line.trim().match(patternLanguage)) {
            // Handle #language lines
            return (context.langLineMaxSpaceAhead || '') + line.trim();
            
        } else if (line.trim() === '') {
            // Handle empty lines
            return '';
            
        } else {
            // Handle other lines
            return line;
        }
    }
}

// SDL formatter
class SdlLineFormatter implements LineFormatter {
    getConfiguration(): FormatterConfig {
        const config = vscode.workspace.getConfiguration('vebBuild.formatter');
        return { 
            spaceOnSdlBefore: config['spaceOnSdlBefore'],
            spaceOnSdlAfter: config['spaceOnSdlAfter']
        };
    }

    needsMaxLength(): boolean {
        return false;
    }

    formatLine(line: string, context: FormatterContext): string {
        const patternTab = /^\t/;
        const patternSpace = /^ /;

        if (line.match(patternSpace) || line.match(patternTab)) {
            const equalIndex = line.indexOf('=');
            if (equalIndex > -1) {
                const element = [line.slice(0, equalIndex).trim(), line.slice(equalIndex + 2).trim()];
                const identifierNameLength = element[0].length;
                const identifierLineMaxSpaceBehind = (context.config.spaceOnSdlAfter || 0) - identifierNameLength;
                
                let spacesBetweenIdentifierAndLang = '';
                if (identifierLineMaxSpaceBehind <= 0) {
                    spacesBetweenIdentifierAndLang += ONE_SPACE;
                } else {
                    for (let i = 0; i < identifierLineMaxSpaceBehind; i++) {
                        spacesBetweenIdentifierAndLang += ONE_SPACE;
                    }
                }
                
                return context.spaceBefore + element[0] + spacesBetweenIdentifierAndLang + "= " + element[1];
            }
        }
        
        return line;
    }
}

// Unified formatter
class UnifiedFormatter {
    private formatters = {
        uni: new UniLineFormatter(),
        sdl: new SdlLineFormatter()
    };

    async format(filepath: string, fileEncoding: BufferEncoding, type: 'uni' | 'sdl', maxStringLength?: number): Promise<string> {
        const formatter = this.formatters[type];
        const config = formatter.getConfiguration();
        
        // Prepare formatting context
        const context = this.createContext(config, maxStringLength);
        
        return new Promise((resolve, reject) => {
            let fileString = '';
            
            const readStream = fs.createReadStream(filepath);
            readStream.setEncoding(fileEncoding);
            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity,
            });

            readStream.once('error', (err) => {
                reject(new Error(`Failed to read file: ${err.message}`));
            });

            rl.on("line", (line: string) => {
                const formattedLine = formatter.formatLine(line, context);
                fileString += formattedLine + '\r\n';
            });

            rl.on('close', () => {
                rl.close();
                readStream.destroy();
                resolve(fileString);
            });
        });
    }

    private createContext(config: FormatterConfig, maxStringLength?: number): FormatterContext {
        // Generate space string
        const generateSpaces = (count: number): string => {
            return ONE_SPACE.repeat(count);
        };

        const context: FormatterContext = {
            config,
            maxStringLength,
            spaceBefore: '',
            spaceAfter: ''
        };

        if (config.speceOnUni !== undefined) {
            // UNI formatting context
            context.spaceBefore = generateSpaces(config.speceOnUni);
            if (maxStringLength) {
                const langLineMaxSpaceAheadNum = maxStringLength + HASH_STRING.length + config.speceOnUni;
                context.langLineMaxSpaceAhead = generateSpaces(langLineMaxSpaceAheadNum);
            }
        } else if (config.spaceOnSdlBefore !== undefined) {
            // SDL formatting context
            context.spaceBefore = generateSpaces(config.spaceOnSdlBefore);
        }

        return context;
    }
}

// Export functions for backward compatibility
export async function formatUni(filepath: string, fileEncoding: BufferEncoding, maxStringLength: number): Promise<string> {
    const formatter = new UnifiedFormatter();
    return formatter.format(filepath, fileEncoding, 'uni', maxStringLength);
}

export async function formatSdl(filepath: string, fileEncoding: BufferEncoding): Promise<string> {
    const formatter = new UnifiedFormatter();
    return formatter.format(filepath, fileEncoding, 'sdl');
}

// Core formatter class for VS Code integration
export class Edk2FormatterCore {
    private formatter: UnifiedFormatter;

    constructor() {
        this.formatter = new UnifiedFormatter();
    }

    async formatContent(content: string, languageId: string): Promise<string> {
        // For now, implement basic formatting logic.
        // OPT-19: be conservative — preserve leading indentation and blank lines
        // instead of destroying document layout (FDF/INF), only normalize spacing.
        const lines = content.split('\n');
        const formattedLines = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed === '') {
                return line; // keep blank lines intact
            }

            // Handle section headers
            if (trimmed.match(/^\[[\w\s\.]+\]$/)) {
                return trimmed;
            }

            // Handle key-value pairs (normalize spacing only)
            if (trimmed.includes('=')) {
                const [key, value] = trimmed.split('=', 2);
                return `${key.trim()} = ${value.trim()}`;
            }

            // Other lines: strip trailing whitespace but preserve leading indentation
            return line.replace(/\s+$/, '');
        });

        return formattedLines.join('\n');
    }
}

export default UnifiedFormatter;
