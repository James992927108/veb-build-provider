import * as vscode from 'vscode';
import * as fs from "fs";
import * as readline from "readline";
import * as util from 'util';

import formatUni from "./Formatter/formatUni";
import formatSdl from "./Formatter/formatSdl";

function detectFileEncoding(filepath: string): Promise<any> {
    return new Promise(resolve => {
        /**
         * create local variable
         */
        const chardet = require('chardet');
        const encodingType: string = chardet.detectFileSync(filepath);
        //   console.log('encodingType', encodingType);

        /**
         * resolve result
         */
        resolve(encodingType);
    });
}

function writeBacktoFile(filepath: string, fileEncoding: string, fileString: string) {

    const writeFile = util.promisify(fs.writeFile);

    writeFile(filepath, fileString, { encoding: fileEncoding })
        .then(() => {
            console.log('File created!');
        })
        .catch(error => console.log("error: ", error));

}

function findMaxLength(filepath: string, fileEncoding: string): Promise<any> {
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
            // console.log('encoding right');

            switch (fileEncoding) {
                // *.uni
                case "UTF-16LE": {
                    console.log("fileEncoding is", fileEncoding);
                    fileEncoding = "UTF-16LE";
                    findMaxLength(filePath, fileEncoding).then(function (maxStringLength) {
                        console.log('return value of findMaxLength: ' + maxStringLength);
                        formatUni(filePath, fileEncoding, maxStringLength).then(function (fileString) {
                            // console.log(fileString);
                            writeBacktoFile(filePath, fileEncoding, fileString);
                        });
                    });
                    break;
                }
                // *.Sdl
                case "ISO-8859-1": {
                    console.log("fileEncoding is " + fileEncoding + ", set to utf8");
                    fileEncoding = "utf8";
                    formatSdl(filePath, fileEncoding).then(function (fileString) {
                        // console.log(fileString);
                        writeBacktoFile(filePath, fileEncoding, fileString);
                    });
                    break;
                }
                default: {
                    console.log('fileEncoding', fileEncoding);
                }
            }
        });
    }
}

export default Edk2Formatter;