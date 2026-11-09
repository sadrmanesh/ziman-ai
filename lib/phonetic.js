/**
 * Approximate Sorani pronunciation guide for the offline phrasebook.
 * This is a reading aid, not a linguistic transcription.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    root.ZimanPhonetic = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const PHRASES = {
        'سڵاو': 'slaaw',
        'چۆنی': 'choni',
        'سڵاو، چۆنی؟': 'slaaw, choni?',
        'سوپاس': 'supas',
        'بەڕێز': 'berêz',
        'بەیانی باش': 'beyanî baash',
        'شەوی باش': 'shewî baash',
        'خوات لەگەڵ': 'xwat legell',
        'من ناوی من ناسەرە': 'min nawî min naser e',
        'چۆن دەچیت': 'chon dechit',
        'زۆر باش بوو': 'zor baash bu',
        'بۆ یارمەتیت': 'bo yarmetit'
    };

    const LETTERS = {
        'ا': 'a',
        'ب': 'b',
        'پ': 'p',
        'ت': 't',
        'ج': 'j',
        'چ': 'ch',
        'ح': 'h',
        'خ': 'kh',
        'د': 'd',
        'ر': 'r',
        'ز': 'z',
        'ژ': 'zh',
        'س': 's',
        'ش': 'sh',
        'ع': 'ʿ',
        'غ': 'gh',
        'ف': 'f',
        'ق': 'q',
        'ک': 'k',
        'گ': 'g',
        'ل': 'l',
        'ڵ': 'll',
        'م': 'm',
        'ن': 'n',
        'ه': 'h',
        'ە': 'e',
        'و': 'w',
        'ۆ': 'o',
        'ی': 'i',
        'ێ': 'ê'
    };

    function transliterate(text) {
        const value = String(text || '').trim();
        if (!value) return '';
        if (PHRASES[value]) return PHRASES[value];
        let result = '';
        for (const char of value) {
            result += Object.prototype.hasOwnProperty.call(LETTERS, char) ? LETTERS[char] : char;
        }
        return result;
    }

    return { transliterate, PHRASES };
});
