# Offline phrasebook

The phrasebook is shipped with the extension. A match is answered on the device and is not sent to a server.

## Coverage

Version 1.2.3 includes **105** phrases, each with forms in:

- Kurdish Sorani
- Kurdish Kurmanji
- English
- Persian
- Arabic

They are grouped into nine categories: greetings, travel, directions, emergencies, shopping, food, work, time, and questions.

A few additional rows are marked for native-speaker review. Those rows appear in the glossary browser but are not used as translation answers until they are confirmed.

## How a lookup works

1. **Exact match.** The query is normalized and compared with the phrasebook, including a small set of aliases (for example informal Persian «چطوری» for «چطورید؟»).
2. **Suggestion.** If there is no exact match and the query is close enough, the popup can ask “Did you mean…?”.
3. **Word by word.** If several words in the query each have a glossary entry, Ziman can join those glosses and label the result as word-by-word, not a full sentence translation.
4. **Otherwise.** If no key is saved, the extension tells you the phrase is not in the book. If a key is saved, the request can go to AIML, as described in [AI translation](ai-translation.md).

## Normalization

Matching folds common Arabic and Persian letter variants, digits, diacritics, tatweel, compatibility character forms, and typographical punctuation. Spaced or half-space Persian affixes such as «می روم» and «می‌روم» are treated as the same form. Kurdish letters ڵ، ڕ، ێ، and ۆ are kept distinct. For matching only, Kurdish ە is folded to ه, and alef madda (آ) is folded to ا, so ordinary typing variants still hit the book.

These letter-folding rules are adapted from [persian-rag](https://github.com/sadrmanesh/persian-rag) by Naser Sadrmanesh. The matching-oriented folds and the stripping of zero-width non-joiners are documented in `lib/phrasebook.js`.

## Quality check

`npm run eval:phrasebook` runs a held-out set of typed variants and reports precision and recall for exact lookup, plus recall for “did you mean” suggestions. The idea follows the evaluation practice in [llm-search-eval](https://github.com/sadrmanesh/llm-search-eval): measure retrieval quality on a fixed set, and fail the script if the scores drop.

## Pronunciation

The optional pronunciation guide is a reading aid for some Kurdish forms. It is approximate, not a linguistic transcription.

## Browse and save

Open **Glossary** in the popup to search or filter by category. You can save a result to **Saved** and review recent translations in **Recent**. Both lists stay in local browser storage until you clear them.
