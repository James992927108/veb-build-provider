import * as fs from 'fs';
import * as path from 'path';
import { Edk2InfMeta, StructInfo } from '../types';
import { logMessage } from '../../utils/logger';
import { ENHANCED_DEBUG_CONSTANTS } from '../constants';

export class ModuleEnhancer {
  /**
   * Entry: Enhance INF and C files, insert debug macros
   */
  static async enhance(
    infMeta: Edk2InfMeta,
    maxDepth: number = 3
  ): Promise<boolean> {
    // 1. Backup and update INF
    const infBak = `${infMeta.filePath}.bak`;
    if (!fs.existsSync(infBak)) { fs.copyFileSync(infMeta.filePath, infBak); }
    let infContent = fs.readFileSync(infMeta.filePath, 'utf-8');
    if (!infContent.includes(ENHANCED_DEBUG_CONSTANTS.LIBRARY_NAME)) {
      infContent = infContent.replace(
        /\[LibraryClasses\][\r\n]+/,
        m => `${m}${ENHANCED_DEBUG_CONSTANTS.LIBRARY_NAME}\n`
      );
    }
    if (!infContent.includes(ENHANCED_DEBUG_CONSTANTS.AMI_MODULE_PKG)) {
      infContent = infContent.replace(
        /\[Packages\][\r\n]+/,
        m => `${m}${ENHANCED_DEBUG_CONSTANTS.AMI_MODULE_PKG}\n`
      );
    }
    fs.writeFileSync(infMeta.filePath, infContent, 'utf-8');

    // 2. Process all C files
    for (const srcFile of infMeta.sourceFiles) {
      // Backup
      const cBak = `${srcFile}.bak`;
      if (!fs.existsSync(cBak)) { fs.copyFileSync(srcFile, cBak); }

      let code = fs.readFileSync(srcFile, 'utf-8');
      // Insert include
      const inc = ENHANCED_DEBUG_CONSTANTS.HEADER_FILE;
      if (!code.includes(inc)) {
        code = code.replace(
          /^(#include.*\n)+/m,
          m => `${m}${inc}\n`
        );
      }

      // 2.5 Precisely identify single-line if-return that needs braces
      const issuesBeforeFix = this.verifyIfBracketsEnhancedFromCode(code, srcFile);

      if (issuesBeforeFix.length > 0) {
        // Precisely fix these lines
        logMessage(`Adding braces to single-line if-return in ${path.basename(srcFile)}`);
        code = this.addBracketsToSingleLineIf(code);

        // Generate temp file (only if fixes are made)
        const tempBak = srcFile.replace(/\.c$/, '.if-return.bak');
        fs.writeFileSync(tempBak, code, 'utf-8');
        logMessage(`Generated if-return fixed file: ${path.basename(tempBak)}`);
      } else {
        // No issues, do not generate temp file
        logMessage(`No single-line if-return statements found in ${path.basename(srcFile)}`);
      }

      // 3. Insert macros
      logMessage(`entryPoint: ${infMeta.entryPoint}, maxDepth: ${maxDepth}`);
      code = this.insertDebugMacros(code, infMeta.entryPoint, maxDepth);

      // 4. Verify if structure (validate code variable before writing)
      const issues = this.verifyIfBracketsEnhancedFromCode(code, srcFile);
      if (issues.length > 0) {
        logMessage(`File ${srcFile} has ${issues.length} problematic if-return:`);
        for (const { line, code: lineCode } of issues) {
          logMessage(`  Line ${line}: ${lineCode.trim()}`);
        }
      }

      // 5. Write file
      fs.writeFileSync(srcFile, code, 'utf-8');
      logMessage(`Enhanced ${path.basename(srcFile)}`);
    }

    return true;
  }

  /** Restore from backup */
  static async restore(infMeta: Edk2InfMeta): Promise<{ success: boolean; errors?: string[] }> {
    const errors: string[] = [];
    const infBak = `${infMeta.filePath}.bak`;
    try {
      if (fs.existsSync(infBak)) {
        fs.copyFileSync(infBak, infMeta.filePath);
        fs.unlinkSync(infBak);
      }
    } catch (e) {
      errors.push(`Failed to restore or remove backup for INF: ${infBak} (${e instanceof Error ? e.message : e})`);
    }

    for (const srcFile of infMeta.sourceFiles) {
      const cBak = `${srcFile}.bak`;
      try {
        if (fs.existsSync(cBak)) {
          fs.copyFileSync(cBak, srcFile);
          fs.unlinkSync(cBak);
        }
      } catch (e) {
        errors.push(`Failed to restore or remove backup for source: ${cBak} (${e instanceof Error ? e.message : e})`);
      }
    }

    return { success: errors.length === 0, errors: errors.length ? errors : undefined };
  }

  /**
   * Parse all struct initializations and extract function pointer members
   */
  private static parseStructInitializations(code: string): Map<string, StructInfo> {
    const structMap = new Map<string, StructInfo>();

    // Regex to match struct initialization
    // Format: TYPE_NAME structName = { member1, member2, ... };
    const structRegex = /([A-Za-z_][A-Za-z0-9_]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{([^}]*)\}/g;
    let match: RegExpExecArray | null;

    while ((match = structRegex.exec(code)) !== null) {
      const typeName = match[1];
      const structName = match[2];
      const memberList = match[3];

      // Parse function names from member list
      const members = this.parseStructMembers(memberList);

      structMap.set(structName, {
        name: structName,
        members: members,
        start: match.index,
        end: structRegex.lastIndex
      });

      logMessage(`Found struct initialization: ${structName} with members: ${members.join(', ')}`);
    }

    return structMap;
  }

  /**
   * Parse struct member list and extract function names
   */
  private static parseStructMembers(memberList: string): string[] {
    const members: string[] = [];

    // Remove comments and line breaks
    const cleanedList = memberList.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

    // Split members and trim whitespace
    const memberItems = cleanedList.split(',').map(item => item.trim()).filter(item => item);

    for (const item of memberItems) {
      // Extract function name (ignore numeric and string constants)
      const functionMatch = item.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*$/);
      if (functionMatch && !this.isReservedKeyword(functionMatch[1])) {
        members.push(functionMatch[1]);
      }
    }

    return members;
  }

