import * as fs from 'fs';
import * as readline from "readline";
import * as vscode from 'vscode';
import { ONE_SPACE, HASH_STRING, HASH_LANGUAGE } from "../utils/constants";

function formatUni(filepath: string, fileEncoding: any, maxStringLength: number): Promise<any> {
    return new Promise(resolve => {
        /**
         * Create local variables
         */
        let genSpaceCurrentNum: number = 0;
        const config = vscode.workspace.getConfiguration('vebBuild.formatter');
        const speceOnUniNum = config['speceOnUni'];
        let speceOnUniStr: string = '';
        let langLineMaxSpaceAhead: string = '';
        let identifierLineMaxSpaceBehind: number;
        let fileString: string = '';
        let identifierName: string;
        let identifierNameLength: number;
        let identifierValue: string;

        /**
         * Generate user-defined number of spaces
         */
        for (genSpaceCurrentNum = 0; genSpaceCurrentNum < speceOnUniNum; genSpaceCurrentNum++) {
            speceOnUniStr += ONE_SPACE;
        }

        const langLineMaxSpaceAheadNum: number = maxStringLength + (HASH_STRING.length) + speceOnUniNum;
        /**
         * Generate alignment point for lines with only #language
         */
        for (genSpaceCurrentNum = 0; genSpaceCurrentNum < langLineMaxSpaceAheadNum; genSpaceCurrentNum++) {
            langLineMaxSpaceAhead += ONE_SPACE;
        }

        /**
         * Create read stream & readline interface
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

            const patternString = new RegExp(/^#string/); // Line starts with #string
            const patternLanguage = new RegExp((/^#language/)); // Line starts with #language
            const patternComment = new RegExp(/^\/\//); // Line starts with //
            let spacesBetweenIdentifierAndLang: string = '';
            if (line.match(patternString)) // Handle lines starting with #string
            {
                identifierName = line.split("#string")[1].trim().split(/\s+/)[0];
                identifierNameLength = identifierName.length; // Calculate the length of the string after #string (e.g., #string ACPI_STR, calculates length of ACPI_STR, which is 8)
                identifierLineMaxSpaceBehind = maxStringLength - identifierNameLength; // Calculate spaces needed between identifierName and #language
                for (genSpaceCurrentNum = 0; genSpaceCurrentNum < identifierLineMaxSpaceBehind; genSpaceCurrentNum++) {
                    spacesBetweenIdentifierAndLang += ONE_SPACE;
                } // This loop pads spaces after identifierName to match the longest identifierName in the file

                spacesBetweenIdentifierAndLang = spacesBetweenIdentifierAndLang + speceOnUniStr; // Add user-defined spaces between identifierName and #language
                identifierValue = line.trim().split(HASH_LANGUAGE)[1]; // !!!Notice!!! this string has ONE space ahead
                fileString = fileString + HASH_STRING + identifierName + spacesBetweenIdentifierAndLang + HASH_LANGUAGE + identifierValue + '\r\n';
            }
            else if (line.trim().match(patternLanguage)) // Handle lines with leading spaces followed by #language
            {
                fileString = fileString + langLineMaxSpaceAhead + line.trim() + '\r\n';
            }
            else if (line.trim() === '') // Replace lines with only Tab or / and space with a newline
            {
                fileString += '\r\n';
            }
            else {
                fileString = fileString + line + '\r\n';
            }
        });

        /**
         * readline event: `close` handler
         */
        rl.on('close', () => {
            // Closing readline and readStream
            rl.close();
            readStream.destroy();

            // fileString will be resolved
            resolve(fileString);
        });
    });
}

export default formatUni;
