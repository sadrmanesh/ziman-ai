# Getting started

Ziman AI is a Manifest V3 extension for Google Chrome on desktop. Version 1.2.3.

The supported way to install it is from the [Chrome Web Store](https://chromewebstore.google.com/detail/ziman-ai-kurdish-translat/cjmmnobnimheoeeojobgfkgbdbohcjkn).

## Install from source

```bash
git clone https://github.com/sadrmanesh/ziman-ai.git
cd ziman-ai
```

1. Open `chrome://extensions/`.
2. Turn on **Developer mode**.
3. Choose **Load unpacked** and select the repository folder (the folder that contains `manifest.json`).
4. Pin the toolbar icon if you want it visible.

Do not load a `.zip` file directly. If you downloaded a zip, unpack it first and select the unpacked folder.

## Try the offline phrasebook

1. Click the Ziman AI toolbar icon.
2. Set the source language to Kurdish (Sorani) and the target to English, or leave the source on Auto detect.
3. Enter `سڵاو` and click Translate.

The result should be **Hello**, labeled as an offline phrasebook answer. That text stays on the device.

The glossary has 105 phrases in Sorani, Kurmanji, English, Persian, and Arabic. Open **Glossary** in the popup to browse by category or search.

## Optional: add an AIML key

Sentences that are not in the phrasebook need your own key from [aimlapi.com](https://aimlapi.com/).

1. Open **Settings** from the popup.
2. Paste the key and save it.
3. Use **Check key** if you want to confirm the key against AIML.

The key is stored with `chrome.storage.local` on this browser. It is not synced and is not included in the extension package. Details are in [AI translation](ai-translation.md) and [Privacy](privacy.md).

## Translate text on a page

Select the text, then either:

- right-click and choose **Translate with Ziman**, or
- press `Alt+Shift+Z`.

See [Shortcuts and context menu](shortcuts.md). The extension does not open when you only click or select text.

## Interface language

The popup and settings can be shown in Kurdish, Persian, or English. Change this in Settings, or with the language button in the popup header.
