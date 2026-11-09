const OPTIONS_COPY = {
    en: {
        tagline: 'Settings',
        defaults: 'Defaults',
        ui: 'Interface language',
        tone: 'Tone',
        neutral: 'Neutral',
        formal: 'Formal',
        informal: 'Informal',
        model: 'AIML model',
        modelNote: 'The selected model name is sent only when you translate text that is not in the offline phrasebook. Availability depends on your AIML account.',
        defaultTarget: 'Default target',
        resultMode: 'Selection result',
        resultCard: 'Small card near the selection',
        resultPopup: 'Open the popup',
        shortcutNote: 'Alt+Shift+Z translates the selection. Alt+Shift+X cycles the target. Change either shortcut at chrome://extensions/shortcuts.',
        shortcuts: 'Keyboard shortcuts',
        keyTitle: 'Your AIML API key',
        keyNote: 'Get a key from aimlapi.com. Ziman AI does not include a key. It is stored with chrome.storage.local on this browser and is not synced. Text sent for AI translation goes only to https://api.aimlapi.com. Check key sends one short request.',
        key: 'API key',
        save: 'Save key',
        test: 'Check key',
        clear: 'Remove key',
        saved: 'Key saved on this device.',
        removed: 'Key removed from this device.',
        empty: 'Enter a key before saving.',
        keyValid: 'API key is valid.',
        keyValidEmpty: 'Key is valid but the AIML balance is empty',
        invalidKey: 'The API key was rejected.',
        rateLimit: 'Rate limit exceeded. Wait and try again.',
        billing: 'Add funds',
        about: 'Naser Sadrmanesh',
        aboutText: 'AI Product Engineer. The speech-ribbon mark belongs to Ziman. The photo identifies the developer.',
        site: 'Website',
        docs: 'Product page',
        related: 'Related projects',
        privacy: 'Privacy policy'
    },
    fa: {
        tagline: 'تنظیمات',
        defaults: 'پیش‌فرض‌ها',
        ui: 'زبان رابط',
        tone: 'لحن',
        neutral: 'خنثی',
        formal: 'رسمی',
        informal: 'خودمانی',
        model: 'مدل AIML',
        modelNote: 'نام مدل فقط وقتی فرستاده می‌شود که عبارت در دفترچهٔ آفلاین نباشد. در دسترس بودن مدل به حساب AIML شما بستگی دارد.',
        defaultTarget: 'زبان مقصد پیش‌فرض',
        resultMode: 'نتیجهٔ انتخاب',
        resultCard: 'کارت کوچک کنار انتخاب',
        resultPopup: 'باز کردن پنجره',
        shortcutNote: 'Alt+Shift+Z انتخاب را ترجمه می‌کند. Alt+Shift+X زبان مقصد را عوض می‌کند. هر دو را در chrome://extensions/shortcuts می‌توانید تغییر دهید.',
        shortcuts: 'میانبرهای صفحه‌کلید',
        keyTitle: 'کلید AIML شما',
        keyNote: 'کلید را از aimlapi.com بگیرید. افزونه کلیدی همراه ندارد. کلید با chrome.storage.local فقط روی همین مرورگر می‌ماند و همگام‌سازی نمی‌شود. متن ترجمهٔ هوش مصنوعی فقط به https://api.aimlapi.com می‌رود. بررسی کلید یک درخواست کوتاه می‌فرستد.',
        key: 'کلید API',
        save: 'ذخیرهٔ کلید',
        test: 'بررسی کلید',
        clear: 'حذف کلید',
        saved: 'کلید روی این دستگاه ذخیره شد.',
        removed: 'کلید از این دستگاه حذف شد.',
        empty: 'پیش از ذخیره، کلید را وارد کنید.',
        keyValid: 'کلید معتبر است.',
        keyValidEmpty: 'کلید معتبر است، موجودی خالی است.',
        invalidKey: 'کلید پذیرفته نشد.',
        rateLimit: 'محدودیت تعداد درخواست. کمی بعد دوباره تلاش کنید.',
        billing: 'افزایش موجودی',
        about: 'ناصر صدرمنش',
        aboutText: 'مهندس محصول هوش مصنوعی. نشان گفتار مخصوص زیمان است؛ عکس برای شناسایی توسعه‌دهنده است.',
        site: 'وب‌سایت',
        docs: 'صفحهٔ محصول',
        related: 'پروژه‌های مرتبط',
        privacy: 'سیاست حریم خصوصی'
    },
    ku: {
        tagline: 'ڕێکخستن',
        defaults: 'بنەڕەت',
        ui: 'زمانی ڕووکار',
        tone: 'شێواز',
        neutral: 'ئاسایی',
        formal: 'فەرمی',
        informal: 'نافەرمی',
        model: 'مۆدێلی AIML',
        modelNote: 'ناوی مۆدێل تەنها کاتێک دەنێردرێت کە دەقەکە لە فەرهەنگی ئۆفلاین نەبێت. بەردەستبوون بەستراوە بە هەژماری AIMLی تۆ.',
        defaultTarget: 'زمانی مەبەستی بنەڕەت',
        resultMode: 'ئەنجامی هەڵبژاردن',
        resultCard: 'کارتێکی بچووک لە پاڵ هەڵبژاردن',
        resultPopup: 'کردنەوەی پەنجەرە',
        shortcutNote: 'Alt+Shift+Z هەڵبژاردن وەردەگێڕێت. Alt+Shift+X زمانی مەبەست دەگۆڕێت. هەردووکیان لە chrome://extensions/shortcuts دەگۆڕدرێن.',
        shortcuts: 'قەدبڕەکانی تەختەکلیل',
        keyTitle: 'کلیلی AIMLی تۆ',
        keyNote: 'کلیل لە aimlapi.com وەربگرە. زیمان کلیلێکی لەگەڵدا نییە. کلیلەکە بە chrome.storage.local تەنها لەم وێبگەڕە دەمێنێتەوە. دەقی وەرگێڕانی زیرەک تەنها بۆ https://api.aimlapi.com دەڕوات. پشکنینی کلیل یەک داواکاریی کورت دەنێرێت.',
        key: 'کلیلی API',
        save: 'پاشەکەوتکردنی کلیل',
        test: 'پشکنینی کلیل',
        clear: 'سڕینەوەی کلیل',
        saved: 'کلیل لەسەر ئەم ئامێرە پاشەکەوت کرا.',
        removed: 'کلیل لەم ئامێرە سڕایەوە.',
        empty: 'پێش پاشەکەوتکردن کلیل بنووسە.',
        keyValid: 'کلیلەکە دروستە.',
        keyValidEmpty: 'کلیل دروستە، باڵانس بەتاڵە.',
        invalidKey: 'کلیلەکە وەرنەگیرا.',
        rateLimit: 'سنووری داواکاری تێپەڕی. کەمێک چاوەڕێ بکە.',
        billing: 'زیادکردنی باڵانس',
        about: 'ناصر صدرمنش',
        aboutText: 'ئەندازیاری بەرهەمی زیرەکی دەستکرد. نیشانەی وتەکان هی زیمانە. وێنەکە بۆ ناسینەوەی گەشەپێدەرە.',
        site: 'ماڵپەڕ',
        docs: 'پەڕەی بەرهەم',
        related: 'پڕۆژە پەیوەندیدارەکان',
        privacy: 'سیاسەتی تایبەتمەندی'
    }
};

