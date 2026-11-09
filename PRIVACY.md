# Privacy policy

**Ziman AI**
Version 1.2.3
Last updated: 9 November 2026

## Developer

Naser Sadrmanesh (ناصر صدرمنش)
Website: https://sadrmanesh.github.io/
GitHub: https://github.com/sadrmanesh
Email: info.sadrmanesh@gmail.com
Issues: https://github.com/sadrmanesh/ziman-ai/issues

This policy is also published at https://sadrmanesh.github.io/ziman-ai/privacy/.

## What stays on the device

- Interface language, language pair, tone, pronunciation choice, default target, and result mode are stored with `chrome.storage.sync`.
- Your AIML API key, chosen model name, recent translations, and saved phrases are stored with `chrome.storage.local`. The key is not written to sync storage. If an older version saved a key there, the extension copies it into local storage and removes the synced copy.
- The offline phrasebook is shipped with the extension. A match from the phrasebook is not sent to a server.
- You can clear recent translations in the popup.

## What is sent, and when

The extension does not track usage, does not include analytics, and does not send data to the developer.

Free-form translation and the key check run only after you save a key and ask for that action.

- The extension then sends the text, language names, tone, and model name to `https://api.aimlapi.com` with your key in the `Authorization` header.
- AIML’s handling of that request is covered by their own terms. This extension does not run a backend of its own.
- Selected text is read only after you click Translate, use the context menu, or press the translate shortcut. A page excerpt reads the document title and up to about 1,000 characters of visible text, then follows the same translation path.

## What this extension does not do

- It does not include an API key.
- It does not sell data or use it for advertising.
- It does not download remote code.
- It does not run automatically when you merely click or select text.

## Contact

Privacy questions: info.sadrmanesh@gmail.com or a GitHub issue on this repository.