  /**
   * Check if the name is a reserved keyword or constant
   */
  private static isReservedKeyword(name: string): boolean {
    const reserved = new Set([
      'NULL', 'TRUE', 'FALSE', 'VOID', 'EFI_SUCCESS', 'EFI_ERROR',
      // Add other EDK2 constants...
    ]);

    // Check if it's a numeric constant
    if (/^\d+$/.test(name) || /^0x[0-9A-Fa-f]+$/.test(name)) {
      return true;
    }

    return reserved.has(name);
  }

  /**
   * Enhanced insertDebugMacros, includes struct parsing
   */
  private static insertDebugMacros(
    code: string,
    entryPoint: string,
    maxDepth: number
  ): string {
    // 1. Parse all function ranges
    const funcMap = this.parseAllFunctions(code);

    // 2. Parse all struct initializations
    const structMap = this.parseStructInitializations(code);

    // 3. Build struct-to-function mapping
    const structFunctionMap = this.buildStructFunctionMapping(structMap, funcMap);

    // 4. Start recursion from entryPoint
    const visited = new Set<string>();
    return this.insertRecursiveEnhanced(code, funcMap, structFunctionMap, entryPoint, maxDepth, visited);
  }

  /**
   * Build mapping from struct to function pointers
   */
  private static buildStructFunctionMapping(
    structMap: Map<string, StructInfo>,
    funcMap: Map<string, { start: number; end: number }>
  ): Map<string, string[]> {
    const mapping = new Map<string, string[]>();

    for (const [structName, structInfo] of structMap) {
      const validFunctions = structInfo.members.filter(member => funcMap.has(member));
      if (validFunctions.length > 0) {
        mapping.set(structName, validFunctions);
        logMessage(`Struct ${structName} contains function pointers: ${validFunctions.join(', ')}`);
      }
    }

    return mapping;
  }