class ZimanOptions {
    constructor() {
        this.lang = 'ku';
        this.checkGeneration = 0;
        document.getElementById('saveKey').addEventListener('click', () => this.saveKey());
        document.getElementById('testKey').addEventListener('click', () => this.testKey());
        document.getElementById('clearKey').addEventListener('click', () => this.clearKey());
        document.getElementById('uiLang').addEventListener('change', () => this.persist());
        document.getElementById('tone').addEventListener('change', () => this.persist());
        document.getElementById('model').addEventListener('change', () => this.persist());
        document.getElementById('defaultTarget').addEventListener('change', () => this.persist());
        document.getElementById('resultMode').addEventListener('change', () => this.persist());
        document.getElementById('openShortcuts').addEventListener('click', () => {
            chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
        });
        this.load();
    }

    copy() {
        return OPTIONS_COPY[this.lang] || OPTIONS_COPY.en;
    }

    apply() {
        const text = this.copy();
        const rtl = this.lang === 'fa' || this.lang === 'ku';
        document.documentElement.lang = this.lang === 'ku' ? 'ku' : (this.lang === 'fa' ? 'fa' : 'en');
        document.documentElement.dir = rtl ? 'rtl' : 'ltr';
        document.getElementById('tagline').textContent = text.tagline;
        document.getElementById('defaultsHeading').textContent = text.defaults;
        document.getElementById('uiLabel').textContent = text.ui;
        document.getElementById('toneLabel').textContent = text.tone;
        const tone = document.getElementById('tone');
        tone.options[0].textContent = text.neutral;
        tone.options[1].textContent = text.formal;
        tone.options[2].textContent = text.informal;
        document.getElementById('modelLabel').textContent = text.model;
        document.getElementById('modelNote').textContent = text.modelNote;
        document.getElementById('defaultTargetLabel').textContent = text.defaultTarget;
        document.getElementById('resultModeLabel').textContent = text.resultMode;
        document.getElementById('resultMode').options[0].textContent = text.resultCard;
        document.getElementById('resultMode').options[1].textContent = text.resultPopup;
        document.getElementById('shortcutNote').textContent = text.shortcutNote;
        document.getElementById('openShortcuts').textContent = text.shortcuts;
        document.getElementById('keyHeading').textContent = text.keyTitle;
        document.getElementById('keyNote').textContent = text.keyNote;
        document.getElementById('keyLabel').textContent = text.key;
        document.getElementById('saveKey').textContent = text.save;
        document.getElementById('testKey').textContent = text.test;
        document.getElementById('clearKey').textContent = text.clear;
        document.getElementById('aboutHeading').textContent = text.about;
        document.getElementById('aboutText').textContent = text.aboutText;
        document.getElementById('siteLink').textContent = text.site;
        const docsLink = document.getElementById('docsLink');
        if (docsLink) docsLink.textContent = text.docs;
        const relatedHeading = document.getElementById('relatedHeading');
        if (relatedHeading) relatedHeading.textContent = text.related;
        document.getElementById('privacyLink').textContent = text.privacy;
    }

