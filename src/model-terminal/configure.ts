/** Conservative edits for the existing Linux/bash model launchers. No endpoint or credential changes. */
export const titleHelper = String.raw`set_title() {
  local label="$1"
  printf '\033]0;%s: %s\007' "$label" "$(basename "$PWD")"
  export CLAUDE_CODE_DISABLE_TERMINAL_TITLE=1
}`;

export const codexHelper = String.raw`codex() {
  printf '\033]0;codex: %s\007' "$(basename "$PWD")"
  command codex "$@"
}`;

function functionPattern(name: string): RegExp {
    return new RegExp(`^(?:function\\s+)?${name}\\s*\\(\\s*\\)\\s*\\{[^\\n]*\\n[\\s\\S]*?^\\}`, 'gm');
}

function getFunction(text: string, name: string): string | undefined {
    const matches = text.match(functionPattern(name));
    if (matches && matches.length !== 1) { throw new Error(`Multiple ${name} functions found; consolidate them before setup.`); }
    return matches?.[0];
}

export function configureLauncher(source: string): string {
    const eol = source.includes('\r\n') ? '\r\n' : '\n';
    let text = source.replace(/\r\n/g, '\n');
    if (!/^#!.*\bbash\b/m.test(text)) { throw new Error('claude-cli must be a bash script.'); }
    const helper = getFunction(text, 'set_title');
    if (helper) {
        if (helper.replace(/\s+/g, ' ') !== titleHelper.replace(/\s+/g, ' ')) {
            throw new Error('An unrelated set_title function already exists; automatic setup stopped.');
        }
        text = text.replace(helper, () => titleHelper);
    } else {
        const position = text.search(/^launch_pro\s*\(\s*\)\s*\{/m);
        if (position < 0) { throw new Error('Missing launch_pro function in claude-cli.'); }
        text = text.slice(0, position) + titleHelper + '\n\n' + text.slice(position);
    }
    if (!getFunction(text, 'launch_cloud')) {
        const position = text.indexOf('set_title()');
        text = text.slice(0, position) + 'launch_cloud() {\n  exec claude "$@"\n}\n\n' + text.slice(position);
    }
    for (const [name, label] of [['launch_pro', 'v4-pro'], ['launch_flash', 'v4-flash'], ['launch_cloud', 'claude']]) {
        const body = getFunction(text, name);
        if (!body || (body.match(/^\s*exec claude\b/gm) ?? []).length !== 1) {
            throw new Error(`Expected one exec claude in ${name}; launcher layout is unsupported.`);
        }
        const updated = body.replace(/^\s*set_title\s+[^\n]*\n/gm, '')
            .replace(/^(\s*)exec claude\b/m, (_match, indent: string) => `${indent}set_title "${label}"\n${indent}exec claude`);
        text = text.replace(body, () => updated);
    }
    // Legacy menu/dispatch sometimes bypassed launch_cloud. Preserve argument forwarding.
    text = text.replace(/^(\s*(?:c\|C|["']?cloud["']?)\)\s*(?:shift;\s*)?)exec claude([^\n]*;;)/gm,
        (_match, prefix: string, suffix: string) => `${prefix}launch_cloud${suffix}`);
    if (!/^\s*c\|C\)\s*launch_cloud\b/m.test(text)) {
        throw new Error('Expected menu c|C to call launch_cloud; launcher layout is unsupported.');
    }
    return text.replace(/\n/g, eol);
}

export function configureBashrc(source: string): string {
    const eol = source.includes('\r\n') ? '\r\n' : '\n';
    let text = source.replace(/\r\n/g, '\n');
    const existing = getFunction(text, 'codex');
    if (existing && existing.replace(/\s+/g, ' ') !== codexHelper.replace(/\s+/g, ' ')) {
        throw new Error('A custom codex function exists; preserve it and integrate the title helper manually.');
    }
    // An alias expands while bash parses function declarations. Remove only codex aliases.
    if (/^\s*alias codex=.*;/m.test(text)) { throw new Error('A compound codex alias line needs manual integration.'); }
    text = text.replace(/^[\t ]*alias codex=[^\n]*\n?/gm, '');
    if (existing) {
        text = text.replace(existing, () => codexHelper);
    } else {
        text = text.trimEnd() + '\n\n# VEB Build Provider: model terminal titles\n' + codexHelper + '\n';
    }
    return text.replace(/\n/g, eol);
}

export const tabSettings: Readonly<Record<string, string | boolean>> = {
    'tabs.enabled': true,
    'tabs.location': 'left',
    'tabs.hideCondition': 'never',
    'tabs.title': '${sequence}',
    'tabs.description': '${process}',
};

export function shellQuote(value: string): string { return "'" + value.replace(/'/g, "'\"'\"'") + "'"; }
