/**
 * Shared translation flow used by the service worker.
 * The AI callback is invoked only when the plan says a key is required and present.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    root.ZimanTranslatorEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function phoneticFor(text, sourceLang, includePhonetic, transliterate) {
        if (!includePhonetic) return '';
        const kurdishSource = sourceLang === 'ku-sorani' || sourceLang === 'ku-kurmanji';
        const looksKurdish = sourceLang === 'auto' && /[\u0600-\u06FF]/.test(text);
        if (!kurdishSource && !looksKurdish) return '';
        return transliterate ? transliterate(text) : '';
    }

    async function resolveTranslation(input) {
        const phrasebook = input.phrasebook;
        const planApi = input.plan;
        const text = String(input.text || '');
        const phrase = phrasebook.lookup(text, input.sourceLang, input.targetLang);
        const plan = planApi.planTranslation({
            text,
            sourceLang: input.sourceLang,
            targetLang: input.targetLang,
            phrase,
            hasApiKey: Boolean(input.hasApiKey)
        });
        const phonetic = phoneticFor(text.trim(), input.sourceLang, input.includePhonetic, input.transliterate);

        if (plan.action === 'phrasebook') {
            return {
                status: 'ok',
                provider: 'phrasebook',
                translation: plan.translation,
                phonetic
            };
        }
        if (plan.action === 'aiml') {
            try {
                const translation = await input.translateWithAi({
                    text: text.trim(),
                    sourceLang: input.sourceLang,
                    targetLang: input.targetLang,
                    tone: input.tone || 'neutral'
                });
                return {
                    status: 'ok',
                    provider: 'aiml',
                    translation,
                    phonetic
                };
            } catch (error) {
                const words = phrasebook.wordByWord && phrasebook.wordByWord(text.trim(), input.sourceLang, input.targetLang);
                if (words && words.translation) {
                    return {
                        status: 'ok',
                        provider: 'words',
                        translation: words.translation,
                        fallback: true,
                        phonetic
                    };
                }
                const suggestion = phrasebook.suggest && phrasebook.suggest(text.trim(), input.sourceLang, input.targetLang);
                return {
                    status: error.code || 'error',
                    provider: null,
                    translation: '',
                    phonetic: '',
                    message: error.message,
                    billingUrl: error.billingUrl || '',
                    serverMessage: error.serverMessage || '',
                    suggestion: suggestion ? suggestion.text : ''
                };
            }
        }
        if (plan.action === 'needs-key') {
            const words = phrasebook.wordByWord && phrasebook.wordByWord(text.trim(), input.sourceLang, input.targetLang);
            if (words && words.translation) {
                return { status: 'ok', provider: 'words', translation: words.translation, phonetic };
            }
            const suggestion = phrasebook.suggest && phrasebook.suggest(text.trim(), input.sourceLang, input.targetLang);
            if (suggestion) {
                return { status: 'suggest', provider: null, translation: '', suggestion: suggestion.text, phonetic: '' };
            }
        }
        return { status: plan.action, provider: null, translation: '', phonetic: '', limit: plan.limit };
    }

    return { resolveTranslation, phoneticFor };
});
