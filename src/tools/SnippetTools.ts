import * as vscode from 'vscode';
import * as fs from "fs";
import * as readline from "readline";
import * as util from 'util';
import { logMessage, handleError, outputChannel } from '../utils/logger';

/**
 * 
 * @param filePath 
 */

export class SnippetTools {
    constructor(private vscodeInstance: typeof vscode) {
        // 可以在构造函数中进行初始化操作
    }

    DebugToAsusPrint() {
        const activeEditor = this.vscodeInstance.window.activeTextEditor;

        if (activeEditor) {
            let filePath = activeEditor.document.uri.fsPath;
            let fileEncoding = "utf8";
            logMessage('filePath: ' + filePath);
            this._DebugToAsusPrint(filePath, fileEncoding).then((fileString) => {
                logMessage('DebugToAsusPrint');
                this.writeBacktoFile(filePath, fileEncoding, fileString);
            });
        }
    }

    AsusPrintToDebug() {
        const activeEditor = this.vscodeInstance.window.activeTextEditor;

        if (activeEditor) {
            let filePath = activeEditor.document.uri.fsPath;
            let fileEncoding = "utf8";
            logMessage('filePath: ' + filePath);
            this._AsusPrintToDebug(filePath, fileEncoding).then((fileString) => {
                logMessage('AsusPrintToDebug');
                this.writeBacktoFile(filePath, fileEncoding, fileString);
            });
        }
    }

    private _DebugToAsusPrint(filepath: string, fileEncoding: any): Promise<any> {
        const line_counter = ((i = 0) => () => ++i)();
        return new Promise((resolve) => {
            /**
             * create local variable
             */
            let fileString: string = '';

            /**
             * create read stream & readline interface
             */
            const readStream = fs.createReadStream(filepath);
            readStream.setEncoding(fileEncoding);
            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity,
            });

            /**
             * readline event: `line` handler
             */
            readStream.once("error", function (err) {
                logMessage("readStream error");
                resolve(null);
            });
            //Add header file 
            fileString = fileString + '#include <Library/AsusPrintLib.h>\r\n';

            rl.on("line", (line: string, lineno = line_counter()) => {
                // 
                const patternDebugString = new RegExp(/DEBUG\s*\(\s*\(.*?,\s*/);
                const patternTraceString = new RegExp(/TRACE\s*\(\s*\(.*?,\s*/);
                const patternTailString = new RegExp(/\s*\)\s*\)/);
                // Replace DEBUG
                if (line.match(patternDebugString)) {
                    logMessage(`[${lineno}] ${line}`);
                    line = line.replace(patternDebugString, 'ASUSPRINT(').replace(patternTailString, ')');
                    logMessage(line);
                }
                if (line.match(patternTraceString)) {
                    logMessage(`[${lineno}] ${line}`);
                    line = line.replace(patternTraceString, 'ASUSPRINT(').replace(patternTailString, ')');
                    logMessage(line);
                }
                fileString = fileString + line + '\r\n';
            });

            /**
             * readline event: `close` handler
             */
            rl.on("close", () => {
                // closing readline and readStream
                rl.close();
                readStream.destroy();

                // fileString will be resolved
                resolve(fileString);
            });
        });
    }
    private _AsusPrintToDebug(filepath: string, fileEncoding: any): Promise<any> {

        const line_counter = ((i = 0) => () => ++i)();
        return new Promise((resolve) => {
            /**
             * create local variable
             */
            let fileString: string = '';

            /**
             * create read stream & readline interface
             */
            const readStream = fs.createReadStream(filepath);
            readStream.setEncoding(fileEncoding);
            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity,
            });

            /**
             * readline event: `line` handler
             */
            readStream.once("error", function (err) {
                logMessage("readStream error");
                resolve(null);
            });

            rl.on("line", (line: string, lineno = line_counter()) => {
                //Remove header file 
                if (lineno === 1) {
                    return;
                }
                const patternDebugString = new RegExp(/ASUSPRINT\s*\(/);
                const patternTailString = new RegExp(/\s*\);/);
                // Replace DEBUG
                if (line.match(patternDebugString)) {
                    logMessage(`[${lineno}] ${line}`);
                    line = line.replace(patternDebugString, 'DEBUG ((DEBUG_INFO, ').replace(patternTailString, '));');
                    logMessage(line);
                }
                fileString = fileString + line + '\r\n';
            });

            /**
             * readline event: `close` handler
             */
            rl.on("close", () => {
                // closing readline and readStream
                rl.close();
                readStream.destroy();

                // fileString will be resolved
                resolve(fileString);
            });
        });
    }

    private writeBacktoFile(filepath: string, fileEncoding: any, fileString: string) {
        const writeFile = util.promisify(fs.writeFile);
        writeFile(filepath, fileString, { encoding: fileEncoding })
            .then(() => {
                logMessage('File created success!');
            })
            .catch(error => logMessage(error));

    }
}