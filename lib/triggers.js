/**
 * Explicit translation triggers. Nothing here runs because text was merely selected.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    root.ZimanTriggers = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const TARGETS = ['ku-sorani', 'ku-kurmanji', 'en', 'fa', 'ar'];
    const TARGET_LABELS = {
        'ku-sorani': 'Kurdish (Sorani)',
        'ku-kurmanji': 'Kurdish (Kurmanji)',
        en: 'English',
        fa: 'Persian',
        ar: 'Arabic'
    };
    const DEFAULT_TARGET = 'ku-sorani';
    const SHORTCUTS = {
        translate: 'Alt+Shift+Z',
        cycle: 'Alt+Shift+X'
    };

    function normalizeTarget(value, fallback) {
        return TARGETS.includes(value) ? value : (fallback || DEFAULT_TARGET);
    }

    function nextTarget(current) {
        const index = TARGETS.indexOf(normalizeTarget(current));
        return TARGETS[(index + 1) % TARGETS.length];
    }

    function resolveMenuTarget(menuId, lastTarget, defaultTarget) {
        if (menuId === 'ziman-last') return normalizeTarget(lastTarget, defaultTarget);
        const prefix = 'ziman-target-';
        if (typeof menuId === 'string' && menuId.startsWith(prefix)) {
            return normalizeTarget(menuId.slice(prefix.length), defaultTarget);
        }
        return normalizeTarget(defaultTarget);
    }

    return { TARGETS, TARGET_LABELS, DEFAULT_TARGET, SHORTCUTS, normalizeTarget, nextTarget, resolveMenuTarget };
});
