/**
 * Offline glossary. Exact, fuzzy, and word-by-word results are labeled by the caller.
 * Entries with review:true are shown for native review and are not used as answers.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    root.ZimanPhrasebook = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const LANGS = ['en', 'ku-sorani', 'ku-kurmanji', 'fa', 'ar'];
    const CATEGORIES = ['greetings', 'travel', 'directions', 'emergencies', 'shopping', 'food', 'work', 'time', 'questions'];

    function entry(id, category, forms, phonetic, review) {
        return { id, category, forms, phonetic: phonetic || {}, review: Boolean(review) };
    }

    const ENTRIES = [
        entry('hello', 'greetings', { en: 'Hello', 'ku-sorani': 'سڵاو', 'ku-kurmanji': 'Silav', fa: 'سلام', ar: 'مرحبا' }, { 'ku-sorani': 'slaaw', 'ku-kurmanji': 'silav' }),
        entry('how-are-you', 'greetings', { en: 'How are you?', 'ku-sorani': 'چۆنی؟', 'ku-kurmanji': 'Tu çawa yî?', fa: 'چطورید؟', ar: 'كيف حالك؟' }, { 'ku-sorani': 'choni', 'ku-kurmanji': 'tu chawa yi' }),
        entry('good-morning', 'greetings', { en: 'Good morning', 'ku-sorani': 'بەیانی باش', 'ku-kurmanji': 'Sibeh baş', fa: 'صبح بخیر', ar: 'صباح الخير' }, { 'ku-sorani': 'beyanî bash' }),
        entry('good-night', 'greetings', { en: 'Good night', 'ku-sorani': 'شەو باش', 'ku-kurmanji': 'Şev baş', fa: 'شب بخیر', ar: 'تصبح على خير' }, { 'ku-sorani': 'shew bash' }),
        entry('goodbye', 'greetings', { en: 'Goodbye', 'ku-sorani': 'خواحافیز', 'ku-kurmanji': 'Bi xatirê te', fa: 'خداحافظ', ar: 'مع السلامة' }, { 'ku-sorani': 'xwahafiz' }),
        entry('thank-you', 'greetings', { en: 'Thank you', 'ku-sorani': 'سوپاس', 'ku-kurmanji': 'Spas', fa: 'ممنون', ar: 'شكرا' }, { 'ku-sorani': 'supas', 'ku-kurmanji': 'spas' }),
        entry('please', 'greetings', { en: 'Please', 'ku-sorani': 'تکایە', 'ku-kurmanji': 'Ji kerema xwe', fa: 'لطفا', ar: 'من فضلك' }, { 'ku-sorani': 'tikaye' }),
        entry('yes', 'greetings', { en: 'Yes', 'ku-sorani': 'بەڵێ', 'ku-kurmanji': 'Erê', fa: 'بله', ar: 'نعم' }, { 'ku-sorani': 'belê' }),
        entry('no', 'greetings', { en: 'No', 'ku-sorani': 'نەخێر', 'ku-kurmanji': 'Na', fa: 'نه', ar: 'لا' }, { 'ku-sorani': 'naxêr' }),
        entry('excuse-me', 'greetings', { en: 'Excuse me', 'ku-sorani': 'ببورە', 'ku-kurmanji': 'Bibore', fa: 'ببخشید', ar: 'عفوا' }, { 'ku-sorani': 'bbura' }),

        entry('airport', 'travel', { en: 'Airport', 'ku-sorani': 'فڕۆکەخانە', 'ku-kurmanji': 'Balafirgeh', fa: 'فرودگاه', ar: 'مطار' }),
        entry('station', 'travel', { en: 'Station', 'ku-sorani': 'وێستگە', 'ku-kurmanji': 'Îstasyon', fa: 'ایستگاه', ar: 'محطة' }),
        entry('hotel', 'travel', { en: 'Hotel', 'ku-sorani': 'هوتێل', 'ku-kurmanji': 'Otêl', fa: 'هتل', ar: 'فندق' }),
        entry('taxi', 'travel', { en: 'Taxi', 'ku-sorani': 'تەکسی', 'ku-kurmanji': 'Taksî', fa: 'تاکسی', ar: 'تاكسي' }),
        entry('ticket', 'travel', { en: 'Ticket', 'ku-sorani': 'بلیت', 'ku-kurmanji': 'Bilêt', fa: 'بلیط', ar: 'تذكرة' }),
        entry('passport', 'travel', { en: 'Passport', 'ku-sorani': 'پاسپۆرت', 'ku-kurmanji': 'Pasaport', fa: 'گذرنامه', ar: 'جواز سفر' }),

        entry('where', 'directions', { en: 'Where?', 'ku-sorani': 'لەکوێ؟', 'ku-kurmanji': 'Li ku?', fa: 'کجا؟', ar: 'أين؟' }),
        entry('left', 'directions', { en: 'Left', 'ku-sorani': 'چەپ', 'ku-kurmanji': 'Çep', fa: 'چپ', ar: 'يسار' }),
        entry('right', 'directions', { en: 'Right', 'ku-sorani': 'ڕاست', 'ku-kurmanji': 'Rast', fa: 'راست', ar: 'يمين' }),
        entry('straight', 'directions', { en: 'Straight ahead', 'ku-sorani': 'ڕاستەوخۆ', 'ku-kurmanji': 'Rasterast', fa: 'مستقیم', ar: 'على طول' }),

        entry('help', 'emergencies', { en: 'Help', 'ku-sorani': 'یارمەتی', 'ku-kurmanji': 'Alîkarî', fa: 'کمک', ar: 'مساعدة' }),
        entry('need-help', 'emergencies', { en: 'I need help', 'ku-sorani': 'یارمەتیم پێویستە', 'ku-kurmanji': 'Alîkarî ji min re divê', fa: 'کمک لازم دارم', ar: 'أحتاج مساعدة' }),
        entry('hospital', 'emergencies', { en: 'Hospital', 'ku-sorani': 'نەخۆشخانە', 'ku-kurmanji': 'Nexweşxane', fa: 'بیمارستان', ar: 'مستشفى' }),
        entry('doctor', 'emergencies', { en: 'Doctor', 'ku-sorani': 'پزیشک', 'ku-kurmanji': 'Bijîşk', fa: 'دکتر', ar: 'طبيب' }),
        entry('police', 'emergencies', { en: 'Police', 'ku-sorani': 'پۆلیس', 'ku-kurmanji': 'Polîs', fa: 'پلیس', ar: 'شرطة' }),
        entry('pharmacy', 'emergencies', { en: 'Pharmacy', 'ku-sorani': 'دەرمانخانە', 'ku-kurmanji': 'Dermanxane', fa: 'داروخانه', ar: 'صيدلية' }),

        entry('how-much', 'shopping', { en: 'How much?', 'ku-sorani': 'چەندە؟', 'ku-kurmanji': 'Çiqas e?', fa: 'چند است؟', ar: 'بكم؟' }),
        entry('one', 'shopping', { en: 'One', 'ku-sorani': 'یەک', 'ku-kurmanji': 'Yek', fa: 'یک', ar: 'واحد' }),
        entry('two', 'shopping', { en: 'Two', 'ku-sorani': 'دوو', 'ku-kurmanji': 'Du', fa: 'دو', ar: 'اثنان' }),
        entry('three', 'shopping', { en: 'Three', 'ku-sorani': 'سێ', 'ku-kurmanji': 'Sê', fa: 'سه', ar: 'ثلاثة' }),
        entry('four', 'shopping', { en: 'Four', 'ku-sorani': 'چوار', 'ku-kurmanji': 'Çar', fa: 'چهار', ar: 'أربعة' }),
        entry('five', 'shopping', { en: 'Five', 'ku-sorani': 'پێنج', 'ku-kurmanji': 'Pênc', fa: 'پنج', ar: 'خمسة' }),
        entry('six', 'shopping', { en: 'Six', 'ku-sorani': 'شەش', 'ku-kurmanji': 'Şeş', fa: 'شش', ar: 'ستة' }),
        entry('seven', 'shopping', { en: 'Seven', 'ku-sorani': 'حەوت', 'ku-kurmanji': 'Heft', fa: 'هفت', ar: 'سبعة' }),
        entry('eight', 'shopping', { en: 'Eight', 'ku-sorani': 'هەشت', 'ku-kurmanji': 'Heşt', fa: 'هشت', ar: 'ثمانية' }),
        entry('nine', 'shopping', { en: 'Nine', 'ku-sorani': 'نۆ', 'ku-kurmanji': 'Neh', fa: 'نه', ar: 'تسعة' }),
        entry('ten', 'shopping', { en: 'Ten', 'ku-sorani': 'دە', 'ku-kurmanji': 'Deh', fa: 'ده', ar: 'عشرة' }),

        entry('water', 'food', { en: 'Water', 'ku-sorani': 'ئاو', 'ku-kurmanji': 'Av', fa: 'آب', ar: 'ماء' }),
        entry('bread', 'food', { en: 'Bread', 'ku-sorani': 'نان', 'ku-kurmanji': 'Nan', fa: 'نان', ar: 'خبز' }),
        entry('tea', 'food', { en: 'Tea', 'ku-sorani': 'چای', 'ku-kurmanji': 'Çay', fa: 'چای', ar: 'شاي' }),
        entry('coffee', 'food', { en: 'Coffee', 'ku-sorani': 'قاوە', 'ku-kurmanji': 'Qehwe', fa: 'قهوه', ar: 'قهوة' }),
        entry('restaurant', 'food', { en: 'Restaurant', 'ku-sorani': 'چێشتخانە', 'ku-kurmanji': 'Xwaringeh', fa: 'رستوران', ar: 'مطعم' }),

        entry('work', 'work', { en: 'Work', 'ku-sorani': 'کار', 'ku-kurmanji': 'Kar', fa: 'کار', ar: 'عمل' }),
        entry('office', 'work', { en: 'Office', 'ku-sorani': 'ئۆفیس', 'ku-kurmanji': 'Ofîs', fa: 'دفتر', ar: 'مكتب' }),
        entry('meeting', 'work', { en: 'Meeting', 'ku-sorani': 'کۆبوونەوە', 'ku-kurmanji': 'Civîn', fa: 'جلسه', ar: 'اجتماع' }),

        entry('today', 'time', { en: 'Today', 'ku-sorani': 'ئەمڕۆ', 'ku-kurmanji': 'Îro', fa: 'امروز', ar: 'اليوم' }),
        entry('tomorrow', 'time', { en: 'Tomorrow', 'ku-sorani': 'سبەینێ', 'ku-kurmanji': 'Sibe', fa: 'فردا', ar: 'غدا' }),
        entry('yesterday', 'time', { en: 'Yesterday', 'ku-sorani': 'دوێنێ', 'ku-kurmanji': 'Duh', fa: 'دیروز', ar: 'أمس' }),
        entry('morning', 'time', { en: 'Morning', 'ku-sorani': 'بەیانی', 'ku-kurmanji': 'Sibeh', fa: 'صبح', ar: 'صباح' }),

        entry('what', 'questions', { en: 'What?', 'ku-sorani': 'چی؟', 'ku-kurmanji': 'Çi?', fa: 'چه؟', ar: 'ماذا؟' }),
        entry('when', 'questions', { en: 'When?', 'ku-sorani': 'کەی؟', 'ku-kurmanji': 'Kengî?', fa: 'کی؟', ar: 'متى؟' }),
        entry('why', 'questions', { en: 'Why?', 'ku-sorani': 'بۆچی؟', 'ku-kurmanji': 'Çima?', fa: 'چرا؟', ar: 'لماذا؟' }),
        entry('how', 'questions', { en: 'How?', 'ku-sorani': 'چۆن؟', 'ku-kurmanji': 'Çawa?', fa: 'چطور؟', ar: 'كيف؟' }),
        entry('who', 'questions', { en: 'Who?', 'ku-sorani': 'کێ؟', 'ku-kurmanji': 'Kî?', fa: 'چه کسی؟', ar: 'من؟' }),
        entry('how-many', 'questions', { en: 'How many?', 'ku-sorani': 'چەند؟', 'ku-kurmanji': 'Çend?', fa: 'چند تا؟', ar: 'كم؟' }),

        entry('welcome', 'greetings', { en: 'Welcome', 'ku-sorani': 'بەخێربێیت', 'ku-kurmanji': 'Bi xêr hatî', fa: 'خوش آمدید', ar: 'أهلا وسهلا' }),
        entry('see-you', 'greetings', { en: 'See you later', 'ku-sorani': 'دواتر دەتبینمەوە', 'ku-kurmanji': 'Paşê dibînim', fa: 'بعدا می‌بینمت', ar: 'أراك لاحقا' }),
        entry('youre-welcome', 'greetings', { en: "You're welcome", 'ku-sorani': 'سەرچاو', 'ku-kurmanji': 'Ser çava', fa: 'خواهش می‌کنم', ar: 'عفوا' }),
        entry('sorry', 'greetings', { en: 'I am sorry', 'ku-sorani': 'ببوورە', 'ku-kurmanji': 'Ez bibore', fa: 'متاسفم', ar: 'أنا آسف' }),

        entry('bus', 'travel', { en: 'Bus', 'ku-sorani': 'پاس', 'ku-kurmanji': 'Otobûs', fa: 'اتوبوس', ar: 'حافلة' }),
        entry('train', 'travel', { en: 'Train', 'ku-sorani': 'شەمەندەفەر', 'ku-kurmanji': 'Tren', fa: 'قطار', ar: 'قطار' }),
        entry('car', 'travel', { en: 'Car', 'ku-sorani': 'ئۆتۆمبێل', 'ku-kurmanji': 'Otomobîl', fa: 'ماشین', ar: 'سيارة' }),
        entry('road', 'travel', { en: 'Road', 'ku-sorani': 'ڕێگا', 'ku-kurmanji': 'Rê', fa: 'جاده', ar: 'طريق' }),
        entry('map', 'travel', { en: 'Map', 'ku-sorani': 'نەخشە', 'ku-kurmanji': 'Nexşe', fa: 'نقشه', ar: 'خريطة' }),
        entry('bathroom', 'travel', { en: 'Bathroom', 'ku-sorani': 'توالێت', 'ku-kurmanji': 'Tiwalet', fa: 'دستشویی', ar: 'حمام' }),

        entry('here', 'directions', { en: 'Here', 'ku-sorani': 'لێرە', 'ku-kurmanji': 'Li vir', fa: 'اینجا', ar: 'هنا' }),
        entry('there', 'directions', { en: 'There', 'ku-sorani': 'لەوێ', 'ku-kurmanji': 'Li wir', fa: 'آنجا', ar: 'هناك' }),
        entry('near', 'directions', { en: 'Near', 'ku-sorani': 'نزیک', 'ku-kurmanji': 'Nêzîk', fa: 'نزدیک', ar: 'قريب' }),
        entry('far', 'directions', { en: 'Far', 'ku-sorani': 'دوور', 'ku-kurmanji': 'Dûr', fa: 'دور', ar: 'بعيد' }),
        entry('stop', 'directions', { en: 'Stop', 'ku-sorani': 'بوەستە', 'ku-kurmanji': 'Raweste', fa: 'بایست', ar: 'قف' }),

        entry('pain', 'emergencies', { en: 'Pain', 'ku-sorani': 'ئازار', 'ku-kurmanji': 'Êş', fa: 'درد', ar: 'ألم' }),
        entry('medicine', 'emergencies', { en: 'Medicine', 'ku-sorani': 'دەرمان', 'ku-kurmanji': 'Derman', fa: 'دارو', ar: 'دواء' }),
        entry('ambulance', 'emergencies', { en: 'Ambulance', 'ku-sorani': 'ئامبولانس', 'ku-kurmanji': 'Ambulans', fa: 'آمبولانس', ar: 'سيارة إسعاف' }),
        entry('fever', 'emergencies', { en: 'Fever', 'ku-sorani': 'تا', 'ku-kurmanji': 'Ta', fa: 'تب', ar: 'حمى' }),
        entry('blood', 'emergencies', { en: 'Blood', 'ku-sorani': 'خوێن', 'ku-kurmanji': 'Xwîn', fa: 'خون', ar: 'دم' }),

        entry('money', 'shopping', { en: 'Money', 'ku-sorani': 'پارە', 'ku-kurmanji': 'Pere', fa: 'پول', ar: 'مال' }),
        entry('open', 'shopping', { en: 'Open', 'ku-sorani': 'کراوەیە', 'ku-kurmanji': 'Vekirî ye', fa: 'باز است', ar: 'مفتوح' }),
        entry('closed', 'shopping', { en: 'Closed', 'ku-sorani': 'داخراوە', 'ku-kurmanji': 'Girtî ye', fa: 'بسته است', ar: 'مغلق' }),
        entry('expensive', 'shopping', { en: 'Expensive', 'ku-sorani': 'گرانە', 'ku-kurmanji': 'Biha ye', fa: 'گران است', ar: 'غالي' }),
        entry('cheap', 'shopping', { en: 'Cheap', 'ku-sorani': 'هەرزانە', 'ku-kurmanji': 'Erzan e', fa: 'ارزان است', ar: 'رخيص' }),
        entry('twenty', 'shopping', { en: 'Twenty', 'ku-sorani': 'بیست', 'ku-kurmanji': 'Bîst', fa: 'بیست', ar: 'عشرون' }),
        entry('hundred', 'shopping', { en: 'Hundred', 'ku-sorani': 'سەد', 'ku-kurmanji': 'Sed', fa: 'صد', ar: 'مئة' }),

        entry('rice', 'food', { en: 'Rice', 'ku-sorani': 'برنج', 'ku-kurmanji': 'Birinc', fa: 'برنج', ar: 'أرز' }),
        entry('chicken', 'food', { en: 'Chicken', 'ku-sorani': 'مریشک', 'ku-kurmanji': 'Mirîşk', fa: 'مرغ', ar: 'دجاج' }),
        entry('meat', 'food', { en: 'Meat', 'ku-sorani': 'گۆشت', 'ku-kurmanji': 'Goşt', fa: 'گوشت', ar: 'لحم' }),
        entry('fish', 'food', { en: 'Fish', 'ku-sorani': 'ماسی', 'ku-kurmanji': 'Masî', fa: 'ماهی', ar: 'سمك' }),
        entry('milk', 'food', { en: 'Milk', 'ku-sorani': 'شیر', 'ku-kurmanji': 'Şîr', fa: 'شیر', ar: 'حليب' }),
        entry('egg', 'food', { en: 'Egg', 'ku-sorani': 'هێلکە', 'ku-kurmanji': 'Hêk', fa: 'تخم‌مرغ', ar: 'بيض' }),
        entry('salt', 'food', { en: 'Salt', 'ku-sorani': 'خوێ', 'ku-kurmanji': 'Xwê', fa: 'نمک', ar: 'ملح' }),
        entry('sugar', 'food', { en: 'Sugar', 'ku-sorani': 'شەکر', 'ku-kurmanji': 'Şekir', fa: 'شکر', ar: 'سكر' }),
        entry('hungry', 'food', { en: 'I am hungry', 'ku-sorani': 'برسیمە', 'ku-kurmanji': 'Ez birçî me', fa: 'گرسنه هستم', ar: 'أنا جائع' }),
        entry('thirsty', 'food', { en: 'I am thirsty', 'ku-sorani': 'تینوومە', 'ku-kurmanji': 'Ez tî me', fa: 'تشنه هستم', ar: 'أنا عطشان' }),

        entry('name', 'work', { en: 'Name', 'ku-sorani': 'ناو', 'ku-kurmanji': 'Nav', fa: 'نام', ar: 'اسم' }),
        entry('phone', 'work', { en: 'Phone', 'ku-sorani': 'تەلەفۆن', 'ku-kurmanji': 'Telefon', fa: 'تلفن', ar: 'هاتف' }),
        entry('computer', 'work', { en: 'Computer', 'ku-sorani': 'کۆمپیوتەر', 'ku-kurmanji': 'Komputer', fa: 'کامپیوتر', ar: 'حاسوب' }),
        entry('document', 'work', { en: 'Document', 'ku-sorani': 'بەڵگەنامە', 'ku-kurmanji': 'Belge', fa: 'سند', ar: 'وثيقة' }),

        entry('now', 'time', { en: 'Now', 'ku-sorani': 'ئێستا', 'ku-kurmanji': 'Niha', fa: 'الان', ar: 'الآن' }),
        entry('week', 'time', { en: 'Week', 'ku-sorani': 'هەفتە', 'ku-kurmanji': 'Hefte', fa: 'هفته', ar: 'أسبوع' }),
        entry('month', 'time', { en: 'Month', 'ku-sorani': 'مانگ', 'ku-kurmanji': 'Meh', fa: 'ماه', ar: 'شهر' }),
        entry('year', 'time', { en: 'Year', 'ku-sorani': 'ساڵ', 'ku-kurmanji': 'Sal', fa: 'سال', ar: 'سنة' }),
        entry('hour', 'time', { en: 'Hour', 'ku-sorani': 'کاتژمێر', 'ku-kurmanji': 'Saet', fa: 'ساعت', ar: 'ساعة' }),
        entry('monday', 'time', { en: 'Monday', 'ku-sorani': 'دووشەممە', 'ku-kurmanji': 'Duşem', fa: 'دوشنبه', ar: 'الاثنين' }),
        entry('friday', 'time', { en: 'Friday', 'ku-sorani': 'هەینی', 'ku-kurmanji': 'În', fa: 'جمعه', ar: 'الجمعة' }),
        entry('saturday', 'time', { en: 'Saturday', 'ku-sorani': 'شەممە', 'ku-kurmanji': 'Şemî', fa: 'شنبه', ar: 'السبت' }),
        entry('sunday', 'time', { en: 'Sunday', 'ku-sorani': 'یەکشەممە', 'ku-kurmanji': 'Yekşem', fa: 'یکشنبه', ar: 'الأحد' }),

        entry('review-email-kurmanji', 'work', { en: 'Email', 'ku-kurmanji': 'E-peyam', fa: 'ایمیل', ar: 'بريد إلكتروني' }, {}, true),

        entry('review-goodbye-variant', 'greetings', { en: 'Goodbye', 'ku-sorani': 'خوات لەگەڵ' }, {}, true),
        entry('review-name-sorani', 'greetings', { en: 'My name is Naser', 'ku-sorani': 'من ناوی من ناسەرە' }, {}, true),
        entry('review-name-kurmanji', 'greetings', { en: 'I am Naser', 'ku-kurmanji': 'Ez Naser im' }, {}, true)
    ];

    const ALIASES = [
        { id: 'how-are-you', lang: 'fa', text: 'چطوری' },
        { id: 'how-are-you', lang: 'fa', text: 'چطوری؟' },
        { id: 'how-are-you', lang: 'ku-sorani', text: 'چۆنی' },
        { id: 'good-night', lang: 'ku-sorani', text: 'شەوی باش' },
        { id: 'hello', lang: 'ar', text: 'مرحباً' }
    ];

    /**
     * Normalize a query or phrase for matching.
     *
     * Normalization rules adapted from persian-rag by Naser Sadrmanesh
     * (https://github.com/sadrmanesh/persian-rag, MIT License).
     * Matching-oriented additions, not in persian-rag: Kurdish ە is folded to ه,
     * and alef madda (آ) is folded to ا, so common typed variants still match.
     * Zero-width non-joiners are then stripped, because this function is a
     * matcher, not a display normalizer.
     */
    function normalize(text) {
        let value = String(text || '');
        if (!value) return '';
        if (typeof value.normalize === 'function') {
            value = value.normalize('NFKC');
        }
        value = value.replace(/[\u200b\u200d\u200e\u200f\ufeff\u2060\u202a-\u202e\u2066-\u2069]/g, '');
        value = value.replace(/ي/g, 'ی').replace(/ى/g, 'ی').replace(/ك/g, 'ک');
        value = value.replace(/[أإٱ]/g, 'ا').replace(/ؤ/g, 'و').replace(/ة/g, 'ه');
        value = value.replace(/آ/g, 'ا').replace(/ە/g, 'ه');
        value = value.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
        value = value.replace(/\u0640/g, '');
        value = value.replace(/[۰-۹]/g, (ch) => String(ch.charCodeAt(0) - 0x06F0));
        value = value.replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - 0x0660));
        value = value.replace(/(?<![\w\u200c])(نمی|می|بی)[ \t]*[-‐‑–—−]?[ \t]*(?=[\u0600-\u06FF])/g, '$1\u200c');
        value = value.replace(/(?<=[\u0600-\u06FF])[ \t]+(هایی|های|ها|ترین|تر)(?![\w\u200c])/g, '\u200c$1');
        value = value.replace(/\u200c/g, '');
        value = value.toLowerCase();
        value = value.replace(/[?.!؟،؛,:;"'“”«»()[\]{}]/g, ' ');
        value = value.replace(/\s+/g, ' ').trim();
        return value;
    }

    function usable(item) {
        return item && !item.review;
    }

    function byId(id) {
        return ENTRIES.find((item) => item.id === id) || null;
    }

    function indexForms() {
        const rows = [];
        ENTRIES.forEach((item) => {
            LANGS.forEach((lang) => {
                if (!item.forms[lang]) return;
                rows.push({ item, lang, text: item.forms[lang], key: normalize(item.forms[lang]), alias: false });
            });
        });
        ALIASES.forEach((alias) => {
            const item = byId(alias.id);
            if (!item) return;
            rows.push({ item, lang: alias.lang, text: alias.text, key: normalize(alias.text), alias: true });
        });
        return rows;
    }

    const ROWS = indexForms();

    function langsToSearch(sourceLang, targetLang) {
        if (sourceLang && sourceLang !== 'auto') return [sourceLang];
        return LANGS.filter((lang) => lang !== targetLang);
    }

    function exactRow(text, sourceLang, targetLang) {
        const key = normalize(text);
        if (!key) return null;
        return ROWS.find((row) => {
            return usable(row.item) && row.key === key && langsToSearch(sourceLang, targetLang).includes(row.lang) && row.item.forms[targetLang];
        }) || null;
    }

    function lookup(text, sourceLang, targetLang) {
        const row = exactRow(text, sourceLang, targetLang);
        return row ? row.item.forms[targetLang] : null;
    }

    function phoneticOf(text, sourceLang, targetLang) {
        const row = exactRow(text, sourceLang, targetLang);
        if (!row) return '';
        return row.item.phonetic[row.lang] || row.item.phonetic[sourceLang] || '';
    }

    function levenshtein(a, b) {
        const left = a.slice(0, 80);
        const right = b.slice(0, 80);
        const rows = left.length + 1;
        const cols = right.length + 1;
        const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));
        for (let i = 0; i < rows; i += 1) grid[i][0] = i;
        for (let j = 0; j < cols; j += 1) grid[0][j] = j;
        for (let i = 1; i < rows; i += 1) {
            for (let j = 1; j < cols; j += 1) {
                const cost = left[i - 1] === right[j - 1] ? 0 : 1;
                grid[i][j] = Math.min(grid[i - 1][j] + 1, grid[i][j - 1] + 1, grid[i - 1][j - 1] + cost);
            }
        }
        return grid[left.length][right.length];
    }

    function suggest(text, sourceLang, targetLang) {
        const key = normalize(text);
        if (key.length < 4) return null;
        let best = null;
        ROWS.forEach((row) => {
            if (!usable(row.item) || row.alias || !langsToSearch(sourceLang, targetLang).includes(row.lang) || !row.item.forms[targetLang]) return;
            if (row.key === key) return;
            const distance = levenshtein(key, row.key);
            const score = 1 - distance / Math.max(key.length, row.key.length);
            if (score >= 0.8 && (!best || score > best.score)) {
                best = { score, text: row.text, translation: row.item.forms[targetLang], lang: row.lang };
            }
        });
        return best;
    }

    function wordByWord(text, sourceLang, targetLang) {
        const parts = String(text || '').trim().split(/\s+/).filter(Boolean);
        if (parts.length < 2) return null;
        let known = 0;
        const translated = parts.map((part) => {
            const hit = lookup(part, sourceLang, targetLang);
            if (hit) {
                known += 1;
                return hit.replace(/[?؟]$/, '');
            }
            return part;
        });
        if (!known) return null;
        return { translation: translated.join(' '), known, total: parts.length };
    }

    function search(query, category) {
        const key = normalize(query || '');
        return ENTRIES.filter((item) => {
            if (category && category !== 'all' && item.category !== category) return false;
            if (!key) return true;
            return LANGS.some((lang) => item.forms[lang] && normalize(item.forms[lang]).includes(key));
        });
    }

    function counts() {
        const totals = {};
        LANGS.forEach((lang) => {
            totals[lang] = ENTRIES.filter((item) => item.forms[lang] && !item.review).length;
        });
        return totals;
    }

    function reviewEntries() {
        return ENTRIES.filter((item) => item.review).map((item) => ({
            id: item.id,
            forms: item.forms
        }));
    }

    return {
        LANGS,
        CATEGORIES,
        ENTRIES,
        normalize,
        lookup,
        phoneticOf,
        suggest,
        wordByWord,
        search,
        counts,
        reviewEntries
    };
});
