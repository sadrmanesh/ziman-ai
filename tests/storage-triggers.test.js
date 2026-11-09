const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const storage = require('../lib/storage.js');
const triggers = require('../lib/triggers.js');
const phonetic = require('../lib/phonetic.js');

describe('storage, triggers, and pronunciation', () => {
    it('migrates a legacy sync API key into local storage only', () => {
        assert.deepEqual(
            storage.planApiKeyMigration({ apiKey: '  abc  ' }, {}),
            { removeSyncKey: true, localKey: 'abc' }
        );
        assert.deepEqual(
            storage.planApiKeyMigration({ apiKey: 'old' }, { apiKey: 'local' }),
            { removeSyncKey: true, localKey: null }
        );
        assert.deepEqual(
            storage.planApiKeyMigration({}, { apiKey: 'local' }),
            { removeSyncKey: false, localKey: null }
        );
    });

    it('keeps a short unique history and can add or remove favorites', () => {
        const first = storage.addHistory([], { text: 'سڵاو', translation: 'Hello', sourceLang: 'ku-sorani', targetLang: 'en' });
        const second = storage.addHistory(first, { text: 'سوپاس', translation: 'Thank you', sourceLang: 'ku-sorani', targetLang: 'en' });
        const again = storage.addHistory(second, { text: 'سڵاو', translation: 'Hello', sourceLang: 'ku-sorani', targetLang: 'en' });
        assert.equal(again.length, 2);
        assert.equal(again[0].text, 'سڵاو');
        const favs = storage.addFavorite([], again[0]);
        assert.equal(storage.removeFavorite(favs, again[0]).length, 0);
    });

    it('resolves context-menu targets and cycles the five destination languages', () => {
        assert.deepEqual(triggers.TARGETS, ['ku-sorani', 'ku-kurmanji', 'en', 'fa', 'ar']);
        assert.equal(triggers.nextTarget('ku-sorani'), 'ku-kurmanji');
        assert.equal(triggers.nextTarget('ar'), 'ku-sorani');
        assert.equal(triggers.resolveMenuTarget('ziman-last', 'fa', 'en'), 'fa');
        assert.equal(triggers.resolveMenuTarget('ziman-target-ar', 'en', 'en'), 'ar');
        assert.equal(triggers.normalizeTarget('nope', 'en'), 'en');
        assert.equal(triggers.SHORTCUTS.translate, 'Alt+Shift+Z');
        assert.equal(triggers.SHORTCUTS.cycle, 'Alt+Shift+X');
    });

    it('localizes phrasebook category names', () => {
        const messages = require('../lib/messages.js');
        assert.equal(messages.categoryLabel('en', 'greetings'), 'Greetings');
        assert.equal(messages.categoryLabel('fa', 'emergencies'), 'اورژانس');
        assert.equal(messages.categoryLabel('ku', 'questions'), 'پرسیارەکان');
    });

    it('returns an approximate pronunciation for a known Sorani phrase', () => {
        assert.equal(phonetic.transliterate('سڵاو'), 'slaaw');
        assert.ok(phonetic.transliterate('نان').length > 0);
        assert.equal(phonetic.transliterate(''), '');
    });
});
