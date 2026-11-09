/**
 * API keys belong in local storage. Older builds saved them in sync storage.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    root.ZimanStorage = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function cleanKey(value) {
        return typeof value === 'string' ? value.trim() : '';
    }

    function planApiKeyMigration(syncData, localData) {
        const syncKey = cleanKey(syncData && syncData.apiKey);
        const localKey = cleanKey(localData && localData.apiKey);
        if (!syncKey) {
            return { removeSyncKey: false, localKey: null };
        }
        if (localKey) {
            return { removeSyncKey: true, localKey: null };
        }
        return { removeSyncKey: true, localKey: syncKey };
    }

    function trimHistory(entries, limit) {
        const max = limit || 12;
        return (Array.isArray(entries) ? entries : [])
            .filter((item) => item && item.text && item.translation)
            .slice(0, max);
    }

    function addHistory(entries, item, limit) {
        const next = {
            text: String(item.text || '').slice(0, 280),
            translation: String(item.translation || '').slice(0, 280),
            sourceLang: item.sourceLang || 'auto',
            targetLang: item.targetLang || 'en',
            provider: item.provider || 'phrasebook',
            at: item.at || Date.now()
        };
        const filtered = trimHistory(entries).filter((entry) => {
            return !(entry.text === next.text && entry.sourceLang === next.sourceLang && entry.targetLang === next.targetLang);
        });
        return [next, ...filtered].slice(0, limit || 12);
    }

    function addFavorite(entries, item) {
        return addHistory(entries, item, 12);
    }

    function removeFavorite(entries, item) {
        return trimHistory(entries).filter((entry) => {
            return !(entry.text === item.text && entry.sourceLang === item.sourceLang && entry.targetLang === item.targetLang);
        });
    }

    return { planApiKeyMigration, trimHistory, addHistory, addFavorite, removeFavorite, cleanKey };
});
