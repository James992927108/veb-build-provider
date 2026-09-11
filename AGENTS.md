# Repository Guidelines

## Project Structure & Module Organization

This repository contains a TypeScript VS Code extension for VEB and EDK2 development. `src/extension.ts` is the activation entry point. Feature code is grouped under `src/veb-build/`, `src/edk2-debug/`, `src/language-support/`, and `src/model-terminal/`; reusable code lives in `src/shared/`. Language definitions, TextMate grammars, and snippets belong in `config/`. Tests are in `test/`, with VS Code API stubs in `test/setup/`. Python, shell, Docker, and packaging helpers live in `tools/`. Treat `out/`, `out-test/`, `dist/`, and `temp/` as generated or scratch content.

## Build, Test, and Development Commands

- `npm ci`: install the exact dependencies recorded in `package-lock.json`.
- `npm run compile`: type-check and compile `src/` into `out/`, then copy runtime scripts.
- `npm run watch`: continuously compile TypeScript during extension development.
- `npm test`: compile the test tree, run all Mocha tests, and run the Python environment-discovery tests.
- `npm run test:syntax`: validate TextMate grammar scope naming.
- `npx vsce package`: create an installable `.vsix` after compilation.

Run `npm run compile` and relevant tests before submitting changes. Use VS Code's Extension Development Host to exercise commands and UI behavior.

## Coding Style & Naming Conventions

TypeScript uses strict mode and ES2020/CommonJS. Follow the surrounding file's indentation (source modules generally use four spaces; tests commonly use two), single quotes, semicolons, and trailing commas in multiline literals. Use `camelCase` for functions and variables, `PascalCase` for classes and interfaces, and descriptive filenames such as `navigationProvider.ts`. Keep handlers in their feature module and shared helpers in `src/shared/`. No formatter or ESLint task is configured, so avoid unrelated formatting churn. Use the level-specific logger helpers (`logDebug`, `logInfo`, `logWarn`, `logError`, or `logSummary`).

## Testing Guidelines

Tests use Mocha with Node's `assert` module and are named `*.test.ts`. Add focused regression tests near the affected feature, and extend `test/setup/mock-vscode.js` when new VS Code APIs must be mocked. No coverage threshold is configured; prioritize behavior, error paths, and cross-platform build logic. Run `npm test`; grammar changes also require `npm run test:syntax`.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit prefixes such as `feat:`, `fix:`, `docs:`, and `chore:`. Keep commits focused and use an imperative, concise subject. Pull requests should explain the user-visible change, identify affected modules, link relevant issues, and list verification commands. Include screenshots or a short recording for TreeView, status-bar, or other UI changes, and note Windows/Linux implications when modifying scripts or build behavior.