    fillModels(selected) {
        const select = document.getElementById('model');
        const api = new AIMLAPI();
        select.replaceChildren();
        Object.keys(api.models).forEach((key) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${key} · ${api.models[key]}`;
            select.appendChild(option);
        });
        select.value = api.models[selected] ? selected : 'gpt-4o-mini';
    }

    async load() {
        const [syncData, localData] = await Promise.all([
            chrome.storage.sync.get({
                uiLang: 'ku',
                tone: 'neutral',
                defaultTarget: 'ku-sorani',
                resultMode: 'card'
            }),
            chrome.storage.local.get({ apiKey: '', model: 'gpt-4o-mini' })
        ]);
        this.lang = ['ku', 'fa', 'en'].includes(syncData.uiLang) ? syncData.uiLang : 'ku';
        document.getElementById('uiLang').value = this.lang;
        document.getElementById('tone').value = syncData.tone || 'neutral';
        document.getElementById('defaultTarget').value = syncData.defaultTarget || 'ku-sorani';
        document.getElementById('resultMode').value = syncData.resultMode === 'popup' ? 'popup' : 'card';
        this.fillModels(localData.model || 'gpt-4o-mini');
        document.getElementById('apiKey').value = localData.apiKey || '';
        this.apply();
    }

    async persist() {
        this.lang = ['ku', 'fa', 'en'].includes(document.getElementById('uiLang').value)
            ? document.getElementById('uiLang').value
            : 'ku';
        await chrome.storage.sync.set({
            uiLang: this.lang,
            tone: document.getElementById('tone').value,
            defaultTarget: document.getElementById('defaultTarget').value,
            resultMode: document.getElementById('resultMode').value
        });
        await chrome.storage.local.set({
            model: document.getElementById('model').value
        });
        this.apply();
    }

    keyCheckText(result) {
        const text = this.copy();
        if (!result) return 'No response';
        if (result.balanceEmpty || result.code === 'no-credits') return result.message || text.keyValidEmpty;
        if (result.code === 'invalid-key') return text.invalidKey;
        if (result.code === 'rate-limit') return text.rateLimit;
        if (result.code === 'model-forbidden') return result.message || text.invalidKey;
        if (result.valid) return text.keyValid;
        return result.message || text.invalidKey;
    }

    async saveKey() {
        const apiKey = document.getElementById('apiKey').value.trim();
        const text = this.copy();
        if (!apiKey) {
            document.getElementById('keyStatus').textContent = text.empty;
            return;
        }
        await chrome.storage.local.set({ apiKey });
        await chrome.storage.sync.remove('apiKey');
        document.getElementById('keyStatus').textContent = text.saved;
    }

    async clearKey() {
        this.checkGeneration += 1;
        await chrome.storage.local.remove('apiKey');
        await chrome.storage.sync.remove('apiKey');
        document.getElementById('apiKey').value = '';
        document.getElementById('keyStatus').textContent = this.copy().removed;
    }

    async testKey() {
        const apiKey = document.getElementById('apiKey').value.trim();
        const status = document.getElementById('keyStatus');
        if (!apiKey) {
            status.textContent = this.copy().empty;
            return;
        }
        const generation = ++this.checkGeneration;
        await chrome.storage.local.set({ apiKey });
        await chrome.storage.sync.remove('apiKey');
        status.textContent = '…';
        try {
            const result = await chrome.runtime.sendMessage({ action: 'testApiKey' });
            if (generation !== this.checkGeneration) return;
            status.replaceChildren();
            status.append(document.createTextNode(this.keyCheckText(result)));
            if (result && result.code === 'no-credits' && result.billingUrl) {
                status.append(document.createTextNode(' '));
                const link = document.createElement('a');
                link.className = 'error-link';
                link.href = result.billingUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = this.copy().billing;
                status.append(link);
            }
        } catch (error) {
            if (generation !== this.checkGeneration) return;
            status.textContent = error.message || 'Key check failed';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ZimanOptions();
});
