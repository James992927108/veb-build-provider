import * as vscode from 'vscode';
import * as fs from "fs";
import * as readline from "readline";
import * as util from 'util';

import formatUni from "./Formatter/formatUni";
import formatSdl from "./Formatter/formatSdl";

function detectFileEncoding(filepath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const chardet = require('chardet');
        try {
            const encodingType = chardet.detectFileSync(filepath);
            resolve(encodingType);
        } catch (error) {
            reject(error); // Handle any potential error in detection
        }
    });
}

function writeBacktoFile(filepath: string, fileEncoding: any, fileString: string) {

    const writeFile = util.promisify(fs.writeFile);

    writeFile(filepath, fileString, { encoding: fileEncoding })
        .then(() => {
            console.log('File created!');
        })
        .catch(error => console.log("error: ", error));

}

function findMaxLength(filepath: string, fileEncoding: any): Promise<any> {
    return new Promise((resolve) => {
        /**
         * create local variable
         */
        let maxLength = 0;
        let currentLength = 0;

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
        rl.on("line", (line: string) => {
            const patternString = new RegExp(/^#string/);
            if (line.match(patternString)) {
                // console.log(line);
                currentLength = line.split("#string")[1].trim().split(/\s+/)[0].length;
                if (currentLength > maxLength) {
                    maxLength = currentLength;
                }
            }
        });

        /**
         * readline event: `close` handler
         */
        rl.on("close", () => {
            // closing readline and readStream
            rl.close();
            readStream.destroy();

            // maxLength will be resolved
            resolve(maxLength);
        });
    });
}
/**
 * 
 * @param filePath 
 */
function Edk2Formatter() {
    const activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
        let filePath = activeEditor.document.uri.fsPath;
        console.log('filePath', filePath);

        detectFileEncoding(filePath).then(function (fileEncoding) {
            switch (fileEncoding) {
                case "UTF-16LE": {
                    console.log("fileEncoding is", fileEncoding);
                    findMaxLength(filePath, fileEncoding).then(function (maxStringLength) {
                        formatUni(filePath, "utf16le", maxStringLength).then(function (fileString) {
                            writeBacktoFile(filePath, "utf16le", fileString); // Use correct BufferEncoding
                        });
                    });
                    break;
                }
                case "ISO-8859-1": {
                    console.log("fileEncoding is " + fileEncoding + ", set to utf8");
                    formatSdl(filePath, "utf8").then(function (fileString) {
                        writeBacktoFile(filePath, "utf8", fileString); // Use 'utf8' BufferEncoding
                    });
                    break;
                }
                default: {
                    console.log('Unsupported fileEncoding:', fileEncoding);
                }
            }
        }).catch(error => {
            console.error('Error detecting file encoding:', error);
        });
    }
}

export default Edk2Formatter;