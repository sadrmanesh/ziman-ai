class ZimanPopup {
    constructor() {
        this.uiLang = 'en';
        this.history = [];
        this.lastResult = '';
        this.lastStatus = null;
        this.lastProvider = '';
        this.lastPhonetic = '';
        this.tone = 'neutral';
        this.favorites = [];
        this.bind();
        this.load();
    }

    el(id) {
        return document.getElementById(id);
    }

    bind() {
        this.el('translateForm').addEventListener('submit', (event) => {
            event.preventDefault();
            this.translate();
        });
        this.el('swapBtn').addEventListener('click', () => this.swap());
        this.el('clearBtn').addEventListener('click', () => this.clear());
        this.el('pasteBtn').addEventListener('click', () => this.paste());
        this.el('copyBtn').addEventListener('click', () => this.copy());
        this.el('speakBtn').addEventListener('click', () => this.speak());
        this.el('pageBtn').addEventListener('click', () => this.pageExcerpt());
        this.el('selectionBtn').addEventListener('click', () => this.selection());
        this.el('clearHistory').addEventListener('click', () => this.clearHistory());
        this.el('favoriteBtn').addEventListener('click', () => this.toggleFavorite());
        this.el('openSettings').addEventListener('click', () => chrome.runtime.openOptionsPage());
        this.el('openBook').addEventListener('click', () => this.toggleBook(true));
        this.el('closeBook').addEventListener('click', () => this.toggleBook(false));
        this.el('bookSearch').addEventListener('input', () => this.renderBook());
        this.el('bookCategory').addEventListener('change', () => this.renderBook());
        this.el('uiLang').addEventListener('click', () => {
            const order = ['ku', 'fa', 'en'];
            const index = order.indexOf(this.uiLang);
            this.uiLang = order[(index + 1) % order.length];
            this.applyLanguage();
            this.saveSettings();
        });
        ['sourceLang', 'targetLang', 'phonetic'].forEach((id) => {
            this.el(id).addEventListener('change', () => {
                this.saveSettings();
                this.applyDirection();
                this.renderExamples();
            });
        });
        this.el('sourceText').addEventListener('input', () => {
            this.applyDirection();
            this.renderCount();
        });
        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                this.translate();
            }
        });
    }

    t(key) {
        return ZimanMessages.t(this.uiLang, key);
    }

    async load() {
        const [syncData, localData] = await Promise.all([
            chrome.storage.sync.get({
                sourceLang: 'ku-sorani',
                targetLang: 'en',
                tone: 'neutral',
                includePhonetic: false,
                uiLang: 'ku'
            }),
            chrome.storage.local.get({ apiKey: '', history: [], favorites: [] })
        ]);
        this.uiLang = ['ku', 'fa', 'en'].includes(syncData.uiLang) ? syncData.uiLang : 'ku';
        this.tone = syncData.tone || 'neutral';
        this.history = ZimanStorage.trimHistory(localData.history);
        this.favorites = ZimanStorage.trimHistory(localData.favorites);
        this.fillLanguages();
        this.el('sourceLang').value = syncData.sourceLang;
        this.el('targetLang').value = syncData.targetLang;
        this.el('phonetic').checked = Boolean(syncData.includePhonetic);
        this.hasKey = Boolean(ZimanStorage.cleanKey(localData.apiKey));
        this.applyLanguage();
        this.showEmpty();
        this.renderHistory();
        this.consumePendingSelection();
    }

    async consumePendingSelection() {
        if (!chrome.storage.session) return;
        const pending = await chrome.storage.session.get(['pendingText', 'pendingTarget']);
        if (!pending.pendingText) return;
        await chrome.storage.session.remove(['pendingText', 'pendingTarget']);
        if (pending.pendingTarget) this.el('targetLang').value = pending.pendingTarget;
        this.el('sourceText').value = pending.pendingText;
        this.renderCount();
        this.translate();
    }

    fillLanguages() {
        const source = this.el('sourceLang');
        const target = this.el('targetLang');
        const sourceValue = source.value || 'auto';
        const targetValue = target.value || 'en';
        source.replaceChildren();
        target.replaceChildren();
        ZimanMessages.languages.forEach((language) => {
            const option = document.createElement('option');
            option.value = language.value;
            option.textContent = language[this.uiLang] || language.en;
            if (language.value !== 'auto') target.appendChild(option.cloneNode(true));
            source.appendChild(option);
        });
        source.value = [...source.options].some((option) => option.value === sourceValue) ? sourceValue : 'auto';
        target.value = [...target.options].some((option) => option.value === targetValue) ? targetValue : 'en';
    }

    applyLanguage() {
        const fa = this.uiLang === 'fa';
        const ku = this.uiLang === 'ku';
        document.documentElement.lang = ku ? 'ku' : (fa ? 'fa' : 'en');
        document.documentElement.dir = fa || ku ? 'rtl' : 'ltr';
        this.el('tagline').textContent = this.t('tagline');
        this.el('fromLabel').textContent = this.t('from');
        this.el('toLabel').textContent = this.t('to');
        this.el('swapBtn').textContent = '⇄';
        this.el('swapBtn').setAttribute('aria-label', this.t('swap'));
        this.el('sourceLabel').textContent = this.t('placeholder');
        this.el('sourceText').placeholder = this.t('placeholder');
        this.el('phoneticLabel').textContent = this.t('phonetic');
        this.el('clearBtn').textContent = this.t('clear');
        this.el('pasteBtn').textContent = this.t('paste');
        this.el('translateBtn').textContent = this.t('translate');
        this.el('resultHeading').textContent = this.t('resultLabel');
        this.el('emptyState').textContent = this.t('empty');
        this.el('loadingState').textContent = this.t('loading');
        this.el('copyBtn').textContent = this.t('copy');
        this.el('speakBtn').textContent = this.t('speak');
        this.el('speakBtn').setAttribute('aria-label', this.t('speak'));
        this.el('historyHeading').textContent = this.t('history');
        this.el('clearHistory').textContent = this.t('clearHistory');
        this.el('historyEmpty').textContent = this.t('noHistory');
        this.el('favoritesHeading').textContent = this.t('favorites');
        this.el('favoritesEmpty').textContent = this.t('noFavorites');
        this.el('favoriteBtn').textContent = this.t('favorite');
        this.el('pageBtn').textContent = this.t('page');
        this.el('selectionBtn').textContent = this.t('selection');
        this.el('examplesLabel').textContent = this.t('examples');
        this.el('openBook').textContent = this.t('book');
        this.el('bookHeading').textContent = this.t('book');
        this.el('closeBook').textContent = this.t('closeBook');
        this.el('bookSearchLabel').textContent = this.t('bookSearch');
        this.el('bookSearch').placeholder = this.t('bookSearch');
        this.fillBookCategories();
        if (!this.el('bookPanel').classList.contains('hidden')) this.renderBook();
        this.el('developerName').textContent = this.t('developedBy');
        this.el('openSettings').textContent = '⚙';
        this.el('openSettings').setAttribute('aria-label', this.t('settings'));
        this.el('uiLang').textContent = ku ? 'کوردی' : (fa ? 'فا' : 'EN');
        const preview = document.getElementById('previewNote');
        if (preview) {
            const isPreview = Boolean(chrome && chrome._zimanPreview);
            preview.classList.toggle('hidden', !isPreview);
            preview.textContent = this.t('previewNote');
        }
        this.el('uiLang').setAttribute('aria-label', this.t('uiLanguage'));
        this.el('modeStatus').textContent = this.hasKey ? this.t('aiReady') : this.t('aiMissing');
        this.fillLanguages();
        this.applyDirection();
        this.renderCount();
        this.renderExamples();
        this.renderHistory();
        this.renderFavorites();
        if (this.lastStatus && this.lastStatus !== 'ok') {
            this.el('errorState').textContent = this.messageFor({ status: this.lastStatus, message: this.lastMessage });
        }
        if (this.lastStatus === 'ok') {
            this.el('providerNote').textContent = this.lastProvider === 'aiml' ? this.t('aiNote') : this.t('phrasebookNote');
            if (this.lastPhonetic) {
                this.el('phoneticText').textContent = `${this.t('phoneticLabel')}: ${this.lastPhonetic}`;
            }
        }
    }

    applyDirection() {
        this.el('sourceText').dir = 'auto';
        this.el('resultText').dir = 'auto';
    }

    renderCount() {
        const length = this.el('sourceText').value.length;
        this.el('charCount').textContent = `${length} / 4000 ${this.t('chars')}`;
    }

    toggleBook(open) {
        this.el('bookPanel').classList.toggle('hidden', !open);
        if (open) this.renderBook();
    }

    fillBookCategories() {
        const select = this.el('bookCategory');
        const current = select.value || 'all';
        select.replaceChildren();
        const all = document.createElement('option');
        all.value = 'all';
        all.textContent = this.t('allCategories');
        select.append(all);
        ZimanPhrasebook.CATEGORIES.forEach((category) => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = ZimanMessages.categoryLabel(this.uiLang, category);
            select.append(option);
        });
        select.value = [...select.options].some((option) => option.value === current) ? current : 'all';
    }

    renderBook() {
        const host = this.el('bookList');
        host.replaceChildren();
        const items = ZimanPhrasebook.search(this.el('bookSearch').value, this.el('bookCategory').value);
        items.forEach((item) => {
            const block = document.createElement('article');
            block.className = 'book-item';
            const title = document.createElement('p');
            title.dir = 'ltr';
            title.lang = 'en';
            title.textContent = item.forms.en || item.id;
            block.append(title);
            ZimanPhrasebook.LANGS.forEach((lang) => {
                if (!item.forms[lang] || lang === 'en') return;
                const line = document.createElement('p');
                line.dir = 'auto';
                const phonetic = item.phonetic && item.phonetic[lang] ? ` · ${item.phonetic[lang]}` : '';
                line.textContent = `${item.forms[lang]}${phonetic}`;
                block.append(line);
            });
            if (item.review) {
                const mark = document.createElement('p');
                mark.className = 'review-mark';
                mark.textContent = this.t('reviewMark');
                block.append(mark);
            }
            const copy = document.createElement('button');
            copy.type = 'button';
            copy.className = 'text-btn';
            copy.textContent = this.t('copy');
            copy.addEventListener('click', async () => {
                const text = item.forms['ku-sorani'] || item.forms.en || '';
                try {
                    await navigator.clipboard.writeText(text);
                    copy.textContent = this.t('copied');
                } catch (error) {
                    copy.textContent = this.t('copyFailed');
                }
            });
            block.append(copy);
            host.append(block);
        });
    }

    renderExamples() {
        const host = this.el('examples');
        host.replaceChildren();
        let source = this.el('sourceLang').value;
        const target = this.el('targetLang').value;
        if (source === 'auto') source = target === 'en' ? 'ku-sorani' : 'en';
        ZimanPhrasebook.examples(source, target, 4).forEach((phrase) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = phrase;
            button.addEventListener('click', () => {
                if (this.el('sourceLang').value === 'auto') this.el('sourceLang').value = source;
                this.el('sourceText').value = phrase;
                this.applyDirection();
                this.renderCount();
                this.translate();
            });
            host.appendChild(button);
        });
        this.el('examplesLabel').classList.toggle('hidden', host.childElementCount === 0);
    }

    async saveSettings() {
        await chrome.storage.sync.set({
            sourceLang: this.el('sourceLang').value,
            targetLang: this.el('targetLang').value,
            tone: this.tone,
            includePhonetic: this.el('phonetic').checked,
            uiLang: this.uiLang
        });
    }

    setView(mode) {
        this.el('emptyState').classList.toggle('hidden', mode !== 'empty');
        this.el('loadingState').classList.toggle('hidden', mode !== 'loading');
        this.el('errorState').classList.toggle('hidden', mode !== 'error');
        this.el('resultState').classList.toggle('hidden', mode !== 'result');
        this.el('translateBtn').disabled = mode === 'loading';
        this.el('translateBtn').textContent = mode === 'loading' ? this.t('translating') : this.t('translate');
    }

    showEmpty() {
        this.lastStatus = null;
        this.setView('empty');
    }

    showError(response) {
        this.lastStatus = response && response.status ? response.status : 'error';
        this.lastMessage = response && response.message ? response.message : '';
        this.lastBilling = response && response.billingUrl ? response.billingUrl : '';
        const box = this.el('errorState');
        box.replaceChildren();
        box.append(document.createTextNode(this.messageFor(response)));
        if (response && response.billingUrl) {
            box.append(document.createTextNode(' '));
            const link = document.createElement('a');
            link.className = 'error-link';
            link.href = response.billingUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = this.t('billing');
            box.append(link);
        }
        const suggest = this.el('suggestLine');
        if (suggest) {
            if (response && response.suggestion) {
                suggest.classList.remove('hidden');
                suggest.textContent = `${this.t('didYouMean')}: ${response.suggestion}`;
            } else {
                suggest.classList.add('hidden');
                suggest.textContent = '';
            }
        }
        this.setView('error');
    }

    showResult(response) {
        this.lastStatus = 'ok';
        this.lastProvider = response.provider || '';
        this.lastPhonetic = response.phonetic || '';
        this.lastResult = response.translation || '';
        this.el('resultText').textContent = this.lastResult;
        const phonetic = this.el('phoneticText');
        if (response.phonetic) {
            phonetic.hidden = false;
            phonetic.textContent = `${this.t('phoneticLabel')}: ${response.phonetic}`;
            phonetic.classList.remove('hidden');
        } else {
            phonetic.textContent = '';
            phonetic.classList.add('hidden');
        }
        if (response.provider === 'words') this.el('providerNote').textContent = this.t('wordNote');
        else if (response.fallback) this.el('providerNote').textContent = this.t('phrasebookFallback');
        else if (response.provider === 'aiml') this.el('providerNote').textContent = this.t('aiNote');
        else this.el('providerNote').textContent = this.t('phrasebookNote');
        this.applyDirection();
        this.setView('result');
    }

    async translate() {
        this.renderCount();
        const text = this.el('sourceText').value.trim();
        if (!text) {
            this.showError({ status: 'empty' });
            return;
        }
        await this.saveSettings();
        this.setView('loading');
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'translate',
                text,
                sourceLang: this.el('sourceLang').value,
                targetLang: this.el('targetLang').value,
                tone: this.tone,
                includePhonetic: this.el('phonetic').checked
            });
            if (!response || response.status !== 'ok') {
                this.showError(response || { status: 'error' });
                return;
            }
            this.showResult(response);
            await this.remember(text, response);
        } catch (error) {
            this.showError({ status: 'error', message: error.message || this.t('needsKey') });
        }
    }

    messageFor(response) {
        if (!response) return this.t('needsKey');
        if (response.status === 'needs-key') return this.t('needsKey');
        if (response.status === 'too-long') return this.t('tooLong');
        if (response.status === 'same-language') return this.t('sameLanguage');
        if (response.status === 'empty') return this.t('empty');
        if (response.status === 'no-credits') return this.t('noCredits');
        if (response.status === 'invalid-key') return this.t('invalidKey');
        if (response.status === 'rate-limit') return this.t('rateLimit');
        if (response.status === 'timeout') return this.t('timeout');
        if (response.status === 'network') return this.t('network');
        if (response.status === 'model-forbidden') return response.serverMessage || response.message || this.t('network');
        if (response.status === 'suggest') return `${this.t('didYouMean')}: ${response.suggestion || ''}`;
        return response.message || this.t('needsKey');
    }

    async remember(text, response) {
        this.history = ZimanStorage.addHistory(this.history, {
            text,
            translation: response.translation,
            sourceLang: this.el('sourceLang').value,
            targetLang: this.el('targetLang').value,
            provider: response.provider
        });
        await chrome.storage.local.set({ history: this.history });
        this.renderHistory();
    }

    renderHistory() {
        const host = this.el('history');
        host.replaceChildren();
        this.history.forEach((item) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = item.text;
            button.addEventListener('click', () => {
                this.el('sourceLang').value = item.sourceLang;
                this.el('targetLang').value = item.targetLang;
                this.el('sourceText').value = item.text;
                this.showResult({
                    translation: item.translation,
                    provider: item.provider,
                    phonetic: ''
                });
                this.renderCount();
            });
            host.appendChild(button);
        });
        this.el('historyEmpty').classList.toggle('hidden', this.history.length > 0);
    }

    renderFavorites() {
        const host = this.el('favorites');
        host.replaceChildren();
        this.favorites.forEach((item) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = item.text;
            button.addEventListener('click', () => {
                this.el('sourceLang').value = item.sourceLang;
                this.el('targetLang').value = item.targetLang;
                this.el('sourceText').value = item.text;
                this.showResult({
                    translation: item.translation,
                    provider: item.provider,
                    phonetic: ''
                });
                this.renderCount();
            });
            host.appendChild(button);
        });
        this.el('favoritesEmpty').classList.toggle('hidden', this.favorites.length > 0);
    }

    async toggleFavorite() {
        if (!this.lastResult) return;
        const item = {
            text: this.el('sourceText').value.trim(),
            translation: this.lastResult,
            sourceLang: this.el('sourceLang').value,
            targetLang: this.el('targetLang').value,
            provider: this.lastProvider || 'phrasebook'
        };
        const exists = this.favorites.some((entry) => {
            return entry.text === item.text && entry.sourceLang === item.sourceLang && entry.targetLang === item.targetLang;
        });
        this.favorites = exists
            ? ZimanStorage.removeFavorite(this.favorites, item)
            : ZimanStorage.addFavorite(this.favorites, item);
        await chrome.storage.local.set({ favorites: this.favorites });
        this.renderFavorites();
    }

    async clearHistory() {
        this.history = [];
        await chrome.storage.local.set({ history: [] });
        this.renderHistory();
    }

    swap() {
        const source = this.el('sourceLang');
        const target = this.el('targetLang');
        if (source.value === 'auto') {
            const previous = target.value;
            target.value = previous === 'en' ? 'ku-sorani' : 'en';
            source.value = previous;
        } else {
            const previous = source.value;
            source.value = target.value;
            target.value = previous;
        }
        const text = this.el('sourceText');
        const result = this.lastResult;
        if (result) text.value = result;
        this.saveSettings();
        this.applyDirection();
        this.renderExamples();
        this.renderCount();
    }

    clear() {
        this.el('sourceText').value = '';
        this.lastResult = '';
        this.renderCount();
        this.showEmpty();
    }

    async paste() {
        try {
            this.el('sourceText').value = await navigator.clipboard.readText();
            this.renderCount();
            this.applyDirection();
        } catch (error) {
            this.showError({ status: 'error', message: this.t('pasteFailed') });
        }
    }

    async copy() {
        if (!this.lastResult) return;
        try {
            await navigator.clipboard.writeText(this.lastResult);
            this.el('copyBtn').textContent = this.t('copied');
            setTimeout(() => {
                this.el('copyBtn').textContent = this.t('copy');
            }, 1600);
        } catch (error) {
            this.showError({ status: 'error', message: this.t('copyFailed') });
        }
    }

    speak() {
        if (!this.lastResult || !('speechSynthesis' in window)) {
            this.showError({ status: 'error', message: this.t('noSpeech') });
            return;
        }
        const utterance = new SpeechSynthesisUtterance(this.lastResult);
        const codes = {
            en: 'en-US',
            'ku-sorani': 'ku',
            'ku-kurmanji': 'ku',
            ar: 'ar',
            fa: 'fa-IR',
            tr: 'tr-TR',
            fr: 'fr-FR',
            de: 'de-DE',
            es: 'es-ES',
            ru: 'ru-RU',
            zh: 'zh-CN',
            ja: 'ja-JP'
        };
        utterance.lang = codes[this.el('targetLang').value] || 'en-US';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    async pageExcerpt() {
        await this.askTab('showPageExcerpt');
    }

    async selection() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.id) {
                this.showError({ status: 'error', message: this.t('pageFailed') });
                return;
            }
            const response = await chrome.runtime.sendMessage({ action: 'readSelection', tabId: tab.id });
            const text = response && response.text ? response.text.trim() : '';
            if (!text) {
                this.showError({ status: 'error', message: this.t('noSelection') });
                return;
            }
            this.el('sourceText').value = text;
            this.renderCount();
            this.translate();
        } catch (error) {
            this.showError({ status: 'error', message: this.t('pageFailed') });
        }
    }

    async askTab(action) {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.id) throw new Error('no tab');
            const response = await chrome.runtime.sendMessage({ action, tabId: tab.id });
            if (response && response.error) throw new Error(response.error);
            window.close();
        } catch (error) {
            this.showError({ status: 'error', message: this.t('pageFailed') });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ZimanPopup();
});
