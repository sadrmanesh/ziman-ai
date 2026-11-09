const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const book = require('../lib/phrasebook.js');

describe('phrase matching normalization', () => {
    it('unifies Arabic yeh and kaf with their Persian and Kurdish forms', () => {
        assert.equal(book.normalize('يك'), book.normalize('یک'));
        assert.equal(book.lookup('يك', 'fa', 'en'), 'One');
        assert.equal(book.lookup('يک', 'fa', 'en'), 'One');
        assert.equal(book.lookup('چاي', 'ku-sorani', 'en'), 'Tea');
    });

    it('folds hamza alefs, teh marbuta, and waw-with-hamza for matching', () => {
        assert.equal(book.normalize('أحمد'), book.normalize('احمد'));
        assert.equal(book.normalize('مؤمن'), book.normalize('مومن'));
        assert.equal(book.normalize('صلاة'), book.normalize('صلاه'));
        assert.equal(book.normalize('مكتب'), book.normalize('مکتب'));
    });

    it('folds alef madda and Kurdish ە for matching, and keeps Kurdish ڵ ڕ ێ ۆ distinct', () => {
        assert.equal(book.normalize('آب'), book.normalize('اب'));
        assert.equal(book.lookup('بهیانی باش', 'ku-sorani', 'en'), 'Good morning');
        const folded = book.normalize('ڕێگا ڵێ ۆ ێ');
        assert.match(folded, /ڕ/);
        assert.match(folded, /ێ/);
        assert.match(folded, /ڵ/);
        assert.match(folded, /ۆ/);
    });

    it('strips diacritics, tatweel, and bidirectional marks', () => {
        assert.equal(book.normalize('ســـڵاو'), book.normalize('سڵاو'));
        assert.equal(book.lookup('سِڵاو', 'ku-sorani', 'en'), 'Hello');
        assert.equal(book.normalize('\u200bسلام\u200f'), book.normalize('سلام'));
    });

    it('unifies Persian, Arabic-Indic, and ASCII digits', () => {
        assert.equal(book.normalize('۱۲۳'), '123');
        assert.equal(book.normalize('١٢٣'), '123');
        assert.equal(book.normalize('123'), '123');
    });

    it('treats spaced or half-space Persian affixes as the same form', () => {
        assert.equal(book.normalize('می روم'), book.normalize('می‌روم'));
        assert.equal(book.normalize('نمی توانم'), book.normalize('نمی‌توانم'));
        assert.equal(book.normalize('کتاب ها'), book.normalize('کتاب‌ها'));
        assert.equal(book.normalize('ساده ترین'), book.normalize('ساده‌ترین'));
    });

    it('applies Unicode compatibility (NFKC) forms before matching', () => {
        const presentation = '\ufef1\ufedb';
        assert.equal(book.normalize(presentation), book.normalize('یک'));
        assert.equal(book.lookup(presentation, 'fa', 'en'), 'One');
    });

    it('is idempotent for typical queries', () => {
        const samples = ['سڵاو', 'How are you?', 'کتاب‌ها', '١٢٣ سلام؟', 'بهیانی باش'];
        for (const sample of samples) {
            const once = book.normalize(sample);
            assert.equal(book.normalize(once), once);
        }
    });
});
