importScripts(
    'error-handler.js',
    'lib/phrasebook.js',
    'lib/phonetic.js',
    'lib/storage.js',
    'lib/translate-plan.js',
    'lib/translator.js',
    'lib/triggers.js',
    'aiml-api.js'
);

chrome.runtime.onInstalled.addListener(() => {
    setupMenus();
    migrateStoredApiKey().catch((error) => {
        console.error('Storage migration failed', error);
    });
});

chrome.runtime.onStartup.addListener(() => {
    migrateStoredApiKey().catch((error) => {
        console.error('Storage migration failed', error);
    });
});

function setupMenus() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'ziman-translate',
            title: 'Translate with Ziman',
            contexts: ['selection']
        });
        ZimanTriggers.TARGETS.forEach((code) => {
            chrome.contextMenus.create({
                id: `ziman-target-${code}`,
                parentId: 'ziman-translate',
                title: ZimanTriggers.TARGET_LABELS[code],
                contexts: ['selection']
            });
        });
        chrome.contextMenus.create({
            id: 'ziman-last',
            parentId: 'ziman-translate',
            title: 'Last used',
            contexts: ['selection']
        });
        refreshLastUsedTitle().catch(() => {});
    });
}

async function readTriggerSettings() {
    const stored = await chrome.storage.sync.get({
        defaultTarget: ZimanTriggers.DEFAULT_TARGET,
        lastTarget: '',
        resultMode: 'card'
    });
    return {
        defaultTarget: ZimanTriggers.normalizeTarget(stored.defaultTarget),
        lastTarget: stored.lastTarget ? ZimanTriggers.normalizeTarget(stored.lastTarget) : '',
        resultMode: stored.resultMode === 'popup' ? 'popup' : 'card'
    };
}

async function rememberTarget(target) {
    const next = ZimanTriggers.normalizeTarget(target);
    await chrome.storage.sync.set({ lastTarget: next });
    try {
        chrome.contextMenus.update('ziman-last', {
            title: `Last used: ${ZimanTriggers.TARGET_LABELS[next]}`
        });
    } catch (error) {
        console.error('Could not update the menu', error);
    }
    return next;
}

async function refreshLastUsedTitle() {
    const settings = await readTriggerSettings();
    const target = settings.lastTarget || settings.defaultTarget;
    chrome.contextMenus.update('ziman-last', {
        title: `Last used: ${ZimanTriggers.TARGET_LABELS[target]}`
    });
}

async function migrateStoredApiKey() {
    const [syncData, localData] = await Promise.all([
        chrome.storage.sync.get(['apiKey']),
        chrome.storage.local.get(['apiKey'])
    ]);
    const plan = ZimanStorage.planApiKeyMigration(syncData, localData);
    if (plan.localKey) {
        await chrome.storage.local.set({ apiKey: plan.localKey });
    }
    if (plan.removeSyncKey) {
        await chrome.storage.sync.remove('apiKey');
    }
    return { migrated: Boolean(plan.localKey), removedSyncCopy: plan.removeSyncKey };
}

async function readTranslationSettings() {
    const [syncData, localData] = await Promise.all([
        chrome.storage.sync.get(['sourceLang', 'targetLang', 'tone', 'includePhonetic', 'uiLang']),
        chrome.storage.local.get(['apiKey', 'model'])
    ]);
    return {
        sourceLang: syncData.sourceLang || 'auto',
        targetLang: syncData.targetLang || 'en',
        tone: syncData.tone || 'neutral',
        includePhonetic: Boolean(syncData.includePhonetic),
        apiKey: ZimanStorage.cleanKey(localData.apiKey),
        model: localData.model || 'gpt-4o-mini',
        uiLang: syncData.uiLang || 'en'
    };
}

async function translateWithAiml(request, settings) {
    const api = new AIMLAPI();
    api.apiKey = settings.apiKey;
    api.uiLang = settings.uiLang || 'en';
    api.preferredModel = settings.model || 'gpt-4o-mini';
    try {
        return await api.translateText(
            request.text,
            request.sourceLang,
            request.targetLang,
            request.tone || settings.tone
        );
    } catch (error) {
        const wrapped = new Error(ZimanPlan.safeErrorMessage(error, settings.apiKey));
        wrapped.code = error.code || 'error';
        wrapped.billingUrl = error.billingUrl || '';
        wrapped.serverMessage = error.serverMessage
            ? ZimanPlan.safeErrorMessage({ message: error.serverMessage }, settings.apiKey)
            : '';
        throw wrapped;
    }
}

