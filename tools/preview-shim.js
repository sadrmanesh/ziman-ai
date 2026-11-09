/**
 * In-memory stand-in so the popup can be opened outside Chrome.
 * Inside the extension, chrome.storage already exists and this file does nothing.
 */
(function () {
    if (typeof globalThis.chrome !== 'undefined' &&
        globalThis.chrome.storage &&
        globalThis.chrome.runtime &&
        globalThis.chrome.runtime.sendMessage) {
        return;
    }

    const memory = { sync: {}, local: {} };

    function pick(store, keys) {
        if (!keys) return Object.assign({}, store);
        if (typeof keys === 'string') return { [keys]: store[keys] };
        if (Array.isArray(keys)) {
            const listed = {};
            keys.forEach((key) => {
                listed[key] = store[key];
            });
            return listed;
        }
        const withDefaults = {};
        Object.keys(keys).forEach((key) => {
            withDefaults[key] = store[key] === undefined ? keys[key] : store[key];
        });
        return withDefaults;
    }

    function area(name) {
        return {
            get(keys) {
                return Promise.resolve(pick(memory[name], keys));
            },
            set(values) {
                Object.assign(memory[name], values || {});
                return Promise.resolve();
            },
            remove(keys) {
                const list = Array.isArray(keys) ? keys : [keys];
                list.forEach((key) => {
                    delete memory[name][key];
                });
                return Promise.resolve();
            }
        };
    }

    async function previewMessage(message) {
        if (!message) return { status: 'error', message: 'Empty request' };
        if (message.action === 'testApiKey') {
            return {
                valid: false,
                message: 'Key checks run inside Chrome. This preview does not contact AIML.'
            };
        }
        if (message.action !== 'translate') {
            return { status: 'error', message: 'Unsupported preview request' };
        }
        try {
            return await ZimanTranslatorEngine.resolveTranslation({
                text: message.text,
                sourceLang: message.sourceLang || memory.sync.sourceLang || 'auto',
                targetLang: message.targetLang || memory.sync.targetLang || 'en',
                tone: message.tone || memory.sync.tone || 'neutral',
                includePhonetic: message.includePhonetic,
                hasApiKey: Boolean(String(memory.local.apiKey || '').trim()),
                phrasebook: ZimanPhrasebook,
                plan: ZimanPlan,
                transliterate: (text) => ZimanPhonetic.transliterate(text),
                translateWithAi() {
                    throw new Error('This preview does not call AIML. Load the extension in Chrome to use a saved key.');
                }
            });
        } catch (error) {
            return { status: 'error', message: error.message || 'Translation failed' };
        }
    }

    globalThis.chrome = {
        storage: {
            sync: area('sync'),
            local: area('local'),
            onChanged: { addListener() {} }
        },
        runtime: {
            sendMessage: previewMessage,
            getURL(path) { return path; },
            openOptionsPage() { window.location.href = 'options.html'; }
        },
        tabs: {
            query() { return Promise.resolve([{ id: 1 }]); },
            sendMessage() { return Promise.resolve({ text: '' }); }
        },
        _zimanPreview: true
    };
})();
