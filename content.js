class ContentTranslator {
    constructor() {
        this.widget = null;
        this.pendingText = '';
        this.buildWidget();
        this.listen();
    }

    buildWidget() {
        const widget = document.createElement('div');
        widget.id = 'ziman-translation-widget';
        widget.hidden = true;
        widget.setAttribute('role', 'dialog');
        widget.setAttribute('aria-label', 'Ziman AI');

        const header = document.createElement('div');
        header.className = 'ziman-header';
        const title = document.createElement('span');
        title.textContent = 'Ziman AI';
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'ziman-close';
        close.setAttribute('aria-label', 'Close');
        close.textContent = '×';
        close.addEventListener('click', () => this.hide());
        header.append(title, close);

        const original = document.createElement('div');
        original.className = 'ziman-original';
        const status = document.createElement('div');
        status.className = 'ziman-loading';
        status.setAttribute('role', 'status');
        const translation = document.createElement('div');
        translation.className = 'ziman-translation';
        const phonetic = document.createElement('div');
        phonetic.className = 'ziman-phonetic';
        const targets = document.createElement('div');
        targets.className = 'ziman-targets';
        const actions = document.createElement('div');
        actions.className = 'ziman-actions';
        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'ziman-action';
        copy.textContent = 'Copy';
        copy.addEventListener('click', () => this.copyResult());
        const replace = document.createElement('button');
        replace.type = 'button';
        replace.className = 'ziman-action';
        replace.textContent = 'Replace';
        replace.addEventListener('click', () => this.replaceSelection());
        actions.append(copy, replace);

        const content = document.createElement('div');
        content.className = 'ziman-content';
        content.append(original, status, translation, phonetic, targets, actions);
        widget.append(header, content);
        document.documentElement.appendChild(widget);

        this.widget = widget;
        this.originalEl = original;
        this.statusEl = status;
        this.translationEl = translation;
        this.phoneticEl = phonetic;
        this.targetsEl = targets;
        this.replaceBtn = replace;
        this.copyBtn = copy;
    }

    listen() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (!request) return false;
            if (request.action === 'ping') {
                sendResponse({ status: 'ok' });
                return false;
            }
            if (request.action === 'getSelection') {
                sendResponse({ text: String(window.getSelection() || '') });
                return false;
            }
            if (request.action === 'translateSelection') {
                this.openForText(request.text || '');
                sendResponse({ status: 'ok' });
                return false;
            }
            if (request.action === 'showPageExcerpt') {
                this.openForText(this.pageExcerpt());
                sendResponse({ status: 'ok' });
                return false;
            }
            if (request.action === 'showCard') {
                this.showCard(request);
                sendResponse({ status: 'ok' });
                return false;
            }
            return false;
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.hide();
        });
        document.addEventListener('mousedown', (event) => {
            if (this.widget.hidden || this.widget.contains(event.target)) return;
            this.hide();
        });
        window.addEventListener('scroll', () => this.hide(), true);
    }

    showCard(payload) {
        this.pendingText = payload.original || '';
        this.originalEl.textContent = this.pendingText;
        this.translationEl.textContent = payload.status === 'ok' ? (payload.translation || '') : '';
        this.statusEl.textContent = payload.status === 'ok' ? '' : (payload.message || '');
        this.phoneticEl.textContent = '';
        this.replaceBtn.hidden = !this.canReplace();
        this.renderTargets(payload.targetLang);
        this.positionAtSelection();
        this.widget.hidden = false;
    }

    renderTargets(active) {
        const labels = {
            'ku-sorani': 'سۆرانی',
            'ku-kurmanji': 'کرمانجی',
            en: 'EN',
            fa: 'فا',
            ar: 'عر'
        };
        this.targetsEl.replaceChildren();
        Object.keys(labels).forEach((code) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = code === active ? 'ziman-target is-active' : 'ziman-target';
            button.textContent = labels[code];
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                chrome.runtime.sendMessage({
                    action: 'retranslate',
                    text: this.pendingText,
                    targetLang: code
                });
            });
            this.targetsEl.append(button);
        });
    }

    canReplace() {
        const element = document.activeElement;
        if (!element || element === document.body) return false;
        if (element.isContentEditable) return true;
        if (element.tagName === 'TEXTAREA') return true;
        if (element.tagName === 'INPUT') {
            return ['text', 'search', 'url', 'email'].includes((element.type || 'text').toLowerCase());
        }
        return false;
    }

    async copyResult() {
        const text = this.translationEl.textContent;
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            this.copyBtn.textContent = 'Copied';
        } catch (error) {
            this.copyBtn.textContent = 'Copy';
        }
    }

    replaceSelection() {
        const text = this.translationEl.textContent;
        const element = document.activeElement;
        if (!text || !this.canReplace()) return;
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            const start = element.selectionStart;
            const end = element.selectionEnd;
            const value = element.value;
            element.value = value.slice(0, start) + text + value.slice(end);
            const caret = start + text.length;
            element.selectionStart = caret;
            element.selectionEnd = caret;
            return;
        }
        if (element.isContentEditable) {
            document.execCommand('insertText', false, text);
        }
    }

    positionAtSelection() {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) {
            this.showAt(16, 16);
            return;
        }
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        this.showAt(rect.left, rect.bottom + 8);
    }

    pageExcerpt() {
        const title = document.title || '';
        const root = document.querySelector('main, article') || document.body;
        const body = (root && root.innerText ? root.innerText : '').replace(/\s+/g, ' ').trim().slice(0, 800);
        return [title, body].filter(Boolean).join('\n\n').slice(0, 1000);
    }

    openForText(text) {
        const value = String(text || '').trim();
        if (!value) return;
        this.pendingText = value.slice(0, 4000);
        this.showAt(24, 24);
        this.originalEl.textContent = this.pendingText;
        this.run(this.pendingText);
    }

    showAt(x, y) {
        this.widget.hidden = false;
        const width = 320;
        const left = Math.max(8, Math.min(x, window.innerWidth - width - 8));
        const top = Math.max(8, Math.min(y + 12, window.innerHeight - 80));
        this.widget.style.left = `${left}px`;
        this.widget.style.top = `${top}px`;
    }

    hide() {
        this.widget.hidden = true;
    }

    async run(text) {
        this.statusEl.textContent = 'Translating…';
        this.translationEl.textContent = '';
        this.phoneticEl.textContent = '';
        try {
            const response = await chrome.runtime.sendMessage({ action: 'translate', text });
            this.render(response);
        } catch (error) {
            this.statusEl.textContent = '';
            this.translationEl.textContent = 'Reload the page, then try again.';
        }
    }

    render(response) {
        this.statusEl.textContent = '';
        if (!response || response.status === 'empty') {
            this.translationEl.textContent = 'Nothing to translate.';
            return;
        }
        if (response.status === 'needs-key') {
            this.translationEl.textContent = 'Not in the offline phrasebook. Add your AIML API key in the extension settings.';
            return;
        }
        if (response.status === 'too-long') {
            this.translationEl.textContent = 'Text is too long.';
            return;
        }
        if (response.status === 'same-language') {
            this.translationEl.textContent = 'Choose two different languages in the extension.';
            return;
        }
        if (response.status !== 'ok') {
            this.translationEl.textContent = response.message || 'Translation failed.';
            return;
        }
        this.translationEl.textContent = response.translation || '';
        this.phoneticEl.textContent = response.phonetic || '';
    }
}

if (!globalThis.__zimanContent) {
    globalThis.__zimanContent = new ContentTranslator();
}