async function handleTranslate(request) {
    const settings = await readTranslationSettings();
    const sourceLang = request.sourceLang || settings.sourceLang;
    const targetLang = request.targetLang || settings.targetLang;
    const tone = request.tone || settings.tone;
    const includePhonetic = typeof request.includePhonetic === 'boolean'
        ? request.includePhonetic
        : settings.includePhonetic;
    try {
        return await ZimanTranslatorEngine.resolveTranslation({
            text: request.text,
            sourceLang,
            targetLang,
            tone,
            includePhonetic,
            hasApiKey: Boolean(settings.apiKey),
            phrasebook: ZimanPhrasebook,
            plan: ZimanPlan,
            transliterate: (text) => ZimanPhonetic.transliterate(text),
            translateWithAi: (payload) => translateWithAiml(payload, settings)
        });
    } catch (error) {
        return {
            status: 'error',
            provider: null,
            translation: '',
            message: ZimanPlan.safeErrorMessage(error, settings.apiKey)
        };
    }
}

async function handleTestApiKey() {
    const { apiKey } = await chrome.storage.local.get(['apiKey']);
    const key = ZimanStorage.cleanKey(apiKey);
    const { uiLang } = await chrome.storage.sync.get({ uiLang: 'en' });
    const api = new AIMLAPI();
    api.apiKey = key;
    api.uiLang = uiLang || 'en';
    const result = await api.testAPIKey();
    return {
        valid: Boolean(result.valid),
        balanceEmpty: Boolean(result.balanceEmpty),
        code: result.code || '',
        billingUrl: result.billingUrl || '',
        message: ZimanPlan.safeErrorMessage({ message: result.serverMessage || result.message || '' }, key)
    };
}

async function injectHelper(tabId) {
    await chrome.scripting.insertCSS({
        target: { tabId },
        files: ['content.css']
    });
    await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
    });
}

async function askTab(tabId, message) {
    await injectHelper(tabId);
    return chrome.tabs.sendMessage(tabId, message);
}

async function deliverSelection(tabId, text, targetLang) {
    const target = await rememberTarget(targetLang);
    const settings = await readTriggerSettings();
    if (settings.resultMode === 'popup') {
        await chrome.storage.session.set({ pendingText: text, pendingTarget: target });
        try {
            await chrome.action.openPopup();
        } catch (error) {
            console.error('Could not open the popup', error);
        }
        return;
    }
    const result = await handleTranslate({
        text,
        sourceLang: 'auto',
        targetLang: target
    });
    await askTab(tabId, {
        action: 'showCard',
        original: text,
        targetLang: target,
        translation: result.translation || '',
        status: result.status,
        message: result.message || '',
        billingUrl: result.billingUrl || ''
    });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab || !tab.id || !info.selectionText) return;
    const settings = await readTriggerSettings();
    const target = ZimanTriggers.resolveMenuTarget(info.menuItemId, settings.lastTarget, settings.defaultTarget);
    try {
        await deliverSelection(tab.id, info.selectionText, target);
    } catch (error) {
        console.error('Could not translate the selection', error);
    }
});

chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'cycle-target') {
        const settings = await readTriggerSettings();
        const next = ZimanTriggers.nextTarget(settings.lastTarget || settings.defaultTarget);
        await rememberTarget(next);
        try {
            await chrome.action.setBadgeText({ text: next.slice(0, 2).toUpperCase() });
            setTimeout(() => chrome.action.setBadgeText({ text: '' }), 1500);
        } catch (error) {
            console.error('Could not show the language badge', error);
        }
        return;
    }
    if (command !== 'translate-selection') return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
        try { await chrome.action.openPopup(); } catch (error) { console.error(error); }
        return;
    }
    let selected = '';
    try {
        await injectHelper(tab.id);
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getSelection' });
        selected = response && response.text ? response.text.trim() : '';
    } catch (error) {
        selected = '';
    }
    if (!selected) {
        try { await chrome.action.openPopup(); } catch (error) { console.error(error); }
        return;
    }
    const settings = await readTriggerSettings();
    try {
        await deliverSelection(tab.id, selected, settings.lastTarget || settings.defaultTarget);
    } catch (error) {
        console.error('Could not translate the selection', error);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request || !request.action) return false;

    if (request.action === 'translate') {
        handleTranslate(request).then(sendResponse);
        return true;
    }
    if (request.action === 'testApiKey') {
        handleTestApiKey().then(sendResponse);
        return true;
    }
    if (request.action === 'migrateStorage') {
        migrateStoredApiKey().then(sendResponse);
        return true;
    }
    if (request.action === 'readSelection' && request.tabId) {
        askTab(request.tabId, { action: 'getSelection' })
            .then((result) => sendResponse(result || { text: '' }))
            .catch((error) => sendResponse({ error: error.message || 'unavailable' }));
        return true;
    }
    if (request.action === 'retranslate' && sender.tab && sender.tab.id) {
        deliverSelection(sender.tab.id, request.text || '', request.targetLang)
            .then(() => sendResponse({ ok: true }))
            .catch((error) => sendResponse({ error: error.message || 'unavailable' }));
        return true;
    }
    if (request.action === 'showPageExcerpt' && request.tabId) {
        askTab(request.tabId, { action: 'showPageExcerpt' })
            .then(() => sendResponse({ ok: true }))
            .catch((error) => sendResponse({ error: error.message || 'unavailable' }));
        return true;
    }
    return false;
});
