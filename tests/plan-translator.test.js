const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const plan = require('../lib/translate-plan.js');
const engine = require('../lib/translator.js');
const book = require('../lib/phrasebook.js');
const AIMLAPI = require('../aiml-api.js');

describe('translation plan and engine', () => {
    it('rejects empty, oversized, and same-language requests before any network call', () => {
        assert.equal(plan.planTranslation({ text: '  ' }).action, 'empty');
        assert.equal(plan.planTranslation({ text: 'x'.repeat(plan.MAX_CHARS + 1) }).action, 'too-long');
        assert.equal(plan.planTranslation({ text: 'hello', sourceLang: 'en', targetLang: 'en' }).action, 'same-language');
    });

    it('prefers the phrasebook and otherwise asks for a key or AIML', () => {
        assert.equal(plan.planTranslation({
            text: 'سڵاو',
            sourceLang: 'ku-sorani',
            targetLang: 'en',
            phrase: 'Hello',
            hasApiKey: false
        }).action, 'phrasebook');
        assert.equal(plan.planTranslation({
            text: 'A unique sentence.',
            sourceLang: 'en',
            targetLang: 'fa',
            phrase: null,
            hasApiKey: false
        }).action, 'needs-key');
        assert.equal(plan.planTranslation({
            text: 'A unique sentence.',
            sourceLang: 'en',
            targetLang: 'fa',
            phrase: null,
            hasApiKey: true
        }).action, 'aiml');
    });

    it('classifies an empty AIML balance as no-credits and never echoes a secret', () => {
        const classified = plan.classifyAimlFailure(403, {
            error: { message: 'You have run out of funds', data: { kind: 'err_insufficent_credits' } }
        });
        assert.equal(classified.code, 'no-credits');
        assert.equal(classified.billingUrl, 'https://aimlapi.com/app/billing/');
        assert.equal(plan.classifyAimlFailure(401, {}).code, 'invalid-key');
        assert.equal(AIMLAPI.classify(403, {
            error: { message: 'You have run out of funds', data: { kind: 'err_insufficent_credits' } }
        }).code, 'no-credits');
        const hidden = plan.safeErrorMessage({ message: 'bad key=SECRET-VALUE' }, 'SECRET-VALUE');
        assert.equal(hidden.includes('SECRET-VALUE'), false);
    });

    it('returns a phrasebook result without calling the AI callback', async () => {
        let called = false;
        const result = await engine.resolveTranslation({
            text: 'سڵاو',
            sourceLang: 'ku-sorani',
            targetLang: 'en',
            hasApiKey: true,
            phrasebook: book,
            plan,
            transliterate: () => 'slaaw',
            includePhonetic: true,
            translateWithAi: async () => {
                called = true;
                return 'should not run';
            }
        });
        assert.equal(called, false);
        assert.equal(result.status, 'ok');
        assert.equal(result.provider, 'phrasebook');
        assert.equal(result.translation, 'Hello');
        assert.equal(result.phonetic, 'slaaw');
    });

    it('falls back to a labeled word-by-word result when no key is saved', async () => {
        const result = await engine.resolveTranslation({
            text: 'سوپاس نان',
            sourceLang: 'ku-sorani',
            targetLang: 'en',
            hasApiKey: false,
            phrasebook: book,
            plan,
            translateWithAi: async () => {
                throw new Error('should not run');
            }
        });
        assert.equal(result.status, 'ok');
        assert.equal(result.provider, 'words');
        assert.equal(result.translation, 'Thank you Bread');
    });

    it('surfaces a suggestion when the phrasebook almost matches and no key is saved', async () => {
        const result = await engine.resolveTranslation({
            text: 'سوپاسس',
            sourceLang: 'ku-sorani',
            targetLang: 'en',
            hasApiKey: false,
            phrasebook: book,
            plan,
            translateWithAi: async () => 'no'
        });
        assert.equal(result.status, 'suggest');
        assert.equal(result.suggestion, 'سوپاس');
    });
});