  /** Use regex to find all function definitions and record start/end indices */
  private static parseAllFunctions(
    code: string
  ): Map<string, { start: number; end: number }> {
    const map = new Map<string, { start: number; end: number }>();
    const foundFunctions: string[] = [];
    const regex = /([A-Za-z_][A-Za-z0-9_\s\*]+)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*\{/g;
    let match: RegExpExecArray | null;
    const reservedWords = new Set([
      'if', 'for', 'while', 'switch', 'case', 'default', 'break', 'continue', 'return', 'goto', 'else', 'do', 'typedef', 'struct', 'union', 'enum', 'static', 'const', 'volatile', 'extern', 'register', 'unsigned', 'signed', 'void', 'char', 'short', 'int', 'long', 'float', 'double', 'sizeof', 'auto', 'inline', 'restrict'
    ]);

    while ((match = regex.exec(code)) !== null) {
      const name = match[2];
      if (reservedWords.has(name)) { continue; } // Skip reserved words
      foundFunctions.push(name);
      let brace = 1;
      let idx = regex.lastIndex;
      while (brace > 0 && idx < code.length) {
        if (code[idx] === '{') { brace++; }
        else if (code[idx] === '}') { brace--; }
        idx++;
      }
      if (brace === 0) { map.set(name, { start: match.index, end: idx }); }
    }
    // Print found function names
    logMessage(`Found functions: ${foundFunctions.join(', ')}`);
    return map;
  }

  /**
   * Enhanced recursive insertion, supports struct member function tracking
   */
  private static insertRecursiveEnhanced(
    code: string,
    funcMap: Map<string, { start: number; end: number }>,
    structFunctionMap: Map<string, string[]>,
    fn: string,
    depth: number,
    visited: Set<string>,
    currentDepth: number = 0
  ): string {
    if (depth <= 0 || visited.has(fn) || !funcMap.has(fn)) {
      return code;
    }

    visited.add(fn);
    const { start, end } = funcMap.get(fn)!;
    let body = code.slice(start, end);

    // 1. Insert DEBUG_ENTRY
    const entry = ENHANCED_DEBUG_CONSTANTS.DEBUG_ENTRY_PATTERN.replace('{functionName}', fn);
    body = body.replace('{', `{\n ${entry} // depth ${currentDepth} \n`);

    // 2. Process return statements
    body = this.processReturnStatements(body, fn, currentDepth);

    // 3. Process function end
    body = this.processEndOfFunction(body, fn, currentDepth);

    // 4. Update code
    code = code.slice(0, start) + body + code.slice(end);

    // 5. Collect next-level functions to call (including direct calls and struct members)
    const nextLevelFunctions = this.collectNextLevelFunctions(body, funcMap, structFunctionMap);

    if (nextLevelFunctions.length > 0) {
      logMessage(`[Depth ${currentDepth}] ${fn} will call: ${nextLevelFunctions.join(', ')}`);
    }

    // 6. Recursively process next level
    for (const callee of nextLevelFunctions) {
      code = this.insertRecursiveEnhanced(
        code, funcMap, structFunctionMap, callee, depth - 1, visited, currentDepth + 1
      );
    }

    return code;
  }

  /**
   * Add braces to all single-line if-return using bracket counting
   * Example: if(a&&(b||c)) return x; → if(a&&(b||c)) { return x; }
   */
  private static addBracketsToSingleLineIf(code: string): string {
    const lines = code.split('\n');
    const fixed: string[] = [];

    for (const rawLine of lines) {
      let line = rawLine;
      const trimmed = line.trimStart();
      if (!trimmed.startsWith('if')) {
        fixed.push(rawLine);
        continue;
      }

      // Find the end of the condition using bracket counting
      const startIdx = rawLine.indexOf('if');
      const condStart = rawLine.indexOf('(', startIdx);
      if (condStart < 0) { fixed.push(rawLine); continue; }

      let depth = 0;
      let condEnd = -1;
      for (let i = condStart; i < rawLine.length; i++) {
        if (rawLine[i] === '(') {depth++;}
        else if (rawLine[i] === ')') {depth--;}
        if (depth === 0) {
          condEnd = i;
          break;
        }
      }
      if (condEnd < 0) { fixed.push(rawLine); continue; }

      // String after the condition
      const rest = rawLine.slice(condEnd + 1).trim();
      // Only process single-line return without original braces
      if (!rest.startsWith('{') && rest.match(/^return\s+[^;]+;$/)) {
        const indent = rawLine.slice(0, rawLine.indexOf('if'));
        const condition = rawLine.slice(startIdx, condEnd + 1);
        const returnStmt = rest;
        fixed.push(`${indent}${condition} { ${returnStmt} }`);
      } else {
        fixed.push(rawLine);
      }
    }

    return fixed.join('\n');
  }

  /**
    * Directly verify if structure in code string, no file reading needed
    * This method is the core logic for identifying all single-line if-return that need fixing
    */
  private static verifyIfBracketsEnhancedFromCode(
    enhancedCode: string,
    srcFile: string
  ): { line: number; code: string }[] {
    const bakFile = `${srcFile}.bak`;
    if (!fs.existsSync(bakFile)) {
      console.warn(`Backup file not found: ${bakFile}`);
      return [];
    }

    const origLines = fs.readFileSync(bakFile, 'utf-8').split('\n');
    const enhancedLines = enhancedCode.split('\n');
    const problems: { line: number; code: string }[] = [];

    for (let i = 0; i < origLines.length; i++) {
      const orig = origLines[i].trim();

      // Precisely match single-line if-return format
      const match = orig.match(/^if\s*\(([^)]+)\)\s*return\s+[^;]+;/);
      if (!match) { continue; }

      const condition = match[1].trim();

      // In the enhanced file, check if nearby lines contain if with braces
      let found = false;
      for (let j = Math.max(0, i - 2); j <= Math.min(enhancedLines.length - 1, i + 2); j++) {
        const line = enhancedLines[j];
        if (/if\s*\(\s*.*\)\s*\{/.test(line) && line.includes(condition)) {
          found = true;
          break;
        }
      }

      if (!found) {
        problems.push({ line: i + 1, code: origLines[i] });
      }
    }

    return problems;
  }

  /**
   * Collect next-level functions to call (including direct calls and struct members)
   */
  private static collectNextLevelFunctions(
    body: string,
    funcMap: Map<string, { start: number; end: number }>,
    structFunctionMap: Map<string, string[]>
  ): string[] {
    const functions = new Set<string>();

    // 1. Collect direct function calls
    for (const funcName of funcMap.keys()) {
      if (new RegExp(`\\b${funcName}\\s*\\(`).test(body)) {
        functions.add(funcName);
      }
    }

    // 2. Collect struct member functions
    for (const [structName, memberFunctions] of structFunctionMap) {
      // Check if the struct is used
      const structUsageRegex = new RegExp(`\\b${structName}\\b`);
      if (structUsageRegex.test(body)) {
        // Struct is used, add all member functions to tracking
        memberFunctions.forEach(func => functions.add(func));
        logMessage(`Found struct usage: ${structName}, adding member functions: ${memberFunctions.join(', ')}`);
      }
    }

    return Array.from(functions);
  }
  /**
   * Process return statements
   */
  private static processReturnStatements(body: string, fn: string, currentDepth: number): string {
    // Only match if blocks with braces and insert DEBUG_EXIT
    const blockIfReturnRegex = /if\s*\(\s*([^)]+)\s*\)\s*\{([\s\S]*?)return\s+([^;]+);([\s\S]*?)\}/g;
    return body.replace(blockIfReturnRegex, (_m, cond, before, ret, after) => {
      const exit = ENHANCED_DEBUG_CONSTANTS.DEBUG_EXIT_PATTERN
        .replace('{functionName}', fn)
        .replace('{returnValue}', ret.trim()) + ` // depth ${currentDepth}`;
      return [
        `if(${cond.trim()}) {`,
        before,
        `    ${exit}`,
        `    return ${ret.trim()};`,
        after,
        `}`
      ].join('\n');
    });
  }

  /**
   * Process function end
   */
  private static processEndOfFunction(body: string, fn: string, currentDepth: number): string {
    if (!/return\s+[^;]+;/.test(body)) {
      const exitNoRet = ENHANCED_DEBUG_CONSTANTS.DEBUG_EXIT_PATTERN
        .replace('{functionName}', fn)
        .replace('{returnValue}', 'EFI_SUCCESS') + ` // depth ${currentDepth}`;
      body = body.replace(/\}\s*$/, ` ${exitNoRet}\n}`);
    }
    return body;
  }

}
