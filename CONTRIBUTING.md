# Contributing

Thanks for your interest in Ziman AI.

## Developer

**Naser Sadrmanesh (ناصر صدرمنش)**

- Website: https://sadrmanesh.github.io/
- Repository: https://github.com/sadrmanesh/ziman-ai
- Issues: https://github.com/sadrmanesh/ziman-ai/issues
- Email: info.sadrmanesh@gmail.com

## How to help

- Open an issue for a bug or a phrasebook correction. Include the Chrome version, the language pair, and the exact text when you can.
- Phrasebook changes should be reviewed by a native speaker of the language you are changing. Entries marked for review in `lib/phrasebook.js` are shown in the glossary but are not used as answers until they are confirmed.
- This package targets Google Chrome on desktop (Manifest V3). Do not add unverified claims about other browsers.

## Development

```bash
git clone https://github.com/sadrmanesh/ziman-ai.git
cd ziman-ai
npm test
npm run lint
npm run eval:phrasebook
```

Load the repository folder as an unpacked extension in `chrome://extensions/`.

`tools/preview-shim.js` is only for opening `popup.html` or `options.html` as ordinary files outside Chrome. It is not part of the loaded extension.

## Pull requests

1. Create a branch for the change.
2. Add or update tests when the behavior changes.
3. Run `npm test`, `npm run lint`, and `npm run eval:phrasebook`.
4. Describe the change in the pull request. Do not include private conversation or internal process notes in the repository.
