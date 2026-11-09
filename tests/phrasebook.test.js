const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const book = require('../lib/phrasebook.js');

describe('offline phrasebook', () => {
    it('ships 105 usable phrases in each of the five languages and nine categories', () => {
        const usable = book.ENTRIES.filter((item) => !item.review);
        assert.equal(usable.length, 105);
        assert.deepEqual(book.counts(), {
            en: 105,
            'ku-sorani': 105,
            'ku-kurmanji': 105,
            fa: 105,
            ar: 105
        });
        assert.equal(book.CATEGORIES.length, 9);
        for (const item of usable) {
            assert.ok(book.CATEGORIES.includes(item.category), item.id);
            for (const lang of book.LANGS) {
                assert.ok(item.forms[lang], `${item.id} missing ${lang}`);
            }
        }
    });

    it('translates a known Sorani greeting offline', () => {
        assert.equal(book.lookup('سڵاو', 'ku-sorani', 'en'), 'Hello');
        assert.equal(book.lookup('Hello', 'en', 'ku-sorani'), 'سڵاو');
        assert.equal(book.lookup('سلام', 'fa', 'ku-kurmanji'), 'Silav');
    });

    it('ignores punctuation and surrounding space in an exact lookup', () => {
        assert.equal(book.lookup('  سڵاو!  ', 'ku-sorani', 'en'), 'Hello');
        assert.equal(book.lookup('How are you?', 'en', 'fa'), 'چطورید؟');
    });

    it('uses aliases such as informal Persian and a Sorani good-night variant', () => {
        assert.equal(book.lookup('چطوری', 'fa', 'en'), 'How are you?');
        assert.equal(book.lookup('شەوی باش', 'ku-sorani', 'en'), 'Good night');
    });

    it('does not use entries marked for native review as answers', () => {
        const review = book.reviewEntries();
        assert.equal(review.length, 4);
        assert.equal(book.lookup('من ناوی من ناسەرە', 'ku-sorani', 'en'), null);
        assert.equal(book.lookup('خوات لەگەڵ', 'ku-sorani', 'en'), null);
        assert.equal(book.lookup('E-peyam', 'ku-kurmanji', 'en'), null);
    });

    it('suggests a close phrase and can translate word by word', () => {
        const suggestion = book.suggest('سوپاسس', 'ku-sorani', 'en');
        assert.ok(suggestion);
        assert.equal(suggestion.translation, 'Thank you');
        const words = book.wordByWord('سوپاس نان', 'ku-sorani', 'en');
        assert.equal(words.known, 2);
        assert.equal(words.translation, 'Thank you Bread');
        assert.equal(book.wordByWord('zzzz qqqq', 'en', 'fa'), null);
    });

    it('filters the glossary by query and category', () => {
        const greetings = book.search('', 'greetings').filter((item) => !item.review);
        assert.ok(greetings.length >= 10);
        assert.ok(greetings.every((item) => item.category === 'greetings'));
        const water = book.search('ئاو', 'food');
        assert.ok(water.some((item) => item.id === 'water'));
    });
});
