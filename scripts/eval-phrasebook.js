#!/usr/bin/env node
/**
 * Held-out typed-variant evaluation for phrasebook matching.
 * Reports precision and recall for exact lookup, and coverage of near-miss
 * suggestions, in the spirit of classic IR checks used in llm-search-eval.
 */
const book = require('../lib/phrasebook.js');

const exactCases = [
    { query: 'سڵاو!', source: 'ku-sorani', target: 'en', expected: 'Hello' },
    { query: '  Hello  ', source: 'en', target: 'ku-sorani', expected: 'سڵاو' },
    { query: 'چطوری', source: 'fa', target: 'en', expected: 'How are you?' },
    { query: 'چاي', source: 'ku-sorani', target: 'en', expected: 'Tea' },
    { query: 'يك', source: 'fa', target: 'en', expected: 'One' },
    { query: 'بهیانی باش', source: 'ku-sorani', target: 'en', expected: 'Good morning' },
    { query: 'شەوی باش', source: 'ku-sorani', target: 'en', expected: 'Good night' },
    { query: 'مرحباً', source: 'ar', target: 'en', expected: 'Hello' },
    { query: '۱۲۳'.replace('۱۲۳', 'يك'), source: 'fa', target: 'ku-sorani', expected: 'یەک' },
    { query: 'نان؟', source: 'ku-sorani', target: 'fa', expected: 'نان' },
    { query: 'thank you', source: 'en', target: 'ku-kurmanji', expected: 'Spas' },
    { query: 'SPAS', source: 'ku-kurmanji', target: 'en', expected: 'Thank you' },
    { query: 'مكتب', source: 'ar', target: 'en', expected: 'Office' },
    { query: 'کتاب ها'.replace('کتاب ها', 'دستشویی'), source: 'fa', target: 'en', expected: 'Bathroom' }
];

const suggestCases = [
    { query: 'سوپاسس', source: 'ku-sorani', target: 'en', expected: 'Thank you' },
    { query: 'Good mornng', source: 'en', target: 'ku-sorani', expected: 'بەیانی باش' },
    { query: 'هوتیل', source: 'ku-sorani', target: 'en', expected: 'Hotel' }
];

const negatives = [
    { query: 'من ناوی من ناسەرە', source: 'ku-sorani', target: 'en' },
    { query: 'A sentence that is not in the glossary', source: 'en', target: 'fa' },
    { query: 'zzzz', source: 'en', target: 'ku-sorani' }
];

function scoreExact(cases) {
    let hits = 0;
    const misses = [];
    for (const item of cases) {
        const got = book.lookup(item.query, item.source, item.target);
        if (got === item.expected) hits += 1;
        else misses.push({ ...item, got });
    }
    const recall = hits / cases.length;
    return { hits, total: cases.length, recall, misses };
}

function falsePositives(cases) {
    const bad = [];
    for (const item of cases) {
        const got = book.lookup(item.query, item.source, item.target);
        if (got) bad.push({ ...item, got });
    }
    return bad;
}

const exact = scoreExact(exactCases);
const falseHits = falsePositives(negatives);
const exactPrecisionDenom = exact.hits + falseHits.length;
const exactPrecision = exactPrecisionDenom === 0 ? 1 : exact.hits / exactPrecisionDenom;

let suggestHits = 0;
const suggestMisses = [];
for (const item of suggestCases) {
    if (book.lookup(item.query, item.source, item.target)) {
        suggestMisses.push({ ...item, reason: 'exact-unexpected' });
        continue;
    }
    const suggestion = book.suggest(item.query, item.source, item.target);
    if (suggestion && suggestion.translation === item.expected) suggestHits += 1;
    else suggestMisses.push({ ...item, suggestion });
}

const report = {
    exact: {
        precision: Number(exactPrecision.toFixed(3)),
        recall: Number(exact.recall.toFixed(3)),
        hits: exact.hits,
        total: exact.total,
        falsePositives: falseHits.length,
        misses: exact.misses
    },
    suggestions: {
        recall: Number((suggestHits / suggestCases.length).toFixed(3)),
        hits: suggestHits,
        total: suggestCases.length,
        misses: suggestMisses
    }
};

const text = [
    'Ziman phrasebook evaluation',
    `Exact lookup  precision=${report.exact.precision}  recall=${report.exact.recall}  (${report.exact.hits}/${report.exact.total}, false positives ${report.exact.falsePositives})`,
    `Suggestions   recall=${report.suggestions.recall}  (${report.suggestions.hits}/${report.suggestions.total})`
].join('\n');

console.log(text);
if (exact.misses.length || falseHits.length || suggestMisses.length) {
    console.log(JSON.stringify({ misses: exact.misses, falseHits, suggestMisses }, null, 2));
}

if (report.exact.precision < 1 || report.exact.recall < 1 || report.suggestions.recall < 1) {
    process.exitCode = 1;
}
