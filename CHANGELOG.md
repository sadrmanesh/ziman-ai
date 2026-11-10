# Changelog

## 1.2.3

First release in the `sadrmanesh/ziman-ai` repository.

- Listed on the [Chrome Web Store](https://chromewebstore.google.com/detail/ziman-ai-kurdish-translat/cjmmnobnimheoeeojobgfkgbdbohcjkn).
- Offline phrasebook with 105 phrases in five languages (Kurdish Sorani, Kurdish Kurmanji, English, Persian, Arabic) and nine categories: greetings, travel, directions, emergencies, shopping, food, work, time, and questions.
- Phrase matching normalizes Arabic and Persian letters, digits, diacritics, and common typed variants. Normalization rules are adapted from [persian-rag](https://github.com/sadrmanesh/persian-rag). A “did you mean” suggestion and a labeled word-by-word fallback cover near matches.
- Translation is explicit only: the context menu **Translate with Ziman** (five targets plus last used), `Alt+Shift+Z` for the selection, and `Alt+Shift+X` to cycle the target. The extension does not open when you merely click or select text.
- Results can appear in a small dismissible card beside the selection.
- Optional AI translation with the user’s own AIML API key, stored only in `chrome.storage.local`. Error messages distinguish an invalid key, an empty AIML balance (with a billing link), rate limits, timeouts, and network failures.
- Favorites and a short local history.
- Permissions limited to `activeTab`, `storage`, `contextMenus`, `scripting`, and the host `https://api.aimlapi.com/*`.
