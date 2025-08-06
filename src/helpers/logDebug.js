export function logDebug(debug, type, ...args) {
    if (!debug) return;

    const prefix = '[react-data-grid-lite]';
    const method = console[type] || console.log;

    method(prefix, ...args);
}