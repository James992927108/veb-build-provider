import * as fs from 'fs';
import * as readline from "readline";
import * as vscode from 'vscode';
import { ONE_SPACE } from "./constants";

function formatSdl(filepath: string, fileEncoding: any): Promise<any> {
    return new Promise(resolve => {
        /**
         * create local variable
         */
        let genSpaceCurrentNum: number = 0;
        const config = vscode.workspace.getConfiguration('formatter');
        const spaceOnSdlBeforeNum = config['spaceOnSdlBefore'];
        const spaceOnSdlAfterNum = config['spaceOnSdlAfter'];
        let spaceOnSdlStr: string = '';
        let fileString: string = '';
        let tempString: string = '';


        /**
         *  set the spece defined by user configuration.
         */
        for (genSpaceCurrentNum = 0; genSpaceCurrentNum < spaceOnSdlBeforeNum; genSpaceCurrentNum++) {
            spaceOnSdlStr += ONE_SPACE;
        }

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
        readStream.once('error', _ => resolve(null));
        rl.on("line", (line: string) => {

            const patternTab = new RegExp(/^\t/);
            const patternSpace = new RegExp(/^ /);

            if (line.match(patternSpace) || line.match(patternTab)) {
                var i = line.indexOf('=');
                // console.log("indexof \"=\" -> ",i);
                if (i > -1) {
                    var element = [line.slice(0, i).trim(), line.slice(i + 2).trim()]; // i + 2 for remove "="
                    // console.log(element);
                    let spacesBetweenIdentifierAndLang: string = '';
                    let identifierNameLength = element[0].length;
                    let identifierLineMaxSpaceBehind = spaceOnSdlAfterNum - identifierNameLength; //Calculate spaces that needed between identifierName and #language
                    if (identifierLineMaxSpaceBehind <= 0) {
                        spacesBetweenIdentifierAndLang += ONE_SPACE;
                    } else {
                        for (genSpaceCurrentNum = 0; genSpaceCurrentNum < identifierLineMaxSpaceBehind; genSpaceCurrentNum++) {
                            spacesBetweenIdentifierAndLang += ONE_SPACE;
                        }
                    }
                    tempString = spaceOnSdlStr + element[0] + spacesBetweenIdentifierAndLang + "= " + element[1];
                    fileString = fileString + tempString + '\r\n';
                }
                else {
                    fileString = fileString + line + '\r\n';
                }
            }
            else {
                fileString = fileString + line + '\r\n';
            }
        });

        /**
         * readline event: `close` handler
         */
        rl.on('close', () => {
            // closing readline and readStream
            rl.close();
            readStream.destroy();

            // fileString will be resolved
            resolve(fileString);
        });
    });
}

export default formatSdl;
