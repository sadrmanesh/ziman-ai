/**
 * Decides how a translation request is handled before any network call.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    root.ZimanPlan = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const MAX_CHARS = 4000;

    function planTranslation({ text, sourceLang, targetLang, phrase, hasApiKey }) {
        const value = String(text || '').trim();
        if (!value) return { action: 'empty' };
        if (value.length > MAX_CHARS) return { action: 'too-long', limit: MAX_CHARS };
        if (sourceLang && sourceLang !== 'auto' && sourceLang === targetLang) {
            return { action: 'same-language' };
        }
        if (phrase) return { action: 'phrasebook', translation: phrase };
        if (!hasApiKey) return { action: 'needs-key' };
        return { action: 'aiml' };
    }

    function safeErrorMessage(error, secret) {
        let message = (error && error.message) || 'Translation failed';
        if (secret && message.includes(secret)) {
            message = message.split(secret).join('…');
        }
        return message.slice(0, 300);
    }

    const BILLING_URL = 'https://aimlapi.com/app/billing/';

    function classifyAimlFailure(status, body, errorName) {
        const data = body && typeof body === 'object' ? body : {};
        const err = data.error && typeof data.error === 'object' ? data.error : {};
        const kind = err.data && err.data.kind ? String(err.data.kind) : '';
        const message = String(err.message || data.message || '');
        if (errorName === 'AbortError') return { code: 'timeout' };
        if (status == null) return { code: 'network' };
        if (status === 401) return { code: 'invalid-key' };
        if (status === 429) return { code: 'rate-limit' };
        if (kind === 'err_insufficent_credits' || /run out of funds/i.test(message)) {
            return { code: 'no-credits', billingUrl: BILLING_URL };
        }
        if (status === 403) {
            return { code: 'model-forbidden', serverMessage: safeErrorMessage({ message }) };
        }
        return { code: 'http', serverMessage: safeErrorMessage({ message }) };
    }

    return { MAX_CHARS, planTranslation, safeErrorMessage, classifyAimlFailure, BILLING_URL };
});
