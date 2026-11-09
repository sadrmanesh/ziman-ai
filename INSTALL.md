# Install Ziman AI

**Naser Sadrmanesh (ناصر صدرمنش)** · https://sadrmanesh.github.io/

This package is for Google Chrome on desktop.

## From source

1. Clone https://github.com/sadrmanesh/ziman-ai or use a local copy of this folder.
2. Open `chrome://extensions/` and turn on Developer mode.
3. Choose **Load unpacked** and select the folder that contains `manifest.json`.
4. Pin the Ziman AI icon from the Chrome toolbar if you want it visible.

## First use

1. Click the toolbar icon.
2. Try `سڵاو` as the source text, with English as the target. The result comes from the offline phrasebook and is not sent to a server.
3. To translate sentences that are not in the phrasebook, open Settings and paste your own key from [aimlapi.com](https://aimlapi.com/). The extension does not ship with a key. Text for AI translation goes only to `https://api.aimlapi.com`.

## Selection translation

Right-click selected text and choose **Translate with Ziman**, or press `Alt+Shift+Z`. `Alt+Shift+X` cycles the target language. Change shortcuts at `chrome://extensions/shortcuts`.

The extension does not open when you only click or select text.

## If something goes wrong

- The folder you load must contain `manifest.json`. Do not select a zip file.
- If a page blocks the selection reader, reload the page and try again.
- If a phrase is not in the glossary, an AIML key is required for a full-sentence translation.

More detail: [README.md](README.md) and the [product page](https://sadrmanesh.github.io/ziman-ai/).

## فارسی

1. پوشهٔ حاوی `manifest.json` را در `chrome://extensions/` با **Load unpacked** بارگذاری کنید.
2. «سڵاو» را در افزونه به انگلیسی ترجمه کنید؛ این پاسخ از واژه‌نامهٔ آفلاین است.
3. برای جمله‌های دیگر، کلید AIML خودتان را در تنظیمات بگذارید.
4. ترجمه با راست‌کلیک یا میانبر `Alt+Shift+Z` انجام می‌شود، نه با کلیک یا انتخاب خالی متن.
