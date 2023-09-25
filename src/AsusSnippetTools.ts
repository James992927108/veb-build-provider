import * as vscode from 'vscode';
import * as fs from "fs";
import * as readline from "readline";
import * as util from 'util';

/**
 * 
 * @param filePath 
 */

class AsusSnippetTools {
    constructor(private vscodeInstance: typeof vscode) {
        // 可以在构造函数中进行初始化操作
    }

    processFile() {
        const activeEditor = this.vscodeInstance.window.activeTextEditor;

        if (activeEditor) {
            let filePath = activeEditor.document.uri.fsPath;
            let fileEncoding = "utf8";
            console.log('filePath', filePath);
            this.DebugToAsusPrint(filePath, fileEncoding).then((fileString) => {
                console.log('DebugToAsusPrint');
                this.writeBacktoFile(filePath, fileEncoding, fileString);
            });
        }
    }

    processFile1() {
        const activeEditor = this.vscodeInstance.window.activeTextEditor;

        if (activeEditor) {
            let filePath = activeEditor.document.uri.fsPath;
            let fileEncoding = "utf8";
            console.log('filePath', filePath);
            this.AsusPrintToDebug(filePath, fileEncoding).then((fileString) => {
                console.log('AsusPrintToDebug');
                this.writeBacktoFile(filePath, fileEncoding, fileString);
            });
        }
    }

    private DebugToAsusPrint(filepath: string, fileEncoding: string): Promise<any> {
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
                console.log("readStream error");
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
                    // console.log(lineno, line);
                    line = line.replace(patternDebugString, 'ASUSPRINT(').replace(patternTailString, ')');
                    // console.log(line);
                }
                if (line.match(patternTraceString)) {
                    // console.log(lineno, line);
                    line = line.replace(patternTraceString, 'ASUSPRINT(').replace(patternTailString, ')');
                    // console.log(line);
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
    private AsusPrintToDebug(filepath: string, fileEncoding: string): Promise<any> {

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
                console.log("readStream error");
                resolve(null);
            });

            rl.on("line", (line: string, lineno = line_counter()) => {
                //Remove header file 
                if(lineno === 1){
                    return;
                }
                const patternDebugString = new RegExp(/ASUSPRINT\s*\(/);
                const patternTailString = new RegExp(/\s*\);/);
                // Replace DEBUG
                if (line.match(patternDebugString)) {
                    // console.log(lineno, line);
                    line = line.replace(patternDebugString, 'DEBUG ((DEBUG_INFO, ').replace(patternTailString, '));');
                    // console.log(line);
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

    private writeBacktoFile(filepath: string, fileEncoding: string, fileString: string) {
        const writeFile = util.promisify(fs.writeFile);
        writeFile(filepath, fileString, { encoding: fileEncoding })
            .then(() => {
                console.log('File created success!');
            })
            .catch(error => console.log(error));

    }
}

export default AsusSnippetTools;