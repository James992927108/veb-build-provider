// src/edk2-debug/analysis/logFilter.ts
// Pure, testable log-filtering helpers for the Enhanced Debug "Log Analysis" mode.
// Decoupled from the VS Code API so the filter semantics can be unit-tested.

/**
 * Active log filter. Empty / undefined fields are ignored (no filtering on
 * that dimension).
 */
export interface LogFilter {
    /** Case-insensitive substring matched against module + function + message. */
    text?: string;
    /** Exact module name match. */
    module?: string;
    /** Exact UEFI phase match (PEI / DXE / BDS / Runtime). */
    phase?: string;
}

/**
 * Minimal shape a log entry must expose to be filterable.
 */
export interface FilterableLogItem {
    module?: string;
    function?: string;
    message?: string;
    phase?: string;
}

/**
 * Apply a {@link LogFilter} to a list of log items.
 *
 * Filters combine with AND semantics; a dimension is skipped when its filter
 * value is empty / undefined. Text search is a case-insensitive substring
 * match over the concatenation of module, function and message.
 *
 * @param items  Log entries to filter.
 * @param filter Active filter (may be empty).
 * @returns      Entries matching every active dimension, in original order.
 */
export function applyLogFilter<T extends FilterableLogItem>(
    items: T[],
    filter: LogFilter
): T[] {
    const text = (filter.text || '').trim().toLowerCase();
    const moduleName = (filter.module || '').trim();
    const phase = (filter.phase || '').trim();

    return items.filter((item) => {
        if (moduleName && item.module !== moduleName) {
            return false;
        }
        if (phase && item.phase !== phase) {
            return false;
        }
        if (text) {
            const haystack = `${item.module || ''} ${item.function || ''} ${item.message || ''}`.toLowerCase();
            if (!haystack.includes(text)) {
                return false;
            }
        }
        return true;
    });
}

/**
 * Whether a filter has any active dimension.
 */
export function isLogFilterActive(filter: LogFilter): boolean {
    return Boolean(filter.text || filter.module || filter.phase);
}

/**
 * Human-readable one-line summary of the active filter, for the TreeView
 * message bar. Returns an empty string when nothing is active.
 */
export function logFilterDescription(filter: LogFilter): string {
    const parts: string[] = [];
    if (filter.text) {
        parts.push(`text:"${filter.text}"`);
    }
    if (filter.module) {
        parts.push(filter.module);
    }
    if (filter.phase) {
        parts.push(filter.phase);
    }
    return parts.join(', ');
}