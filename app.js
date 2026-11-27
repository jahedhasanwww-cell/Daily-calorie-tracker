(function () {
      'use strict';

      /* ======================== PWA ICON & MANIFEST ======================== */
      const APP_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs><rect width="192" height="192" rx="44" fill="url(#g)"/><path d="M96 34c14 18 22 36 22 56a36 36 0 0 1-36 36 36 36 0 0 1-36-36c0-12 4-24 12-34 0 16 10 24 20 24 8 0 14-18 18-46z" fill="#fff" opacity="0.95"/><path d="M124 88c14 10 24 26 24 44a42 42 0 0 1-42 42H86a42 42 0 0 1-42-42" fill="none" stroke="#a7f3d0" stroke-width="12" stroke-linecap="round"/></svg>';
      const ICON_URI = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(APP_ICON_SVG);

      try {
        document.getElementById('app-favicon').href = ICON_URI;
        document.getElementById('app-apple-icon').href = ICON_URI;
        const manifestObj = {
          name: 'খাবার ও ক্যালরি হিসাব — Daily Calorie Tracker',
          short_name: 'ক্যালরি হিসাব',
          description: 'Bilingual Bangla & English Daily Food and Calorie Tracker',
          start_url: '.',
          display: 'standalone',
          background_color: '#f8fafc',
          theme_color: '#059669',
          icons: [
            { src: ICON_URI, sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
            { src: ICON_URI, sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
          ]
        };
        const blob = new Blob([JSON.stringify(manifestObj)], { type: 'application/manifest+json' });
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = URL.createObjectURL(blob);
        document.head.appendChild(link);
      } catch (e) {}



      /* ======================== VERIFIED PRESET FOODS ======================== */
      const PRESET_FOODS = [
        // Staples & Rice/Bread
        { id: 'rice', nameEn: 'Cooked White Rice', nameBn: 'সাদা ভাত', servingEn: '1 cup (158g)', servingBn: '১ কাপ (১৫৮ গ্রাম)', calories: 205, protein: 4.3, carbs: 44.5, fat: 0.4, emoji: '🍚', cat: 'staple' },
        { id: 'roti', nameEn: 'Roti / Chapati', nameBn: 'আটার রুটি', servingEn: '1 piece (30g)', servingBn: '১টি (৩০ গ্রাম)', calories: 120, protein: 3.0, carbs: 16.0, fat: 4.0, emoji: '🫓', cat: 'staple' },
        { id: 'paratha', nameEn: 'Plain Paratha', nameBn: 'পরোটা', servingEn: '1 piece (100g)', servingBn: '১টি (১০০ গ্রাম)', calories: 320, protein: 7.0, carbs: 45.0, fat: 12.0, emoji: '🥞', cat: 'staple' },
        // Bangladeshi Curries (মাছ, মাংস, ডিম, ডাল ও সবজির তরকারি)
        { id: 'rohu_fish_curry', nameEn: 'Rohu Fish Curry', nameBn: 'রুই মাছের ঝোল', servingEn: '1 bowl (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 120, protein: 8.0, carbs: 5.8, fat: 7.2, emoji: '🐟', cat: 'curry' },
        { id: 'bd_fish_bhuna', nameEn: 'Bangladeshi Fish Bhuna', nameBn: 'দেশি মাছ ভুনা (বোয়াল/রুই)', servingEn: '1 serving (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 126, protein: 12.0, carbs: 1.5, fat: 8.0, emoji: '🐠', cat: 'curry' },
        { id: 'chicken_curry', nameEn: 'Chicken Curry', nameBn: 'মুরগির তরকারি', servingEn: '1 bowl (240g)', servingBn: '১ বাটি (২৪০ গ্রাম)', calories: 260, protein: 16.0, carbs: 16.0, fat: 16.0, emoji: '🍗', cat: 'curry' },
        { id: 'beef_curry', nameEn: 'Beef Bhuna Curry', nameBn: 'গরুর মাংস ভুনা', servingEn: '1 serving (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 250, protein: 19.0, carbs: 6.0, fat: 16.0, emoji: '🥩', cat: 'curry' },
        { id: 'mutton_curry', nameEn: 'Mutton Bhuna Curry', nameBn: 'খাসির মাংস ভুনা', servingEn: '1 serving (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 270, protein: 19.0, carbs: 5.0, fat: 19.0, emoji: '🍖', cat: 'curry' },
        { id: 'egg_curry', nameEn: 'Egg Curry (Dim Bhuna)', nameBn: 'ডিম ভুনা', servingEn: '1 egg + gravy (90g)', servingBn: '১টি ডিম ও ঝোল (৯০ গ্রাম)', calories: 165, protein: 8.5, carbs: 5.5, fat: 12.0, emoji: '🥚', cat: 'curry' },
        { id: 'prawn_curry', nameEn: 'Prawn Curry (Chingri Bhuna)', nameBn: 'চিংড়ি ভুনা', servingEn: '1 serving (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 170, protein: 16.0, carbs: 6.0, fat: 9.0, emoji: '🍤', cat: 'curry' },
        { id: 'dal_thin', nameEn: 'Masoor Dal Curry', nameBn: 'পাতলা মসুর ডাল', servingEn: '1 bowl (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 120, protein: 5.0, carbs: 14.0, fat: 5.0, emoji: '🥣', cat: 'curry' },
        { id: 'dal', nameEn: 'Thick Lentils (Dal)', nameBn: 'ঘন মসুর ডাল', servingEn: '1 cup (198g)', servingBn: '১ কাপ (১৯৮ গ্রাম)', calories: 230, protein: 17.9, carbs: 39.8, fat: 0.8, emoji: '🍲', cat: 'curry' },
        { id: 'potato_curry', nameEn: 'Potato Curry (Aloor Torkari)', nameBn: 'আলুর তরকারি / দম', servingEn: '1 bowl (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 130, protein: 2.5, carbs: 20.0, fat: 4.5, emoji: '🥔', cat: 'curry' },
        { id: 'brinjal_curry', nameEn: 'Brinjal Bhuna / Fry', nameBn: 'বেগুন ভুনা / ভাজি', servingEn: '1 serving (80g)', servingBn: '১ বাটি (৮০ গ্রাম)', calories: 200, protein: 2.0, carbs: 14.0, fat: 15.0, emoji: '🍆', cat: 'curry' },
        { id: 'okra_curry', nameEn: 'Okra Stir-Fry (Dherosh)', nameBn: 'ঢেঁড়স ভাজি / তরকারি', servingEn: '1 bowl (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 110, protein: 2.5, carbs: 10.0, fat: 6.5, emoji: '🥬', cat: 'curry' },
        { id: 'pumpkin_curry', nameEn: 'Pumpkin Curry (Mishti Kumra)', nameBn: 'মিষ্টি কুমড়ার তরকারি', servingEn: '1 bowl (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 120, protein: 2.0, carbs: 16.0, fat: 5.5, emoji: '🎃', cat: 'curry' },
        { id: 'beans_curry', nameEn: 'Green Beans Curry (Shim/Borboti)', nameBn: 'শিম / বরবটি তরকারি', servingEn: '1 bowl (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 100, protein: 3.0, carbs: 11.0, fat: 5.0, emoji: '🫛', cat: 'curry' },
        { id: 'chickpea_curry', nameEn: 'Chickpea Curry (Chola Bhuna)', nameBn: 'ছোলা ভুনা', servingEn: '1 bowl (100g)', servingBn: '১ বাটি (১০০ গ্রাম)', calories: 160, protein: 7.5, carbs: 22.0, fat: 4.5, emoji: '🫘', cat: 'curry' },
        // Rice Meals & Specials
        { id: 'fish_rice', nameEn: 'Fish Curry with Rice', nameBn: 'মাছের ঝোল ও ভাত', servingEn: '1 cup (200g)', servingBn: '১ কাপ (২০০ গ্রাম)', calories: 214, protein: 8.1, carbs: 30.4, fat: 6.7, emoji: '🍛', cat: 'meal' },
        { id: 'chicken_rice', nameEn: 'Chicken Curry with Rice', nameBn: 'ভাত ও মুরগির তরকারি', servingEn: '1 cup (200g)', servingBn: '১ কাপ (২০০ গ্রাম)', calories: 230, protein: 10.0, carbs: 30.0, fat: 8.0, emoji: '🍛', cat: 'meal' },
        { id: 'biryani', nameEn: 'Chicken Biryani', nameBn: 'চিকেন বিরিয়ানি', servingEn: '1 plate (350g)', servingBn: '১ প্লেট (৩৫০ গ্রাম)', calories: 660, protein: 28.0, carbs: 82.0, fat: 24.0, emoji: '🍚', cat: 'meal' },
        { id: 'kabsa', nameEn: 'Chicken Kabsa', nameBn: 'চিকেন কাবসা', servingEn: '1 plate (350g)', servingBn: '১ প্লেট (৩৫০ গ্রাম)', calories: 623, protein: 32.0, carbs: 77.0, fat: 21.0, emoji: '🥘', cat: 'meal' },
        { id: 'shawarma', nameEn: 'Chicken Shawarma Wrap', nameBn: 'চিকেন শর্মা র‍্যাপ', servingEn: '1 wrap', servingBn: '১টি র‍্যাপ', calories: 282, protein: 26.0, carbs: 30.0, fat: 6.4, emoji: '🌯', cat: 'meal' },
        // Snacks, Breakfast, Drinks & Fruits
        { id: 'egg', nameEn: 'Hard Boiled Egg', nameBn: 'সেদ্ধ ডিম', servingEn: '1 large (50g)', servingBn: '১টি বড় (৫০ গ্রাম)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, emoji: '🥚', cat: 'snack' },
        { id: 'oatmeal', nameEn: 'Cooked Oatmeal', nameBn: 'ওটস (রান্না করা)', servingEn: '1 cup (234g)', servingBn: '১ কাপ (২৩৪ গ্রাম)', calories: 166, protein: 5.9, carbs: 28.1, fat: 3.6, emoji: '🥣', cat: 'snack' },
        { id: 'milk_tea', nameEn: 'Milk Tea (With Sugar)', nameBn: 'দুধ চা (চিনিসহ)', servingEn: '1 cup (150ml)', servingBn: '১ কাপ (১৫০ মিলি)', calories: 90, protein: 2.5, carbs: 13.0, fat: 3.0, emoji: '☕', cat: 'snack' },
        { id: 'plain_tea', nameEn: 'Plain Tea (No Sugar)', nameBn: 'রং চা (চিনি ছাড়া)', servingEn: '1 cup (150ml)', servingBn: '১ কাপ (১৫০ মিলি)', calories: 2, protein: 0.0, carbs: 0.5, fat: 0.0, emoji: '🍵', cat: 'snack' },
        { id: 'banana', nameEn: 'Banana', nameBn: 'কলা', servingEn: '1 medium (118g)', servingBn: '১টি মাঝারি (১১৮ গ্রাম)', calories: 105, protein: 1.3, carbs: 27.0, fat: 0.4, emoji: '🍌', cat: 'snack' },
        { id: 'apple', nameEn: 'Apple', nameBn: 'আপেল', servingEn: '1 serving', servingBn: '১টি আপেল', calories: 65, protein: 0.3, carbs: 17.3, fat: 0.2, emoji: '🍎', cat: 'snack' }
      ];

      /* ======================== I18N STRINGS ======================== */
      const I18N = {
        bn: {
          title: 'খাবার ও ক্যালরি হিসাব',
          subtitle: 'দৈনিক খাদ্য ও ক্যালরি ট্র্যাকার',
          installShort: 'ইনস্টল',
          langBtn: 'EN',
          todayBadge: 'আজ',
          kcalUnit: 'ক্যালরি',
          dailyGoal: 'দৈনিক লক্ষ্য',
          remaining: 'বাকি আছে',
          overBy: 'বেশি হয়েছে',
          overWarning: 'আজকের ক্যালরি লক্ষ্য অতিক্রম করেছে (+{n} kcal)',
          protein: 'প্রোটিন',
          carbs: 'কার্বস',
          fat: 'ফ্যাট',
          waterTitle: 'পানি পান',
          waterStatus: '{c} / {g} গ্লাস ({ml} ml)',
          todayMealsHeading: '🍽️ আজকের খাওয়া খাবার',
          todayMealsBadge: '{n}টি খাবার · {cal} kcal',
          quickAdd: '✨ দ্রুত যোগ করার সাজেশন',
          quickAddSub: 'যেকোনো খাবারে ট্যাপ করলে উপরের আজকের খাবারে যোগ হবে',
          seeAll: 'সব খাবার →',
          meals: {
            breakfast: { name: 'সকালের নাস্তা', icon: '🌅' },
            lunch: { name: 'দুপুরের খাবার', icon: '☀️' },
            snacks: { name: 'বিকেলের নাস্তা', icon: '🍎' },
            dinner: { name: 'রাতের খাবার', icon: '🌙' }
          },
          addBtn: '+ যোগ',
          emptyMeal: 'এখনো কোনো খাবার যোগ করা হয়নি',
          selectMeal: 'কোন বেলার খাবার?',
          foodLibrary: 'জনপ্রিয় খাবার তালিকা',
          usdaNote: 'USDA ও স্ট্যান্ডার্ড মান',
          searchPlaceholder: 'খাবার খুঁজুন (যেমন: ভাত, ডিম, কাবসা)...',
          qtySelect: 'পরিমাণ:',
          logBtn: '+ যোগ',
          noFoodMatch: 'কোনো খাবার খুঁজে পাওয়া যায়নি',
          customTitle: 'নিজের খাবার যোগ করুন',
          cfName: 'খাবারের নাম *',
          cfNamePh: 'যেমন: মাছের ঝোল / রুই মাছ',
          cfCal: 'ক্যালরি (kcal) *',
          cfServing: 'পরিমাণ',
          cfServingPh: '১ বাটি / ১ পিস',
          cfPro: 'প্রোটিন (g)',
          cfCarb: 'কার্বস (g)',
          cfFat: 'ফ্যাট (g)',
          cfSaveLib: 'ভবিষ্যতের জন্য আমার তালিকায় সেভ রাখুন',
          cfSubmit: 'আজকের হিসাবে যোগ করুন',
          kpiAvg: '৭ দিনের গড়',
          kpiKcal: 'kcal/দিন',
          kpiOnTarget: 'লক্ষ্যের মধ্যে',
          kpiDays: 'দিন',
          kpiWater: 'মোট পানি (৭ দিন)',
          kpiGlasses: 'গ্লাস',
          chartWeekly: 'গত ৭ দিনের ক্যালরি চার্ট',
          chartMacro: 'নির্বাচিত দিনের ম্যাক্রো অনুপাত',
          macroEmpty: 'ম্যাক্রো চার্ট দেখতে এই দিনে অন্তত একটি খাবার যোগ করুন।',
          recentDays: 'সাম্প্রতিক দিনের ইতিহাস',
          noHistory: 'এখনো কোনো দিনের হিসাব সেভ হয়নি।',
          calcTitle: 'স্মার্ট ক্যালরি লক্ষ্য ক্যালকুলেটর',
          calcSub: 'আপনার বয়স, ওজন ও উচ্চতা অনুযায়ী দৈনিক ক্যালরি হিসাব করুন',
          gender: 'লিঙ্গ',
          age: 'বয়স (বছর)',
          weight: 'ওজন (কেজি)',
          height: 'উচ্চতা (সেমি)',
          activity: 'কাজের ধরন',
          goalType: 'লক্ষ্য',
          calcApply: 'হিসাব করে লক্ষ্য সেট করুন',
          manualGoals: 'দৈনিক লক্ষ্য পরিবর্তন করুন',
          mgCal: 'ক্যালরি (kcal)',
          mgWater: 'পানি (গ্লাস)',
          mgSave: 'লক্ষ্য সেভ করুন',
          androidCardTitle: 'Android মোবাইলে অ্যাপ হিসেবে ইনস্টল করুন',
          androidCardDesc: 'হোম স্ক্রিনে অ্যাপ আইকন হিসেবে যোগ করলে অফলাইনেও দ্রুত ব্যবহার করতে পারবেন।',
          androidCardBtn: 'ইনস্টল করার নিয়ম দেখুন / ইনস্টল করুন',
          dataTitle: 'ব্যাকআপ ও ডেটা ম্যানেজমেন্ট',
          exportCsv: 'CSV ডাউনলোড',
          exportJson: 'JSON ব্যাকআপ',
          importJson: 'JSON রিস্টোর',
          clearToday: 'আজকের হিসাব মুছুন',
          navToday: 'আজ',
          navAdd: 'খাবার যোগ',
          navReports: 'রিপোর্ট',
          navSettings: 'সেটিংস',
          installModalTitle: 'Android-এ অ্যাপ ইনস্টল করুন',
          installStepsHtml:
            '<p class="font-semibold text-emerald-700 dark:text-emerald-400">১. GitHub Pages বা HTTPS লিংকে ফাইলটি খুলুন:</p>' +
            '<p>আপনার Android ফোনের <b>Google Chrome</b> ব্রাউজারে এই HTML ফাইলটি (যেমন GitHub Pages-এ আপলোড করে) ওপেন করুন।</p>' +
            '<p class="font-semibold text-emerald-700 dark:text-emerald-400 pt-1">২. হোম স্ক্রিনে ইনস্টল করুন:</p>' +
            '<p>Chrome-এর উপরের ডানদিকে <b>⋮ (মেনু)</b> বাটনে ট্যাপ করে <b>"Add to Home screen"</b> বা <b>"Install app"</b> সিলেক্ট করুন।</p>' +
            '<p class="font-semibold text-emerald-700 dark:text-emerald-400 pt-1">৩. আসল অ্যাপের মতো ব্যবহার করুন:</p>' +
            '<p>ফোনের হোম স্ক্রিনে <b>ক্যালরি হিসাব</b> আইকন চলে আসবে এবং ফুল-স্ক্রিনে চলবে।</p>',
          installNowBtn: 'এখনই Android-এ ইনস্টল করুন',
          modalOk: 'বুঝেছি',
          confirmClearTitle: 'আজকের হিসাব মুছবেন?',
          confirmClearMsg: 'নির্বাচিত দিনের সব খাবার ও পানির হিসাব মুছে যাবে।',
          cancel: 'বাতিল',
          confirmDelete: 'হ্যাঁ, মুছুন',
          toastAdded: 'যোগ হয়েছে: {name} (+{cal} kcal)',
          toastDeleted: 'খাবারটি মুছে ফেলা হয়েছে',
          toastGoalSaved: 'দৈনিক লক্ষ্য সেভ হয়েছে ({cal} kcal)',
          toastCleared: 'নির্বাচিত দিনের হিসাব মুছে ফেলা হয়েছে',
          toastExported: 'ফাইল ডাউনলোড হয়েছে',
          toastImported: 'ব্যাকআপ সফলভাবে রিস্টোর হয়েছে',
          toastImportErr: 'ভুল JSON ফাইল',
          customTag: 'আমার খাবার',
          chartLabelConsumed: 'খাওয়া ক্যালরি',
          chartLabelGoal: 'দৈনিক লক্ষ্য',
          camCtaTitle: '📷 ছবি তুলে ক্যালরি হিসাব করুন',
          camCtaSub: 'খাবারের ছবি তুললে ক্যালরি, প্রোটিন, কার্বস ও ফ্যাট হিসাব করে খাবার হিসেবে যোগ হবে',
          camBtnToday: 'ক্যামেরা',
          camBtnAdd: '📷 ছবি তুলে অটো ক্যালরি হিসাব করুন',
          camModalTitle: '📷 ছবির ক্যালরি বিশ্লেষণ',
          camAnalyzing: 'AI দিয়ে খাবার ও ক্যালরি বিশ্লেষণ করা হচ্ছে...',
          camAiSuccess: '✨ AI ছবি বিশ্লেষণ সম্পন্ন! চাইলে মান পরিবর্তন করে যোগ করুন।',
          camOfflineMode: '⚡ কুইক ফটো মোড: নিচ থেকে খাবার বেছে নিন বা মান দিন।',
          camAiError: '⚠️ AI সংযোগ ব্যর্থ — নিচ থেকে খাবার বেছে নিন বা মান দিন।',
          camAddKeyLink: 'AI Key দিন',
          camQuickMatch: 'ছবির সাথে মিলিয়ে খাবার বেছে নিন (অথবা নিচে এডিট করুন):',
          camMealLbl: 'কোন বেলা',
          camScaleLbl: 'অংশ (Portion):',
          camSaveLib: 'আমার খাবারের তালিকায় সেভ রাখুন',
          camRetake: '📷 আবার তুলুন',
          camSubmit: '✅ খাবার হিসেবে যোগ করুন',
          aiKeyTitle: '📷 AI ক্যামেরা সেটিংস (Gemini API)',
          aiKeyDesc: 'ছবি দেখে অটো খাবার ও ক্যালরি চিনতে ফ্রি Google Gemini API Key দিন (শুধু আপনার ফোনে সেভ থাকবে)।',
          aiKeySave: 'সেভ',
          aiKeyActive: '✅ AI ক্যামেরা চালু আছে (Gemini Vision সক্রিয়)',
          aiKeyEmpty: 'ℹ️ API Key দেওয়া নেই — ক্যামেরা কুইক ফটো মোডে কাজ করবে।',
          toastKeySaved: 'Gemini API Key সেভ হয়েছে — AI ক্যামেরা চালু!',
          toastKeyCleared: 'API Key মুছে ফেলা হয়েছে',
          chooserTitle: 'ছবি কীভাবে নেবেন?',
          pickCamera: 'ক্যামেরা খুলুন',
          pickGallery: 'গ্যালারি থেকে নিন',
          liveCamTitle: '📷 খাবারের ছবি তুলুন',
          flipCam: '🔄 ঘোরান',
          liveGalleryBtn: '🖼️ গ্যালারি',
          liveNativeCam: '📱 ফোন ক্যামেরা',
          aiKeyTest: 'টেস্ট',
          aiTesting: '⏳ API Key পরীক্ষা করা হচ্ছে...',
          aiTestOk: '✅ সংযোগ সফল! সক্রিয় মডেল: {model}',
          aiTestFail: '❌ সংযোগ ব্যর্থ: {reason}',
          camNetBlocked: '⚠️ নেটওয়ার্ক ব্লকড (Preview-এর বদলে Chrome বা GitHub Pages-এ ওপেন করুন)।',
          fbTitle: '☁️ Firebase ক্লাউড সিঙ্ক',
          fbDesc: 'Firebase Auth ও Firestore দিয়ে সব ডিভাইসে লাইভ ডেটা সিঙ্ক করুন।',
          fbOffline: 'অফলাইন',
          fbReady: 'লগইন করুন',
          fbConnected: 'সিঙ্ক চালু',
          fbGoogle: 'Google দিয়ে সাইন ইন করুন',
          fbLogin: 'লগইন',
          fbSignup: 'নতুন অ্যাকাউন্ট',
          fbLogout: 'লগআউট',
          fbSyncNow: '🔄 এখনই ক্লাউডে সিঙ্ক করুন',
          fbCfgSummary: '⚙️ Firebase Config সেটআপ করুন',
          fbCfgHint: 'Firebase Console → Project Settings → Web App থেকে আপনার firebaseConfig JSON এখানে পেস্ট করুন:',
          fbSaveCfg: 'কানেক্ট ও সেভ',
          fbResetCfg: 'রিসেট',
          fbSyncedAt: 'সর্বশেষ সিঙ্ক: ',
          fbToastSynced: 'Firebase ক্লাউডে ডেটা সিঙ্ক হয়েছে!',
          fbToastCfgOk: 'Firebase কানেক্ট হয়েছে! এখন সাইন ইন করুন।',
          fbToastCfgErr: 'সঠিক Firebase Config JSON দিন (apiKey ও projectId থাকতে হবে)।',
          loginSub: 'আপনার জিমেইল দিয়ে লগইন করে সব ডেটা ক্লাউডে নিরাপদ রাখুন',
          loginGoogleBtn: 'জিমেইল (Google) দিয়ে লগইন করুন',
          loginOr: 'অথবা ইমেইল ও পাসওয়ার্ড',
          loginPassPh: 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)',
          loginBtn: 'লগইন করুন',
          loginGuest: 'লগইন ছাড়াই অ্যাপে প্রবেশ করুন →',
          loginFbSetup: '⚙️ Firebase Config সেটআপ (প্রথমবার)',
          loginFbConnect: 'Firebase কানেক্ট করুন',
          loginNeedFb: 'জিমেইল লগইনের জন্য নিচের "Firebase Config সেটআপ"-এ আপনার Firebase Config পেস্ট করুন।',
          themePickerTitle: '🎨 থিম ও ব্যাকগ্রাউন্ড',
          openLoginPageBtn: '🔐 লগইন পেজ',
          menuTitle: 'মেনু',
          menuLang: 'ভাষা / Language',
          menuTheme: 'থিম ও ডার্ক মোড',
          menuAccent: '🎨 কালার সিলেক্ট করুন (১০টি)',
          changePhoto: '📷 ছবি পরিবর্তন',
          removePhoto: 'মুছুন',
          toastPhotoUpdated: 'প্রোফাইল ছবি সেভ হয়েছে!',
          toastPhotoRemoved: 'প্রোফাইল ছবি মুছে ফেলা হয়েছে',
          burnTitle: 'ব্যায়াম / ক্যালরি বার্ন',
          burnStatus: 'আজ বার্ন: {n} kcal',
          burnInline: 'kcal',
          eatenCol: 'খাওয়া',
          burnedCol: 'বার্ন',
          copySummaryBtn: '📋 রিপোর্ট কপি',
          copyYesterdayBtn: '📋 গতকালের সব খাবার আজ কপি করুন',
          toastCopiedSummary: 'আজকের ক্যালরি রিপোর্ট কপি হয়েছে!',
          toastCopiedYesterday: 'গতকালের {n}টি খাবার আজ কপি হয়েছে!',
          weightTitle: '⚖️ ওজন ট্র্যাকার',
          weightLatest: 'সর্বশেষ ওজন: {w} kg',
          weightEmpty: 'গ্রাফ দেখতে আজকের ওজন (kg) লিখে সেভ করুন।',
          toastWeightSaved: 'ওজন সেভ হয়েছে ({w} kg)',
          editModalTitle: '✎ খাবার এডিট করুন',
          editSaveBtn: 'আপডেট সেভ করুন',
          toastEntryUpdated: 'খাবারটি আপডেট হয়েছে',
          streakText: '🔥 {n} দিন',
          bmiUnder: 'কম ওজন (Underweight)',
          bmiNormal: 'স্বাভাবিক (Normal)',
          bmiOver: 'বাড়তি ওজন (Overweight)',
          bmiObese: 'স্থূলতা (Obese)',
          pickBarcode: 'প্যাকেটের বারকোড স্ক্যান (১০০% ফ্রি)',
          barcodeTitle: '🏷️ ফ্রি বারকোড স্ক্যানার',
          barcodeHint: 'প্যাকেটের বারকোডটি ফ্রেমের ভেতরে ধরুন...',
          barcodePh: 'অথবা বারকোড নম্বর লিখুন (যেমন: 628100...)',
          barcodeSearch: 'খুঁজুন',
          barcodeSearching: '⏳ Open Food Facts থেকে তথ্য খোঁজা হচ্ছে...',
          barcodeNotFound: '⚠️ এই বারকোডটি ডেটাবেসে পাওয়া যায়নি—ছবি তুলে AI স্ক্যান করুন।',
          barcodeSuccess: '🏷️ বারকোড থেকে আসল পুষ্টিগুণ পাওয়া গেছে!',
          aiKeyBothTitle: '📷 AI ক্যামেরা কী (Groq ফ্রি + Gemini)',
          aiKeyBothDesc: 'দুটো কী-ই একসাথে কাজ করে (একটি ব্যর্থ হলে অন্যটি অটো-ব্যাকআপ হিসেবে চলবে)। শুধু আপনার প্রাইভেট অ্যাকাউন্টে সেভ থাকবে।',
          aiKeyActiveList: '✅ সক্রিয় AI: {list}',
          prodCheckTitle: '🏷️ বারকোড দিয়ে পণ্যের দাম ও বিস্তারিত যাচাই',
          prodCheckDesc: 'যেকোনো পণ্যের বারকোড স্ক্যান বা নম্বর লিখে তার দাম, ব্র্যান্ড ও বিস্তারিত দেখুন (১০০% ফ্রি)।',
          prodScanBtn: 'ক্যামেরা দিয়ে বারকোড স্ক্যান করুন',
          prodInputPh: 'বারকোড নম্বর লিখুন...',
          prodVerifyBtn: 'যাচাই করুন',
          prodSearching: '⏳ পণ্যের বিস্তারিত ও দাম খোঁজা হচ্ছে...',
          prodNotFound: '⚠️ ওপেন ডেটাবেসে এই বারকোডের তথ্য পাওয়া যায়নি। নিচে Google-এ সার্চ করতে পারেন।',
          prodPriceLbl: '💰 রেকর্ডকৃত দাম:',
          prodNoPrice: 'ডেটাবেসে স্থানীয় দাম যুক্ত নেই',
          prodGooglePrice: '🔍 Google-এ দাম ও বিস্তারিত দেখুন',
          aiManageBtn: '⚙️ কী সেটআপ',
          aiLockLabel: '🔒 কী লক করে রাখুন (এডিট বন্ধ থাকবে)',
          aiLockBadge: '🔒 লক',
          toastKeysLocked: 'API Key লক করা হয়েছে 🔒',
          toastKeysUnlocked: 'API Key আনলক করা হয়েছে — এখন পরিবর্তন করতে পারবেন 🔓',
          cfAutoBtn: 'নাম ও ওজন দিয়ে অটো ক্যালরি ও ফ্যাট হিসাব করুন',
          cfAutoNeedName: 'আগে খাবারের নাম লিখুন (যেমন: ভাত 200g বা রুই মাছ 150g)',
          cfAutoLoading: '⏳ ক্যালরি, প্রোটিন, কার্বস ও ফ্যাট হিসাব করা হচ্ছে...',
          cfAutoDone: '✅ অটো হিসাব সম্পন্ন ({src})! এখন নিচের বাটনে ট্যাপ করে যোগ করুন।',
          cfAutoNotFound: '⚠️ অটো হিসাব পাওয়া যায়নি—নিজে ক্যালরি বসান অথবা সেটিংসে Groq/Gemini কী দিন।',
          contactTitle: '📞 যোগাযোগ করুন'
        },
        en: {
          title: 'Daily Calorie Tracker',
          subtitle: 'Food, Macros & Water Log',
          installShort: 'Install',
          langBtn: 'বাংলা',
          todayBadge: 'Today',
          kcalUnit: 'kcal',
          dailyGoal: 'Daily Goal',
          remaining: 'Remaining',
          overBy: 'Over Goal',
          overWarning: 'Daily calorie goal exceeded (+{n} kcal)',
          protein: 'Protein',
          carbs: 'Carbs',
          fat: 'Fat',
          waterTitle: 'Water Intake',
          waterStatus: '{c} / {g} glasses ({ml} ml)',
          todayMealsHeading: '🍽️ Today\'s Logged Meals',
          todayMealsBadge: '{n} items · {cal} kcal',
          quickAdd: '✨ Quick-Add Recommendations',
          quickAddSub: 'Tap any suggestion below to add it to Today\'s Logged Meals above',
          seeAll: 'All Foods →',
          meals: {
            breakfast: { name: 'Breakfast', icon: '🌅' },
            lunch: { name: 'Lunch', icon: '☀️' },
            snacks: { name: 'Snacks', icon: '🍎' },
            dinner: { name: 'Dinner', icon: '🌙' }
          },
          addBtn: '+ Add',
          emptyMeal: 'No food logged yet',
          selectMeal: 'Select Meal',
          foodLibrary: 'Popular Foods Library',
          usdaNote: 'USDA & Standard values',
          searchPlaceholder: 'Search foods (e.g. Rice, Egg, Kabsa)...',
          qtySelect: 'Serving:',
          logBtn: '+ Log',
          noFoodMatch: 'No matching foods found',
          customTitle: 'Add Custom Food',
          cfName: 'Food Name *',
          cfNamePh: 'e.g. Grilled Fish / Fish Curry',
          cfCal: 'Calories (kcal) *',
          cfServing: 'Serving Size',
          cfServingPh: '1 bowl / 1 piece',
          cfPro: 'Protein (g)',
          cfCarb: 'Carbs (g)',
          cfFat: 'Fat (g)',
          cfSaveLib: 'Save to My Foods for 1-tap reuse',
          cfSubmit: 'Add to Daily Log',
          kpiAvg: '7-Day Avg',
          kpiKcal: 'kcal/day',
          kpiOnTarget: 'On Target',
          kpiDays: 'days',
          kpiWater: 'Total Water (7d)',
          kpiGlasses: 'glasses',
          chartWeekly: 'Last 7 Days Calorie Trend',
          chartMacro: 'Selected Day Macro Split',
          macroEmpty: 'Log at least one food on this day to see the macro breakdown.',
          recentDays: 'Recent Logged Days',
          noHistory: 'No logged days yet.',
          calcTitle: 'Smart Daily Calorie Calculator',
          calcSub: 'Estimate your daily target from age, weight & height',
          gender: 'Gender',
          age: 'Age (yrs)',
          weight: 'Weight (kg)',
          height: 'Height (cm)',
          activity: 'Activity',
          goalType: 'Goal',
          calcApply: 'Calculate & Apply Goal',
          manualGoals: 'Edit Daily Goals',
          mgCal: 'Calories (kcal)',
          mgWater: 'Water (glasses)',
          mgSave: 'Save Goals',
          androidCardTitle: 'Install on Android as an App',
          androidCardDesc: 'Add to your Android home screen for full-screen standalone access.',
          androidCardBtn: 'Install / View Android Steps',
          dataTitle: 'Backup & Data Management',
          exportCsv: 'Download CSV',
          exportJson: 'JSON Backup',
          importJson: 'Restore JSON',
          clearToday: 'Clear Selected Day',
          navToday: 'Today',
          navAdd: 'Add Food',
          navReports: 'Reports',
          navSettings: 'Settings',
          installModalTitle: 'Install on Android',
          installStepsHtml:
            '<p class="font-semibold text-emerald-700 dark:text-emerald-400">1. Open via HTTPS (e.g. GitHub Pages):</p>' +
            '<p>Open this single HTML file in <b>Google Chrome</b> on your Android phone (for example, hosted on GitHub Pages).</p>' +
            '<p class="font-semibold text-emerald-700 dark:text-emerald-400 pt-1">2. Add to Home Screen:</p>' +
            '<p>Tap the <b>⋮ menu</b> in the top-right corner of Chrome and select <b>"Install app"</b> or <b>"Add to Home screen"</b>.</p>' +
            '<p class="font-semibold text-emerald-700 dark:text-emerald-400 pt-1">3. Launch Like a Native App:</p>' +
            '<p>The <b>Calorie Tracker</b> icon will appear on your home screen and open full-screen with saved local data.</p>',
          installNowBtn: 'Install App Now',
          modalOk: 'Got it',
          confirmClearTitle: 'Clear selected day?',
          confirmClearMsg: 'This will remove all food entries and water count for this date.',
          cancel: 'Cancel',
          confirmDelete: 'Yes, Clear',
          toastAdded: 'Logged: {name} (+{cal} kcal)',
          toastDeleted: 'Entry removed',
          toastGoalSaved: 'Daily goals updated ({cal} kcal)',
          toastCleared: 'Selected day cleared',
          toastExported: 'File downloaded',
          toastImported: 'Backup restored successfully',
          toastImportErr: 'Invalid JSON backup file',
          customTag: 'My Food',
          chartLabelConsumed: 'Consumed',
          chartLabelGoal: 'Daily Goal',
          camCtaTitle: '📷 Scan Food Photo for Calories',
          camCtaSub: 'Take a photo to calculate calories, protein, carbs & fat and log it as a food',
          camBtnToday: 'Camera',
          camBtnAdd: '📷 Scan Food Photo to Calculate Calories',
          camModalTitle: '📷 Food Photo Analysis',
          camAnalyzing: 'Analyzing food & calories with AI...',
          camAiSuccess: '✨ AI photo analysis complete! Review or adjust and add.',
          camOfflineMode: '⚡ Quick Photo Mode: tap a matching food below or enter values.',
          camAiError: '⚠️ AI lookup failed — pick a food below or adjust values.',
          camAddKeyLink: 'Add AI Key',
          camQuickMatch: 'Quick-match from photo (or edit values below):',
          camMealLbl: 'Meal',
          camScaleLbl: 'Portion:',
          camSaveLib: 'Save to My Foods library',
          camRetake: '📷 Retake',
          camSubmit: '✅ Add as Food',
          aiKeyTitle: '📷 AI Camera Settings (Gemini API)',
          aiKeyDesc: 'Add a free Google Gemini API Key for automatic food recognition from photos (stored only on your device).',
          aiKeySave: 'Save',
          aiKeyActive: '✅ AI Camera active (Gemini Vision enabled)',
          aiKeyEmpty: 'ℹ️ No API key set — camera runs in Quick Photo Mode.',
          toastKeySaved: 'Gemini API Key saved — AI Camera enabled!',
          toastKeyCleared: 'API Key removed',
          chooserTitle: 'Choose Photo Source',
          pickCamera: 'Open Camera',
          pickGallery: 'Pick from Gallery',
          liveCamTitle: '📷 Take Food Photo',
          flipCam: '🔄 Flip',
          liveGalleryBtn: '🖼️ Gallery',
          liveNativeCam: '📱 Phone Camera',
          aiKeyTest: 'Test',
          aiTesting: '⏳ Testing API Key...',
          aiTestOk: '✅ Connected! Active model: {model}',
          aiTestFail: '❌ Connection failed: {reason}',
          camNetBlocked: '⚠️ Network blocked (open in Chrome or GitHub Pages instead of Preview).',
          fbTitle: '☁️ Firebase Cloud Sync',
          fbDesc: 'Sync your daily food logs & goals across devices with Firebase Auth + Firestore.',
          fbOffline: 'Offline',
          fbReady: 'Sign In',
          fbConnected: 'Synced',
          fbGoogle: 'Sign in with Google',
          fbLogin: 'Log In',
          fbSignup: 'Sign Up',
          fbLogout: 'Log Out',
          fbSyncNow: '🔄 Sync to Cloud Now',
          fbCfgSummary: '⚙️ Configure Firebase',
          fbCfgHint: 'Paste your firebaseConfig JSON from Firebase Console → Project Settings → Web App:',
          fbSaveCfg: 'Connect & Save',
          fbResetCfg: 'Reset',
          fbSyncedAt: 'Last synced: ',
          fbToastSynced: 'Synced to Firebase Cloud!',
          fbToastCfgOk: 'Firebase connected! Please sign in.',
          fbToastCfgErr: 'Please enter valid Firebase config JSON (needs apiKey & projectId).',
          loginSub: 'Sign in with Gmail to sync your daily food & calorie log across devices',
          loginGoogleBtn: 'Continue with Google (Gmail)',
          loginOr: 'Or email & password',
          loginPassPh: 'Password (min 6 chars)',
          loginBtn: 'Log In',
          loginGuest: 'Continue without Login (Guest) →',
          loginFbSetup: '⚙️ Firebase Config Setup (First Time)',
          loginFbConnect: 'Connect Firebase',
          loginNeedFb: 'Paste your Firebase Config in "Firebase Config Setup" below to enable Gmail sign-in.',
          themePickerTitle: '🎨 Theme & Background',
          openLoginPageBtn: '🔐 Login Page',
          menuTitle: 'Menu',
          menuLang: 'Language',
          menuTheme: 'Theme & Dark Mode',
          menuAccent: '🎨 Accent Color (10)',
          changePhoto: '📷 Change Photo',
          removePhoto: 'Remove',
          toastPhotoUpdated: 'Profile photo updated!',
          toastPhotoRemoved: 'Profile photo removed',
          burnTitle: 'Exercise / Burned',
          burnStatus: 'Burned today: {n} kcal',
          burnInline: 'kcal',
          eatenCol: 'Eaten',
          burnedCol: 'Burned',
          copySummaryBtn: '📋 Copy Report',
          copyYesterdayBtn: '📋 Copy Yesterday\'s Meals to Today',
          toastCopiedSummary: 'Daily summary copied to clipboard!',
          toastCopiedYesterday: 'Copied {n} meals from yesterday!',
          weightTitle: '⚖️ Weight Tracker',
          weightLatest: 'Latest weight: {w} kg',
          weightEmpty: 'Log your weight (kg) to see your progress trend.',
          toastWeightSaved: 'Weight logged ({w} kg)',
          editModalTitle: '✎ Edit Food Entry',
          editSaveBtn: 'Save Changes',
          toastEntryUpdated: 'Entry updated',
          streakText: '🔥 {n}d',
          bmiUnder: 'Underweight',
          bmiNormal: 'Healthy Weight',
          bmiOver: 'Overweight',
          bmiObese: 'Obese',
          pickBarcode: 'Scan Package Barcode (100% Free)',
          barcodeTitle: '🏷️ Free Barcode Scanner',
          barcodeHint: 'Align the product barcode inside the frame...',
          barcodePh: 'Or type barcode number (e.g. 628100...)',
          barcodeSearch: 'Lookup',
          barcodeSearching: '⏳ Searching Open Food Facts...',
          barcodeNotFound: '⚠️ Barcode not found in database — try AI Photo Scan.',
          barcodeSuccess: '🏷️ Exact nutrition loaded from Barcode!',
          aiKeyBothTitle: '📷 AI Camera Keys (Free Groq + Gemini)',
          aiKeyBothDesc: 'Both work together with automatic fallback (stored privately in your Firebase account).',
          aiKeyActiveList: '✅ Active AI: {list}',
          prodCheckTitle: '🏷️ Product Barcode & Price Checker',
          prodCheckDesc: 'Scan or type any product barcode to check its price, brand & details (100% Free).',
          prodScanBtn: 'Scan Product Barcode with Camera',
          prodInputPh: 'Enter barcode number...',
          prodVerifyBtn: 'Check',
          prodSearching: '⏳ Looking up product details & prices...',
          prodNotFound: '⚠️ Product not found in open database. You can search on Google below.',
          prodPriceLbl: '💰 Recorded Prices:',
          prodNoPrice: 'No local price recorded yet',
          prodGooglePrice: '🔍 Search Price & Info on Google',
          aiManageBtn: '⚙️ Manage Keys',
          aiLockLabel: '🔒 Lock keys (prevent edits)',
          aiLockBadge: '🔒 Locked',
          toastKeysLocked: 'API Keys locked 🔒',
          toastKeysUnlocked: 'API Keys unlocked for editing 🔓',
          cfAutoBtn: 'Auto-Calculate Calories & Macros from Name + Weight',
          cfAutoNeedName: 'Enter a food name first (e.g. Rice 200g or Fish Curry 150g)',
          cfAutoLoading: '⏳ Calculating calories, protein, carbs & fat...',
          cfAutoDone: '✅ Auto-calculated ({src})! Review and tap Add to Daily Log.',
          cfAutoNotFound: '⚠️ Could not auto-calculate — enter calories manually or add a free Groq/Gemini key.',
          contactTitle: '📞 Contact'
        }
      };

      /* ======================== DATE & STORAGE HELPERS ======================== */
      const STORAGE_KEY = 'cal_tracker_v1';

      function getLocalDateStr(offsetDays) {
        const d = new Date();
        if (offsetDays) d.setDate(d.getDate() + offsetDays);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
      }

      function shiftDateStr(dateStr, delta) {
        const parts = dateStr.split('-').map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        d.setDate(d.getDate() + delta);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
      }

      function formatDisplayDate(dateStr, lang) {
        const today = getLocalDateStr(0);
        const yesterday = getLocalDateStr(-1);
        const parts = dateStr.split('-').map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const formatted = d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        if (dateStr === today) return (lang === 'bn' ? 'আজ, ' : 'Today, ') + formatted;
        if (dateStr === yesterday) return (lang === 'bn' ? 'গতকাল, ' : 'Yesterday, ') + formatted;
        return formatted;
      }

      function loadState() {
        const defaults = {
          lang: 'bn',
          theme: 'glass',
          selectedDate: getLocalDateStr(0),
          activeTab: 'today',
          selectedMeal: 'lunch',
          selectedQty: 1,
          selectedCat: 'all',
          goals: { calories: 2000, protein: 100, carbs: 250, fat: 65, water: 8 },
          logsByDate: {},
          customFoods: [],
          geminiApiKey: '',
          firebaseConfig: null,
          customAvatar: '',
          weightLog: {},
          accent: 'emerald',
          groqApiKey: '',
          aiKeysLocked: false,
          reminderOn: false,
          reminderTime: '20:30'
        };
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return defaults;
          const parsed = JSON.parse(raw);
          return {
            ...defaults,
            lang: parsed.lang === 'en' ? 'en' : 'bn',
            theme: ['light', 'dark', 'glass', 'dark-glass', 'neumorph', 'clay'].indexOf(parsed.theme) !== -1 ? parsed.theme : 'glass',
            goals: { ...defaults.goals, ...(parsed.goals || {}) },
            logsByDate: parsed.logsByDate && typeof parsed.logsByDate === 'object' ? parsed.logsByDate : {},
            customFoods: Array.isArray(parsed.customFoods) ? parsed.customFoods : [],
            geminiApiKey: typeof parsed.geminiApiKey === 'string' ? parsed.geminiApiKey : '',
            firebaseConfig: parsed.firebaseConfig && typeof parsed.firebaseConfig === 'object' ? parsed.firebaseConfig : null,
            customAvatar: typeof parsed.customAvatar === 'string' ? parsed.customAvatar : '',
            weightLog: parsed.weightLog && typeof parsed.weightLog === 'object' ? parsed.weightLog : {},
            accent: typeof parsed.accent === 'string' ? parsed.accent : 'emerald',
            groqApiKey: typeof parsed.groqApiKey === 'string' ? parsed.groqApiKey : '',
            aiKeysLocked: Boolean(parsed.aiKeysLocked),
            reminderOn: Boolean(parsed.reminderOn),
            reminderTime: typeof parsed.reminderTime === 'string' ? parsed.reminderTime : '20:30'
          };
        } catch (e) {
          return defaults;
        }
      }

      const state = loadState();
      let weeklyChartInstance = null;
      let macroChartInstance = null;
      let weightChartInstance = null;
      let confirmCallback = null;
      let toastTimer = null;

      function saveState() {
        try {
          const payload = {
            lang: state.lang,
            theme: state.theme,
            goals: state.goals,
            logsByDate: state.logsByDate,
            customFoods: state.customFoods,
            geminiApiKey: state.geminiApiKey || '',
            firebaseConfig: state.firebaseConfig || null,
            customAvatar: state.customAvatar || '',
            weightLog: state.weightLog || {},
            accent: state.accent || 'emerald',
            groqApiKey: state.groqApiKey || '',
            aiKeysLocked: Boolean(state.aiKeysLocked),
            reminderOn: Boolean(state.reminderOn),
            reminderTime: state.reminderTime || '20:30'
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {}
        scheduleCloudPush();
      }

      function getDayLog(dateStr) {
        if (!state.logsByDate[dateStr]) {
          state.logsByDate[dateStr] = { entries: [], water: 0, burned: 0 };
        }
        return state.logsByDate[dateStr];
      }

      function getDayTotals(dateStr) {
        const log = state.logsByDate[dateStr];
        if (!log || !Array.isArray(log.entries)) {
          return { calories: 0, protein: 0, carbs: 0, fat: 0, water: log ? (log.water || 0) : 0, burned: log ? (log.burned || 0) : 0 };
        }
        return log.entries.reduce(function (acc, item) {
          acc.calories += Number(item.calories) || 0;
          acc.protein += Number(item.protein) || 0;
          acc.carbs += Number(item.carbs) || 0;
          acc.fat += Number(item.fat) || 0;
          return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0, water: log.water || 0, burned: log.burned || 0 });
      }

      function computeStreak() {
        let streak = 0;
        let checkDate = getLocalDateStr(0);
        // If today has no entries yet, start streak check from yesterday
        const todayLog = state.logsByDate[checkDate];
        if (!todayLog || !todayLog.entries || todayLog.entries.length === 0) {
          checkDate = getLocalDateStr(-1);
        }
        const frozenSet = Array.isArray(state.frozenDates) ? state.frozenDates : [];
        for (let i = 0; i < 365; i++) {
          const l = state.logsByDate[checkDate];
          const hasEntries = l && Array.isArray(l.entries) && l.entries.length > 0;
          const isFrozen = frozenSet.indexOf(checkDate) !== -1;
          if (hasEntries || isFrozen) {
            streak++;
            checkDate = shiftDateStr(checkDate, -1);
          } else {
            break;
          }
        }
        return streak;
      }

      function t(key) {
        return I18N[state.lang][key];
      }

      function showToast(msg) {
        const el = document.getElementById('toast');
        el.textContent = msg;
        el.classList.remove('opacity-0');
        el.classList.add('opacity-100');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
          el.classList.remove('opacity-100');
          el.classList.add('opacity-0');
        }, 2300);
      }

      function openConfirm(title, msg, onConfirm, okLabel, okTone) {
        confirmCallback = onConfirm;
        document.getElementById('confirm-modal-title').textContent = title;
        document.getElementById('confirm-modal-msg').textContent = msg;
        document.getElementById('btn-confirm-cancel').textContent = t('cancel');
        const okBtn = document.getElementById('btn-confirm-ok');
        okBtn.textContent = okLabel || t('confirmDelete');
        if (okTone === 'emerald') {
          okBtn.className = 'py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition';
        } else {
          okBtn.className = 'py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition';
        }
        const m = document.getElementById('confirm-modal');
        m.classList.remove('hidden');
        m.classList.add('flex');
      }

      function closeConfirm() {
        confirmCallback = null;
        const m = document.getElementById('confirm-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }

      function escapeHtml(str) {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      /* ======================== MUTATIONS ======================== */
      function confirmBeforeAddFood(food, meal, qty, extraAction) {
        const mult = Number(qty) > 0 ? Number(qty) : 1;
        const nm = state.lang === 'bn' ? (food.nameBn || food.nameEn) : (food.nameEn || food.nameBn);
        const cal = Math.round((Number(food.calories) || 0) * mult);
        const mMeta = t('meals')[meal || state.selectedMeal];
        const mName = mMeta ? mMeta.name : '';
        const title = state.lang === 'bn' ? 'খাবারটি যোগ করবেন?' : 'Add this food?';
        const msg = state.lang === 'bn'
          ? '"' + nm + '" (+' + cal + ' kcal) কি ' + mName + '-এ যোগ করতে চান?'
          : 'Add "' + nm + '" (+' + cal + ' kcal) to ' + mName + '?';
        const okLbl = state.lang === 'bn' ? 'হ্যাঁ, যোগ করুন' : 'Yes, Add';
        openConfirm(title, msg, function () {
          if (typeof extraAction === 'function') extraAction();
          else logFoodItem(food, meal, mult);
        }, okLbl, 'emerald');
      }

      function logFoodItem(food, meal, qty) {
        const mult = Number(qty) > 0 ? Number(qty) : 1;
        const day = getDayLog(state.selectedDate);
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const entry = {
          id: 'e_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
          nameEn: food.nameEn,
          nameBn: food.nameBn || food.nameEn,
          meal: meal || state.selectedMeal,
          qty: mult,
          servingEn: food.servingEn || '1 serving',
          servingBn: food.servingBn || food.servingEn || '১ পরিবেশন',
          calories: Math.round((Number(food.calories) || 0) * mult),
          protein: Math.round((Number(food.protein) || 0) * mult * 10) / 10,
          carbs: Math.round((Number(food.carbs) || 0) * mult * 10) / 10,
          fat: Math.round((Number(food.fat) || 0) * mult * 10) / 10,
          time: timeStr,
          photo: food.photo || '',
          emoji: food.emoji || ''
        };
        day.entries.push(entry);
        saveState();
        renderAll();
        const displayName = state.lang === 'bn' ? entry.nameBn : entry.nameEn;
        showToast(t('toastAdded').replace('{name}', displayName).replace('{cal}', entry.calories));
      }

      function deleteEntry(entryId) {
        const day = getDayLog(state.selectedDate);
        day.entries = day.entries.filter(function (e) { return e.id !== entryId; });
        saveState();
        renderAll();
        showToast(t('toastDeleted'));
      }

      function normalizeExactFoodName(name) {
        return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase();
      }

      function addCustomFoodUnique(foodObj) {
        const newNameEn = normalizeExactFoodName(foodObj.nameEn);
        const newNameBn = normalizeExactFoodName(foodObj.nameBn || foodObj.nameEn);
        const newBarcode = String(foodObj.barcode || '').trim();
        const allExisting = state.customFoods.concat(PRESET_FOODS);

        const isDup = allExisting.some(function (f) {
          // 1. Exact same barcode
          if (newBarcode && f.barcode && String(f.barcode).trim() === newBarcode) {
            return true;
          }
          // 2. Strict exact same full name (never blocks partial/different-ending names!)
          const exEn = normalizeExactFoodName(f.nameEn);
          const exBn = normalizeExactFoodName(f.nameBn);
          return (newNameEn && (newNameEn === exEn || newNameEn === exBn)) ||
                 (newNameBn && (newNameBn === exEn || newNameBn === exBn));
        });

        if (isDup) return false;
        state.customFoods.unshift(foodObj);
        return true;
      }

      function deleteCustomFood(foodId) {
        state.customFoods = state.customFoods.filter(function (f) { return f.id !== foodId; });
        saveState();
        renderFoodLibrary();
      }

      function haptic(ms) {
        try { if (navigator.vibrate) navigator.vibrate(ms || 25); } catch (e) {}
      }

      function triggerWaterBottleAnim() {
        const box = document.getElementById('water-bottle-box');
        if (!box) return;
        box.classList.remove('water-pop');
        void box.offsetWidth;
        box.classList.add('water-pop');
      }

      function adjustWater(delta) {
        haptic(delta > 0 ? 35 : 18);
        const day = getDayLog(state.selectedDate);
        day.water = Math.max(0, (day.water || 0) + delta);
        saveState();
        renderToday();
        if (delta > 0) triggerWaterBottleAnim();
      }

      function switchTab(tabName) {
        state.activeTab = tabName;
        ['today', 'add', 'reports', 'settings'].forEach(function (name) {
          const sec = document.getElementById('view-' + name);
          if (name === tabName) {
            sec.classList.remove('hidden', 'page-enter-slide');
            void sec.offsetWidth;
            sec.classList.add('page-enter-slide');
          } else {
            sec.classList.add('hidden');
            sec.classList.remove('page-enter-slide');
          }
        });
        document.querySelectorAll('.nav-btn').forEach(function (btn) {
          const isActive = btn.getAttribute('data-tab') === tabName;
          btn.classList.toggle('text-emerald-600', isActive);
          btn.classList.toggle('dark:text-emerald-400', isActive);
          btn.classList.toggle('font-bold', isActive);
          btn.classList.toggle('nav-active', isActive);
          btn.classList.toggle('text-slate-500', !isActive);
          btn.classList.toggle('dark:text-slate-400', !isActive);
          btn.classList.toggle('font-medium', !isActive);
        });
        if (tabName === 'reports') {
          renderReports();
        } else if (tabName === 'settings') {
          syncGoalInputs();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      /* ======================== RENDERERS ======================== */
      const ACCENT_PALETTES = [
        { id: 'emerald', name: 'Emerald', c400: '#34d399', c500: '#10b981', c600: '#059669', c700: '#047857', soft: 'rgba(16,185,129,0.16)', on: '#ffffff', dot: '#10b981' },
        { id: 'sky',     name: 'Sky',     c400: '#38bdf8', c500: '#0ea5e9', c600: '#0284c7', c700: '#0369a1', soft: 'rgba(14,165,233,0.16)', on: '#ffffff', dot: '#0ea5e9' },
        { id: 'indigo',  name: 'Indigo',  c400: '#818cf8', c500: '#6366f1', c600: '#4f46e5', c700: '#4338ca', soft: 'rgba(99,102,241,0.16)', on: '#ffffff', dot: '#6366f1' },
        { id: 'violet',  name: 'Violet',  c400: '#a78bfa', c500: '#8b5cf6', c600: '#7c3aed', c700: '#6d28d9', soft: 'rgba(139,92,246,0.16)', on: '#ffffff', dot: '#8b5cf6' },
        { id: 'rose',    name: 'Rose',    c400: '#fb7185', c500: '#f43f5e', c600: '#e11d48', c700: '#be123c', soft: 'rgba(244,63,94,0.16)',  on: '#ffffff', dot: '#f43f5e' },
        { id: 'orange',  name: 'Orange',  c400: '#fb923c', c500: '#f97316', c600: '#ea580c', c700: '#c2410c', soft: 'rgba(249,115,22,0.16)', on: '#ffffff', dot: '#f97316' },
        { id: 'amber',   name: 'Amber',   c400: '#fbbf24', c500: '#f59e0b', c600: '#d97706', c700: '#b45309', soft: 'rgba(245,158,11,0.16)', on: '#ffffff', dot: '#f59e0b' },
        { id: 'teal',    name: 'Teal',    c400: '#2dd4bf', c500: '#14b8a6', c600: '#0d9488', c700: '#0f766e', soft: 'rgba(20,184,166,0.16)', on: '#ffffff', dot: '#14b8a6' },
        { id: 'red',     name: 'Crimson', c400: '#f87171', c500: '#ef4444', c600: '#dc2626', c700: '#b91c1c', soft: 'rgba(239,68,68,0.16)',  on: '#ffffff', dot: '#ef4444' },
        { id: 'white',   name: 'White',   c400: '#e2e8f0', c500: '#94a3b8', c600: '#f8fafc', c700: '#e2e8f0', soft: 'rgba(148,163,184,0.22)', on: '#0f172a', dot: '#ffffff' }
      ];

      function applyAccent() {
        const pal = ACCENT_PALETTES.find(function (p) { return p.id === state.accent; }) || ACCENT_PALETTES[0];
        const root = document.documentElement;
        root.style.setProperty('--acc-400', pal.c400);
        root.style.setProperty('--acc-500', pal.c500);
        root.style.setProperty('--acc-600', pal.c600);
        root.style.setProperty('--acc-700', pal.c700);
        root.style.setProperty('--acc-soft', pal.soft);
        root.style.setProperty('--acc-on', pal.on);
        document.body.classList.toggle('accent-custom', pal.id !== 'emerald');
        document.body.classList.toggle('accent-white', pal.id === 'white');

        const s1 = document.getElementById('ring-stop-1');
        const s2 = document.getElementById('ring-stop-2');
        if (s1) s1.setAttribute('stop-color', pal.c400);
        if (s2) s2.setAttribute('stop-color', pal.id === 'white' ? '#cbd5e1' : pal.c600);

        const sw = document.getElementById('menu-accent-swatches');
        if (sw) {
          sw.innerHTML = ACCENT_PALETTES.map(function (p) {
            const active = p.id === pal.id;
            const ringCls = active ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-110' : 'hover:scale-105';
            const borderCls = p.id === 'white' ? 'border-2 border-slate-300 dark:border-slate-500' : 'border border-black/10';
            return '<button type="button" data-set-accent="' + p.id + '" title="' + p.name + '" aria-label="' + p.name + '" class="w-9 h-9 mx-auto rounded-full shadow-sm transition flex items-center justify-center ' + borderCls + ' ' + ringCls + '" style="background:' + p.dot + ';">' +
              (active ? '<span class="text-xs font-black" style="color:' + (p.id === 'white' ? '#0f172a' : '#ffffff') + ';">✓</span>' : '') +
            '</button>';
          }).join('');
        }
      }

      function applyTheme() {
        const isDark = state.theme === 'dark' || state.theme === 'dark-glass' || state.theme === 'cyberpunk';
        document.documentElement.classList.toggle('dark', isDark);
        document.body.classList.remove('theme-glass', 'theme-dark-glass', 'theme-neumorph', 'theme-clay', 'theme-cyberpunk', 'theme-nature');
        if (state.theme === 'glass') document.body.classList.add('theme-glass');
        if (state.theme === 'dark-glass') document.body.classList.add('theme-dark-glass');
        if (state.theme === 'neumorph') document.body.classList.add('theme-neumorph');
        if (state.theme === 'clay') document.body.classList.add('theme-clay');
        if (state.theme === 'cyberpunk') document.body.classList.add('theme-cyberpunk');
        if (state.theme === 'nature') document.body.classList.add('theme-nature');
        document.querySelectorAll('.theme-pill').forEach(function (btn) {
          const act = btn.getAttribute('data-set-theme') === state.theme;
          btn.classList.toggle('bg-emerald-600', act);
          btn.classList.toggle('text-white', act);
          btn.classList.toggle('border-emerald-600', act);
          btn.classList.toggle('bg-slate-50', !act);
          btn.classList.toggle('dark:bg-slate-800', !act);
          btn.classList.toggle('text-slate-700', !act);
          btn.classList.toggle('dark:text-slate-200', !act);
        });
        applyAccent();
      }



      function renderStaticLabels() {
        document.documentElement.lang = state.lang;
        document.getElementById('app-title').textContent = t('title');
        document.getElementById('app-subtitle').textContent = t('subtitle');
        document.getElementById('lbl-menu-title').textContent = t('menuTitle');
        document.getElementById('lbl-menu-lang').textContent = t('menuLang');
        document.getElementById('lbl-menu-theme').textContent = t('menuTheme');
        document.getElementById('lbl-menu-accent').textContent = t('menuAccent');
        document.getElementById('btn-menu-change-photo').textContent = t('changePhoto');
        document.getElementById('btn-menu-remove-photo').textContent = t('removePhoto');
        document.getElementById('btn-menu-sync').textContent = t('fbSyncNow');
        document.getElementById('btn-menu-logout').textContent = '🚪 ' + t('fbLogout');
        document.getElementById('lbl-burn-title').textContent = t('burnTitle');
        document.getElementById('lbl-eaten-col').textContent = t('eatenCol');
        document.getElementById('lbl-burned-col').textContent = t('burnedCol');
        document.getElementById('btn-copy-summary').textContent = t('copySummaryBtn');
        document.getElementById('btn-copy-yesterday').textContent = t('copyYesterdayBtn');
        document.getElementById('lbl-weight-tracker').textContent = t('weightTitle');
        document.getElementById('btn-save-weight').textContent = t('aiKeySave');
        document.getElementById('lbl-edit-modal-title').textContent = t('editModalTitle');
        document.getElementById('lbl-edit-name').textContent = t('cfName');
        document.getElementById('lbl-edit-meal').textContent = t('camMealLbl');
        document.getElementById('lbl-edit-serving').textContent = t('cfServing');
        document.getElementById('btn-edit-save').textContent = t('editSaveBtn');
        const editMealSel = document.getElementById('edit-meal');
        const mMeta2 = t('meals');
        ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(function (k, idx) {
          if (editMealSel && editMealSel.options[idx]) editMealSel.options[idx].textContent = mMeta2[k].icon + ' ' + mMeta2[k].name;
        });
        const bnBtn = document.getElementById('btn-menu-lang-bn');
        const enBtn = document.getElementById('btn-menu-lang-en');
        bnBtn.className = 'py-2 rounded-xl text-xs font-bold border transition ' + (state.lang === 'bn' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700');
        enBtn.className = 'py-2 rounded-xl text-xs font-bold border transition ' + (state.lang === 'en' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700');
        document.getElementById('btn-jump-today').textContent = t('todayBadge');
        document.getElementById('ring-kcal-unit').textContent = t('kcalUnit');
        document.getElementById('lbl-daily-goal').textContent = t('dailyGoal');
        document.getElementById('lbl-protein').textContent = t('protein');
        document.getElementById('lbl-carbs').textContent = t('carbs');
        document.getElementById('lbl-fat').textContent = t('fat');
        document.getElementById('lbl-water-title').textContent = t('waterTitle');
        document.getElementById('lbl-today-meals-heading').textContent = t('todayMealsHeading');
        document.getElementById('lbl-quick-add').textContent = t('quickAdd');
        document.getElementById('lbl-quick-add-sub').textContent = t('quickAddSub');
        document.getElementById('btn-see-all-foods').textContent = t('seeAll');

        document.getElementById('lbl-select-meal').textContent = t('selectMeal');
        document.getElementById('lbl-food-library').textContent = t('foodLibrary');
        document.getElementById('lbl-usda-note').textContent = t('usdaNote');
        document.getElementById('food-search-input').placeholder = t('searchPlaceholder');
        document.getElementById('lbl-qty-select').textContent = t('qtySelect');
        document.getElementById('lbl-custom-food-title').textContent = t('customTitle');
        document.getElementById('lbl-cf-name').textContent = t('cfName');
        document.getElementById('cf-name').placeholder = t('cfNamePh');
        document.getElementById('lbl-cf-cal').textContent = t('cfCal');
        document.getElementById('lbl-cf-serving').textContent = t('cfServing');
        document.getElementById('cf-serving').placeholder = t('cfServingPh');
        document.getElementById('lbl-cf-protein').textContent = t('cfPro');
        document.getElementById('lbl-cf-carbs').textContent = t('cfCarb');
        document.getElementById('lbl-cf-fat').textContent = t('cfFat');
        document.getElementById('lbl-cf-save-lib').textContent = t('cfSaveLib');
        document.getElementById('btn-cf-submit').textContent = t('cfSubmit');
        document.getElementById('lbl-cf-auto-btn').textContent = t('cfAutoBtn');
        document.getElementById('lbl-contact-title').textContent = t('contactTitle');

        document.getElementById('lbl-kpi-avg').textContent = t('kpiAvg');
        document.getElementById('lbl-kpi-kcal').textContent = t('kpiKcal');
        document.getElementById('lbl-kpi-ontarget').textContent = t('kpiOnTarget');
        document.getElementById('lbl-kpi-days').textContent = t('kpiDays');
        document.getElementById('lbl-kpi-water').textContent = t('kpiWater');
        document.getElementById('lbl-kpi-glasses').textContent = t('kpiGlasses');
        document.getElementById('lbl-chart-weekly').textContent = t('chartWeekly');
        document.getElementById('lbl-chart-macro').textContent = t('chartMacro');
        document.getElementById('lbl-recent-days').textContent = t('recentDays');

        document.getElementById('lbl-calc-title').textContent = t('calcTitle');
        document.getElementById('lbl-calc-sub').textContent = t('calcSub');
        document.getElementById('lbl-gender').textContent = t('gender');
        document.getElementById('lbl-age').textContent = t('age');
        document.getElementById('lbl-weight').textContent = t('weight');
        document.getElementById('lbl-height').textContent = t('height');
        document.getElementById('lbl-activity').textContent = t('activity');
        document.getElementById('lbl-goal-type').textContent = t('goalType');
        document.getElementById('btn-calc-apply').textContent = t('calcApply');
        document.getElementById('lbl-manual-goals').textContent = t('manualGoals');
        document.getElementById('lbl-mg-cal').textContent = t('mgCal');
        document.getElementById('lbl-mg-water').textContent = t('mgWater');
        document.getElementById('lbl-mg-pro').textContent = t('cfPro');
        document.getElementById('lbl-mg-carb').textContent = t('cfCarb');
        document.getElementById('lbl-mg-fat').textContent = t('cfFat');
        document.getElementById('btn-mg-save').textContent = t('mgSave');

        document.getElementById('lbl-data-title').textContent = t('dataTitle');
        document.getElementById('btn-export-csv').textContent = t('exportCsv');
        document.getElementById('btn-export-json').textContent = t('exportJson');
        document.getElementById('lbl-import-json').textContent = t('importJson');
        document.getElementById('btn-clear-today').textContent = t('clearToday');

        document.getElementById('nav-lbl-today').textContent = t('navToday');
        document.getElementById('nav-lbl-add').textContent = t('navAdd');
        document.getElementById('nav-lbl-reports').textContent = t('navReports');
        document.getElementById('nav-lbl-settings').textContent = t('navSettings');


        document.getElementById('lbl-cam-cta-title').textContent = t('camCtaTitle');
        document.getElementById('lbl-cam-cta-sub').textContent = t('camCtaSub');
        document.getElementById('lbl-cam-btn-today').textContent = t('camBtnToday');
        document.getElementById('lbl-cam-btn-add').textContent = t('camBtnAdd');
        document.getElementById('cam-modal-title').textContent = t('camModalTitle');
        document.getElementById('lbl-cam-analyzing').textContent = t('camAnalyzing');
        document.getElementById('lbl-cam-quick-match').textContent = t('camQuickMatch');
        document.getElementById('lbl-cam-name').textContent = t('cfName');
        document.getElementById('lbl-cam-meal').textContent = t('camMealLbl');
        document.getElementById('lbl-cam-serving').textContent = t('cfServing');
        document.getElementById('lbl-cam-scale').textContent = t('camScaleLbl');
        document.getElementById('lbl-cam-cal').textContent = t('kcalUnit');
        document.getElementById('lbl-cam-pro').textContent = t('cfPro');
        document.getElementById('lbl-cam-carb').textContent = t('cfCarb');
        document.getElementById('lbl-cam-fat').textContent = t('cfFat');
        document.getElementById('lbl-cam-save-lib').textContent = t('camSaveLib');
        document.getElementById('btn-cam-retake').textContent = t('camRetake');
        document.getElementById('btn-cam-submit').textContent = t('camSubmit');
        document.getElementById('btn-login-lang').textContent = t('langBtn');
        document.getElementById('login-title').textContent = t('title');
        document.getElementById('login-sub').textContent = t('loginSub');
        document.getElementById('lbl-login-google').textContent = t('loginGoogleBtn');
        document.getElementById('lbl-login-or').textContent = t('loginOr');
        document.getElementById('login-pass-inp').placeholder = t('loginPassPh');
        document.getElementById('btn-login-email-submit').textContent = t('loginBtn');
        document.getElementById('btn-login-email-signup').textContent = t('fbSignup');
        document.getElementById('btn-login-guest').textContent = t('loginGuest');
        document.getElementById('lbl-ai-key-title').textContent = t('aiKeyBothTitle');
        document.getElementById('lbl-ai-key-desc').textContent = t('aiKeyBothDesc');
        document.getElementById('btn-save-ai-key').textContent = t('aiKeySave');
        document.getElementById('btn-test-ai-key').textContent = t('aiKeyTest');
        const activeEngines = [];
        if (state.groqApiKey) activeEngines.push('Groq Free');
        if (state.geminiApiKey) activeEngines.push('Gemini');
        const aiStatusTxt = activeEngines.length
          ? t('aiKeyActiveList').replace('{list}', activeEngines.join(' + '))
          : t('aiKeyEmpty');
        document.getElementById('lbl-ai-key-status').textContent = aiStatusTxt;
        const sumEl = document.getElementById('lbl-ai-key-summary');
        if (sumEl) sumEl.textContent = (state.aiKeysLocked ? '🔒 ' : '') + aiStatusTxt;
        document.getElementById('btn-open-ai-key-modal').textContent = t('aiManageBtn');
        document.getElementById('lbl-ai-modal-title').textContent = t('aiKeyBothTitle');
        document.getElementById('lbl-ai-key-lock').textContent = t('aiLockLabel');
        document.getElementById('ai-lock-badge').textContent = t('aiLockBadge');
        applyAiKeyLockState();
        document.getElementById('lbl-pick-barcode').textContent = t('pickBarcode');
        document.getElementById('lbl-barcode-title').textContent = t('barcodeTitle');
        document.getElementById('barcode-cam-hint').textContent = t('barcodeHint');
        document.getElementById('input-barcode-num').placeholder = t('barcodePh');
        document.getElementById('btn-barcode-lookup').textContent = t('barcodeSearch');
        document.getElementById('lbl-prod-check-title').textContent = t('prodCheckTitle');
        document.getElementById('lbl-prod-check-desc').textContent = t('prodCheckDesc');
        document.getElementById('lbl-settings-barcode-btn').textContent = t('prodScanBtn');
        document.getElementById('input-settings-barcode').placeholder = t('prodInputPh');
        document.getElementById('btn-settings-barcode-go').textContent = t('prodVerifyBtn');
        renderFirebaseUI();
        document.getElementById('lbl-chooser-title').textContent = t('chooserTitle');
        document.getElementById('lbl-pick-camera').textContent = t('pickCamera');
        document.getElementById('lbl-pick-gallery').textContent = t('pickGallery');
        document.getElementById('btn-chooser-cancel').textContent = t('cancel');
        document.getElementById('lbl-live-cam-title').textContent = t('liveCamTitle');
        document.getElementById('btn-flip-camera').textContent = t('flipCam');
        document.getElementById('btn-live-switch-gallery').textContent = t('liveGalleryBtn');
        document.getElementById('btn-live-native-cam').textContent = t('liveNativeCam');

        const camMealSel = document.getElementById('cam-meal');
        const mMeta = t('meals');
        ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(function (k, idx) {
          if (camMealSel.options[idx]) camMealSel.options[idx].textContent = mMeta[k].icon + ' ' + mMeta[k].name;
        });
      }

      function renderToday() {
        const todayStr = getLocalDateStr(0);
        document.getElementById('current-date-label').textContent = formatDisplayDate(state.selectedDate, state.lang);
        document.getElementById('btn-jump-today').classList.toggle('hidden', state.selectedDate === todayStr);

        const streak = computeStreak();
        const streakEl = document.getElementById('streak-badge');
        if (streak > 0) {
          streakEl.textContent = t('streakText').replace('{n}', streak);
          streakEl.classList.remove('hidden');
        } else {
          streakEl.classList.add('hidden');
        }

        const totals = getDayTotals(state.selectedDate);
        const goalCal = Math.max(1, Number(state.goals.calories) || 2000);
        const burned = Math.max(0, Number(totals.burned) || 0);
        const netCal = Math.max(0, totals.calories - burned);
        const pct = Math.min(1, netCal / goalCal);
        const circumference = 320.44;
        const offset = circumference * (1 - pct);
        const ringEl = document.getElementById('calorie-ring');
        ringEl.style.strokeDashoffset = offset.toFixed(2);
        const isOver = netCal > goalCal;
        ringEl.setAttribute('stroke', isOver ? 'url(#ringGradOver)' : 'url(#ringGradOk)');

        document.getElementById('ring-consumed').textContent = Math.round(netCal);
        animateCounterEl(document.getElementById('stat-goal'), Math.round(goalCal), '', '');
        animateCounterEl(document.getElementById('stat-eaten-val'), Math.round(totals.calories), '', '');
        animateCounterEl(document.getElementById('stat-burned-val'), Math.round(burned), '', '');
        document.getElementById('stat-burned-inline').textContent = 'kcal';
        document.getElementById('burn-status-text').textContent = t('burnStatus').replace('{n}', burned);

        const diff = Math.round(goalCal - netCal);
        const remLabel = document.getElementById('lbl-remaining');
        const remVal = document.getElementById('stat-remaining');
        const overBanner = document.getElementById('over-limit-banner');
        if (isOver) {
          remLabel.textContent = t('overBy');
          animateCounterEl(remVal, Math.abs(diff), '+', '');
          remVal.className = 'text-[32px] font-black tracking-tight leading-none text-rose-600 dark:text-rose-400';
          overBanner.textContent = t('overWarning').replace('{n}', Math.abs(diff));
          overBanner.classList.remove('hidden');
        } else {
          remLabel.textContent = t('remaining');
          animateCounterEl(remVal, diff, '', '');
          remVal.className = 'text-[36px] font-black tracking-tight leading-none text-slate-900 dark:text-white';
          overBanner.classList.add('hidden');
        }

        // Macros
        const gPro = Math.max(1, Number(state.goals.protein) || 100);
        const gCarb = Math.max(1, Number(state.goals.carbs) || 250);
        const gFat = Math.max(1, Number(state.goals.fat) || 65);
        document.getElementById('val-protein').textContent = Math.round(totals.protein) + '/' + Math.round(gPro) + 'g';
        document.getElementById('val-carbs').textContent = Math.round(totals.carbs) + '/' + Math.round(gCarb) + 'g';
        document.getElementById('val-fat').textContent = Math.round(totals.fat) + '/' + Math.round(gFat) + 'g';
        document.getElementById('bar-protein').style.width = Math.min(100, (totals.protein / gPro) * 100).toFixed(1) + '%';
        document.getElementById('bar-carbs').style.width = Math.min(100, (totals.carbs / gCarb) * 100).toFixed(1) + '%';
        document.getElementById('bar-fat').style.width = Math.min(100, (totals.fat / gFat) * 100).toFixed(1) + '%';

        // Water
        const gWater = Math.max(1, Number(state.goals.water) || 8);
        const wCount = totals.water || 0;
        document.getElementById('water-status-text').textContent = t('waterStatus')
          .replace('{c}', wCount)
          .replace('{g}', gWater)
          .replace('{ml}', wCount * 250);
        const wPctNum = Math.min(100, Math.round((wCount / gWater) * 100));
        document.getElementById('bar-water').style.width = wPctNum + '%';
        const wbFill = document.getElementById('water-bottle-fill');
        const wbPct = document.getElementById('water-bottle-pct');
        if (wbFill) wbFill.style.height = wPctNum + '%';
        if (wbPct) wbPct.textContent = wPctNum + '%';
        const cupsEl = document.getElementById('water-cups-row');
        if (cupsEl) {
          const cupCount = Math.min(8, Math.max(4, gWater));
          let cupsHtml = '';
          for (let ci = 1; ci <= cupCount; ci++) {
            const filled = wCount >= ci;
            cupsHtml += '<button type="button" data-water-set="' + ci + '" aria-label="Glass ' + ci + '" class="h-8 rounded-xl flex items-center justify-center text-sm transition active:scale-90 ' +
              (filled ? 'bg-sky-500/15 dark:bg-sky-400/20 text-sky-500 ring-1 ring-sky-400/50' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600') + '">💧</button>';
          }
          cupsEl.innerHTML = cupsHtml;
        }

        // Quick Add Strip
        const quickStrip = document.getElementById('quick-add-strip');
        quickStrip.innerHTML = PRESET_FOODS.slice(0, 18).map(function (f) {
          const nm = state.lang === 'bn' ? f.nameBn : f.nameEn;
          return '<button type="button" data-quick-id="' + f.id + '" class="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-emerald-400 transition">' +
            '<span class="text-base leading-none">' + f.emoji + '</span>' +
            '<span class="text-xs font-semibold text-slate-800 dark:text-slate-100">' + escapeHtml(nm) + '</span>' +
            '<span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+' + f.calories + '</span>' +
            '</button>';
        }).join('');

        // 4 Meal Cards
        const dayLog = state.logsByDate[state.selectedDate] || { entries: [] };
        const mealCount = Array.isArray(dayLog.entries) ? dayLog.entries.length : 0;
        const mealsBadge = document.getElementById('today-meals-badge');
        if (mealsBadge) {
          mealsBadge.textContent = t('todayMealsBadge')
            .replace('{n}', mealCount)
            .replace('{cal}', Math.round(totals.calories));
        }
        const mealKeys = ['breakfast', 'lunch', 'snacks', 'dinner'];
        const mealsMeta = t('meals');
        const mealsHtml = mealKeys.map(function (mKey) {
          const items = dayLog.entries.filter(function (e) { return e.meal === mKey; });
          const subCal = items.reduce(function (s, i) { return s + (Number(i.calories) || 0); }, 0);
          const meta = mealsMeta[mKey];
          const rowsHtml = items.length === 0
            ? '<p class="text-xs text-slate-400 dark:text-slate-500 py-2 text-center">' + escapeHtml(t('emptyMeal')) + '</p>'
            : items.map(function (item) {
                const nm = state.lang === 'bn' ? item.nameBn : item.nameEn;
                const srv = state.lang === 'bn' ? item.servingBn : item.servingEn;
                const qtyTag = item.qty !== 1 ? ' × ' + item.qty : '';
                const fallbackEmoji = item.emoji || (function () {
                  const lowN = ((item.nameEn || '') + ' ' + (item.nameBn || '')).toLowerCase();
                  if (/rice|ভাত|পোলাও|বিরিয়ানি/.test(lowN)) return '🍚';
                  if (/egg|ডিম/.test(lowN)) return '🥚';
                  if (/chicken|মুরগি|মাংস|beef|গরু|খাসি/.test(lowN)) return '🍗';
                  if (/fish|মাছ|ইলিশ|রুই/.test(lowN)) return '🐟';
                  if (/dal|ডাল/.test(lowN)) return '🥣';
                  if (/roti|রুটি|পরোটা|bread|পাউরুটি/.test(lowN)) return '🫓';
                  if (/tea|চা|coffee|কফি|milk|দুধ/.test(lowN)) return '☕';
                  if (/banana|কলা|apple|আপেল|fruit|ফল|mango|আম/.test(lowN)) return '🍎';
                  return '🍽️';
                })();
                const thumbHtml = item.photo
                  ? '<button type="button" data-view-photo="' + item.id + '" class="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm"><img src="' + item.photo + '" loading="lazy" alt="" class="w-full h-full object-cover"></button>'
                  : '<span class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-center text-base leading-none shrink-0">' + fallbackEmoji + '</span>';
                return '<div data-swipe-entry="' + item.id + '" class="meal-swipe-row py-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 rounded-xl px-1">' +
                  '<div class="flex items-start justify-between gap-2">' +
                    thumbHtml +
                    '<p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug break-words flex-1 min-w-0">' + escapeHtml(nm) + '</p>' +
                    '<span class="text-sm font-bold text-slate-900 dark:text-white shrink-0 whitespace-nowrap">' + item.calories + ' <span class="text-[10px] font-normal text-slate-400">kcal</span></span>' +
                  '</div>' +
                  '<div class="flex items-center justify-between gap-2">' +
                    '<p class="text-[11px] text-slate-500 dark:text-slate-400 break-words flex-1 min-w-0">' + escapeHtml(srv + qtyTag) + ' · P:' + item.protein + 'g C:' + item.carbs + 'g F:' + item.fat + 'g</p>' +
                    '<div class="flex items-center gap-1.5 shrink-0">' +
                      '<button type="button" data-fav-entry="' + item.id + '" aria-label="Favorite meal" title="Favorite" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 flex items-center justify-center text-xs transition">' + (isMealFavorite(item.nameBn || item.nameEn) ? '❤️' : '🤍') + '</button>' +
                      '<button type="button" data-attach-photo="' + item.id + '" aria-label="Attach meal photo" title="Photo" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/60 flex items-center justify-center text-xs transition">📷</button>' +
                      '<button type="button" data-edit-entry="' + item.id + '" aria-label="Edit" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 flex items-center justify-center text-xs font-bold transition">✎</button>' +
                      '<button type="button" data-del-entry="' + item.id + '" aria-label="Delete" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 flex items-center justify-center text-xs font-bold transition">✕</button>' +
                    '</div>' +
                  '</div>' +
                '</div>';
              }).join('');

          const mealTint = mKey === 'breakfast' ? 'bg-amber-100/90 dark:bg-amber-950/60' : (mKey === 'lunch' ? 'bg-emerald-100/90 dark:bg-emerald-950/60' : (mKey === 'snacks' ? 'bg-rose-100/90 dark:bg-rose-950/60' : 'bg-indigo-100/90 dark:bg-indigo-950/60'));
          const mealShare = goalCal > 0 ? Math.min(100, Math.round((subCal / goalCal) * 100)) : 0;
          const cleanRows = items.length === 0 ? '' : '<div class="mt-2.5 pl-1">' + rowsHtml + '</div>';
          return '<div class="p-3.5">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<div class="flex items-center gap-3 min-w-0">' +
                '<div class="w-10 h-10 rounded-2xl ' + mealTint + ' flex items-center justify-center text-lg leading-none shrink-0">' + meta.icon + '</div>' +
                '<div class="min-w-0">' +
                  '<h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">' + escapeHtml(meta.name) + '</h3>' +
                  '<p class="text-[11px] font-semibold ' + (subCal > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500') + '">' + (subCal > 0 ? (subCal + ' kcal · ' + mealShare + '%') : escapeHtml(t('emptyMeal'))) + '</p>' +
                '</div>' +
              '</div>' +
              '<button type="button" data-add-meal="' + mKey + '" aria-label="Add to meal" class="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-lg font-bold border border-emerald-200/80 dark:border-emerald-800/70 flex items-center justify-center hover:bg-emerald-600 hover:text-white active:scale-90 transition shrink-0">+</button>' +
            '</div>' +
            cleanRows +
          '</div>';
        }).join('');
        const emptyHeroHtml = mealCount === 0 ? (
          '<div class="p-5 text-center bg-gradient-to-b from-emerald-50/70 to-transparent dark:from-emerald-950/30 space-y-2.5">' +
            '<div class="w-20 h-20 mx-auto rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 flex items-center justify-center shadow-inner">' +
              '<svg class="w-12 h-12 text-emerald-600 dark:text-emerald-400" viewBox="0 0 64 64" fill="none">' +
                '<circle cx="32" cy="34" r="22" stroke="currentColor" stroke-width="2.8" fill="currentColor" fill-opacity="0.1"/>' +
                '<circle cx="32" cy="34" r="14" stroke="currentColor" stroke-width="1.8" stroke-dasharray="4 3"/>' +
                '<path d="M22 28c2-5 6-8 10-8s8 3 10 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
                '<circle cx="27" cy="35" r="2.2" fill="currentColor"/><circle cx="37" cy="35" r="2.2" fill="currentColor"/>' +
                '<path d="M28 41c2.5 2 5.5 2 8 0" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
              '</svg>' +
            '</div>' +
            '<p class="text-sm font-extrabold text-slate-800 dark:text-slate-100">' + (state.lang === 'bn' ? 'আপনি আজ এখনো কিছু লগ করেননি!' : 'No meals logged today yet!') + '</p>' +
            '<p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">' + (state.lang === 'bn' ? 'ক্যামেরা দিয়ে খাবারের ছবি তুলুন, ভয়েস বলুন অথবা নিচের + বাটন দিয়ে যোগ করুন।' : 'Snap a meal photo, use voice input, or tap + below to start tracking.') + '</p>' +
            '<div class="flex items-center justify-center gap-2 pt-1">' +
              '<button type="button" id="btn-empty-cam" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm active:scale-95 transition">📷 ' + (state.lang === 'bn' ? 'ক্যামেরা' : 'Camera') + '</button>' +
              '<button type="button" id="btn-empty-add" class="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold active:scale-95 transition">➕ ' + (state.lang === 'bn' ? 'খাবার যোগ' : 'Add Food') + '</button>' +
            '</div>' +
          '</div>'
        ) : '';
        document.getElementById('meals-container').innerHTML = emptyHeroHtml + mealsHtml;
        if (typeof updateGamificationPill === 'function') updateGamificationPill();
        if (typeof updateAppBadgeCount === 'function') updateAppBadgeCount(Math.max(0, diff));
        if (typeof syncStepAndJournalUI === 'function') syncStepAndJournalUI();
        if (typeof renderFavoritesStrip === 'function') renderFavoritesStrip();
        const prevDateStr = shiftDateStr(state.selectedDate, -1);
        const prevLog = state.logsByDate[prevDateStr];
        const showCopyYest = (!dayLog.entries || dayLog.entries.length === 0) && prevLog && Array.isArray(prevLog.entries) && prevLog.entries.length > 0;
        document.getElementById('btn-copy-yesterday').classList.toggle('hidden', !showCopyYest);
      }

      function renderAddTabControls() {
        const mealKeys = ['breakfast', 'lunch', 'snacks', 'dinner'];
        const mealsMeta = t('meals');
        document.getElementById('add-meal-pills').innerHTML = mealKeys.map(function (mKey) {
          const active = state.selectedMeal === mKey;
          return '<button type="button" data-pick-meal="' + mKey + '" class="py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 border transition ' +
            (active
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700') + '">' +
            '<span class="text-sm">' + mealsMeta[mKey].icon + '</span>' +
            '<span class="truncate max-w-full">' + escapeHtml(mealsMeta[mKey].name) + '</span>' +
          '</button>';
        }).join('');

        const qtys = [0.5, 1, 1.5, 2];
        const cats = state.lang === 'bn'
          ? [
              { id: 'all', lbl: 'সব' },
              { id: 'curry', lbl: '🍛 তরকারি' },
              { id: 'staple', lbl: '🍚 ভাত/রুটি' },
              { id: 'meal', lbl: '🥘 বিরিয়ানি/মিল' },
              { id: 'snack', lbl: '☕ নাস্তা/ফল' }
            ]
          : [
              { id: 'all', lbl: 'All' },
              { id: 'curry', lbl: '🍛 Curries' },
              { id: 'staple', lbl: '🍚 Rice/Bread' },
              { id: 'meal', lbl: '🥘 Meals' },
              { id: 'snack', lbl: '☕ Snacks/Tea' }
            ];
        const catEl = document.getElementById('food-cat-pills');
        if (catEl) {
          catEl.innerHTML = cats.map(function (c) {
            const act = state.selectedCat === c.id;
            return '<button type="button" data-pick-cat="' + c.id + '" class="shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition ' +
              (act ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300') + '">' + c.lbl + '</button>';
          }).join('');
        }

        document.getElementById('qty-pills').innerHTML = qtys.map(function (q) {
          const active = state.selectedQty === q;
          return '<button type="button" data-pick-qty="' + q + '" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ' +
            (active
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300') + '">' + q + 'x</button>';
        }).join('');
      }

      function renderFoodLibrary() {
        const q = (document.getElementById('food-search-input').value || '').trim().toLowerCase();
        const combined = state.customFoods.map(function (f) { return { ...f, isCustom: true }; }).concat(PRESET_FOODS);
        const filtered = combined.filter(function (f) {
          if (state.selectedCat !== 'all' && !f.isCustom && f.cat !== state.selectedCat) return false;
          if (!q) return true;
          return (f.nameEn || '').toLowerCase().includes(q) || (f.nameBn || '').toLowerCase().includes(q);
        });

        const listEl = document.getElementById('food-library-list');
        if (filtered.length === 0) {
          listEl.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">' + escapeHtml(t('noFoodMatch')) + '</p>';
          return;
        }

        const mult = state.selectedQty;
        listEl.innerHTML = filtered.map(function (f) {
          const nm = state.lang === 'bn' ? (f.nameBn || f.nameEn) : f.nameEn;
          const altNm = state.lang === 'bn' ? f.nameEn : (f.nameBn || '');
          const srv = state.lang === 'bn' ? (f.servingBn || f.servingEn) : f.servingEn;
          const cal = Math.round((Number(f.calories) || 0) * mult);
          const customBadge = f.isCustom
            ? '<span class="ml-1.5 px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold">' + escapeHtml(t('customTag')) + '</span>'
            : '';
          const delCustomBtn = f.isCustom
            ? '<button type="button" data-edit-custom="' + f.id + '" aria-label="Edit food" class="w-8 h-8 rounded-xl bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 hover:text-emerald-700 text-xs font-bold flex items-center justify-center">✎</button>' +
              '<button type="button" data-del-custom="' + f.id + '" aria-label="Delete food" class="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 text-xs font-bold flex items-center justify-center">✕</button>'
            : '';
          return '<div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 space-y-2">' +
            '<div class="flex items-start justify-between gap-2">' +
              '<p class="text-sm font-bold text-slate-900 dark:text-white leading-snug break-words flex-1 min-w-0">' + (f.emoji ? f.emoji + ' ' : '🍽️ ') + escapeHtml(nm) + customBadge + '</p>' +
              '<span class="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 whitespace-nowrap pt-0.5">' + cal + ' kcal</span>' +
            '</div>' +
            '<div class="flex items-center justify-between gap-2">' +
              '<div class="min-w-0 flex-1">' +
                '<p class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug break-words">' + escapeHtml(srv) + (altNm && altNm !== nm ? ' · ' + escapeHtml(altNm) : '') + '</p>' +
                '<p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">P:' + (Math.round(f.protein * mult * 10) / 10) + 'g · C:' + (Math.round(f.carbs * mult * 10) / 10) + 'g · F:' + (Math.round(f.fat * mult * 10) / 10) + 'g</p>' +
              '</div>' +
              '<div class="flex items-center gap-1.5 shrink-0">' +
                delCustomBtn +
                '<button type="button" data-log-food="' + f.id + '" data-is-custom="' + (f.isCustom ? '1' : '0') + '" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition">' + escapeHtml(t('logBtn')) + '</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
      }

      function renderReports() {
        const goalCal = Math.max(1, Number(state.goals.calories) || 2000);
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const ds = getLocalDateStr(-i);
          const tot = getDayTotals(ds);
          const parts = ds.split('-').map(Number);
          const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
          const lbl = dObj.toLocaleDateString(state.lang === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short' });
          days.push({ dateStr: ds, label: lbl, ...tot });
        }

        const loggedDays = days.filter(function (d) { return d.calories > 0; });
        const avgCal = loggedDays.length > 0
          ? Math.round(loggedDays.reduce(function (s, d) { return s + d.calories; }, 0) / loggedDays.length)
          : 0;
        const onTarget = loggedDays.filter(function (d) { return d.calories <= goalCal; }).length;
        const totalWater = days.reduce(function (s, d) { return s + (d.water || 0); }, 0);

        document.getElementById('kpi-avg-cal').textContent = avgCal;
        document.getElementById('kpi-days-ok').textContent = onTarget;
        document.getElementById('kpi-water-total').textContent = totalWater;

        const isDark = state.theme === 'dark' || state.theme === 'dark-glass';
        const textColor = isDark ? '#cbd5e1' : '#475569';
        const gridColor = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.22)';

        // Chart 1: 7-Day Trend
        if (weeklyChartInstance) {
          weeklyChartInstance.destroy();
          weeklyChartInstance = null;
        }
        if (typeof Chart !== 'undefined') {
          const ctxW = document.getElementById('weeklyChart').getContext('2d');
          weeklyChartInstance = new Chart(ctxW, {
            type: 'bar',
            data: {
              labels: days.map(function (d) { return d.label; }),
              datasets: [
                {
                  type: 'bar',
                  label: t('chartLabelConsumed'),
                  data: days.map(function (d) { return Math.round(d.calories); }),
                  backgroundColor: days.map(function (d) { return d.calories > goalCal ? '#f43f5e' : '#10b981'; }),
                  borderRadius: 8,
                  maxBarThickness: 28
                },
                {
                  type: 'line',
                  label: t('chartLabelGoal'),
                  data: days.map(function () { return goalCal; }),
                  borderColor: '#f59e0b',
                  borderDash: [5, 5],
                  borderWidth: 2,
                  pointRadius: 0,
                  fill: false
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: textColor, boxWidth: 12, font: { size: 11 } } }
              },
              scales: {
                x: { ticks: { color: textColor, font: { size: 11 } }, grid: { display: false } },
                y: { beginAtZero: true, ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor } }
              }
            }
          });
        }

        // Chart 2: Macro Split for selected date
        const selTotals = getDayTotals(state.selectedDate);
        const macroEmpty = document.getElementById('macro-empty-msg');
        const macroWrap = document.getElementById('macro-chart-wrap');
        const pCal = Math.round(selTotals.protein * 4);
        const cCal = Math.round(selTotals.carbs * 4);
        const fCal = Math.round(selTotals.fat * 9);
        const sumMacroCal = pCal + cCal + fCal;

        if (macroChartInstance) {
          macroChartInstance.destroy();
          macroChartInstance = null;
        }
        if (sumMacroCal <= 0) {
          macroEmpty.textContent = t('macroEmpty');
          macroEmpty.classList.remove('hidden');
          macroWrap.classList.add('hidden');
        } else {
          macroEmpty.classList.add('hidden');
          macroWrap.classList.remove('hidden');
          if (typeof Chart !== 'undefined') {
            const ctxM = document.getElementById('macroChart').getContext('2d');
            macroChartInstance = new Chart(ctxM, {
              type: 'doughnut',
              data: {
                labels: [
                  t('protein') + ' (' + Math.round(selTotals.protein) + 'g)',
                  t('carbs') + ' (' + Math.round(selTotals.carbs) + 'g)',
                  t('fat') + ' (' + Math.round(selTotals.fat) + 'g)'
                ],
                datasets: [{
                  data: [pCal, cCal, fCal],
                  backgroundColor: ['#3b82f6', '#f59e0b', '#f43f5e'],
                  borderWidth: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '64%',
                plugins: {
                  legend: { position: 'bottom', labels: { color: textColor, padding: 14, font: { size: 11 } } }
                }
              }
            });
          }
        }

        // Recent Days List
        const allDates = Object.keys(state.logsByDate)
          .filter(function (ds) {
            const l = state.logsByDate[ds];
            return (l.entries && l.entries.length > 0) || (l.water && l.water > 0);
          })
          .sort()
          .reverse()
          .slice(0, 14);

        // Weight Trend Chart
        const wDates = Object.keys(state.weightLog || {}).sort().slice(-14);
        const wEmpty = document.getElementById('weight-empty-msg');
        const wWrap = document.getElementById('weight-chart-wrap');
        const wLatestEl = document.getElementById('weight-latest-text');
        const todayW = state.weightLog && state.weightLog[state.selectedDate];
        const todayBody = (state.bodyLog && state.bodyLog[state.selectedDate]) || {};
        if (todayW) document.getElementById('input-today-weight').value = todayW;
        const fatInp = document.getElementById('input-today-fat');
        const waistInp = document.getElementById('input-today-waist');
        const gymChk = document.getElementById('chk-today-gym');
        if (fatInp) fatInp.value = todayBody.fat || '';
        if (waistInp) waistInp.value = todayBody.waist || '';
        if (gymChk) gymChk.checked = Boolean(todayBody.gym);
        if (weightChartInstance) { weightChartInstance.destroy(); weightChartInstance = null; }
        if (wDates.length === 0) {
          wLatestEl.textContent = '';
          wEmpty.textContent = t('weightEmpty');
          wEmpty.classList.remove('hidden');
          wWrap.classList.add('hidden');
        } else {
          const lastDs = wDates[wDates.length - 1];
          const latestVal = state.weightLog[lastDs];
          const lastBody = (state.bodyLog && state.bodyLog[lastDs]) || {};
          const extraTxt = (lastBody.fat ? ' · ফ্যাট ' + lastBody.fat + '%' : '') + (lastBody.waist ? ' · কোমর ' + lastBody.waist + 'cm' : '') + (lastBody.gym ? ' · 🏋️' : '');
          wLatestEl.textContent = t('weightLatest').replace('{w}', latestVal) + extraTxt;
          wEmpty.classList.add('hidden');
          wWrap.classList.remove('hidden');
          if (typeof Chart !== 'undefined') {
            const ctxWt = document.getElementById('weightChart').getContext('2d');
            const fatSeries = wDates.map(function (ds) {
              const b = state.bodyLog && state.bodyLog[ds];
              return b && b.fat ? Number(b.fat) : null;
            });
            const hasFat = fatSeries.some(function (v) { return v !== null; });
            const wtDatasets = [{
              label: 'ওজন (kg)',
              data: wDates.map(function (ds) { return Number(state.weightLog[ds]); }),
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.14)',
              borderWidth: 2.5,
              tension: 0.35,
              fill: true,
              pointRadius: 3.5,
              pointBackgroundColor: '#059669'
            }];
            if (hasFat) {
              wtDatasets.push({
                label: 'বডি ফ্যাট (%)',
                data: fatSeries,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245,158,11,0.10)',
                borderWidth: 2.2,
                borderDash: [5, 4],
                tension: 0.35,
                spanGaps: true,
                pointRadius: 3.5,
                pointBackgroundColor: '#d97706'
              });
            }
            weightChartInstance = new Chart(ctxWt, {
              type: 'line',
              data: {
                labels: wDates.map(function (ds) { return ds.slice(5); }),
                datasets: wtDatasets
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } },
                  y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } }
                }
              }
            });
          }
        }

        const histEl = document.getElementById('history-days-list');
        if (allDates.length === 0) {
          histEl.innerHTML = '<p class="text-xs text-slate-400 text-center py-4">' + escapeHtml(t('noHistory')) + '</p>';
        } else {
          histEl.innerHTML = allDates.map(function (ds) {
            const tot = getDayTotals(ds);
            const over = tot.calories > goalCal;
            return '<button type="button" data-jump-date="' + ds + '" class="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition text-left">' +
              '<div>' +
                '<p class="text-xs font-bold text-slate-900 dark:text-white">' + escapeHtml(formatDisplayDate(ds, state.lang)) + '</p>' +
                '<p class="text-[11px] text-slate-500 dark:text-slate-400">💧 ' + (tot.water || 0) + ' · P:' + Math.round(tot.protein) + 'g C:' + Math.round(tot.carbs) + 'g F:' + Math.round(tot.fat) + 'g</p>' +
              '</div>' +
              '<span class="text-sm font-extrabold ' + (over ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400') + '">' + Math.round(tot.calories) + ' kcal</span>' +
            '</button>';
          }).join('');
        }
        if (typeof renderBadgesAndLevel === 'function') renderBadgesAndLevel();
        if (typeof renderMealPhotoGallery === 'function') renderMealPhotoGallery();
        if (typeof renderMealScoreAndMicros === 'function') renderMealScoreAndMicros();
      }

      function syncGoalInputs() {
        document.getElementById('mg-cal').value = state.goals.calories;
        document.getElementById('mg-water').value = state.goals.water;
        document.getElementById('mg-pro').value = state.goals.protein;
        document.getElementById('mg-carb').value = state.goals.carbs;
        document.getElementById('mg-fat').value = state.goals.fat;
        document.getElementById('input-gemini-key').value = state.geminiApiKey || '';
        document.getElementById('input-groq-key').value = state.groqApiKey || '';
      }

      function renderAll() {
        applyTheme();
        renderStaticLabels();
        renderToday();
        renderAddTabControls();
        renderFoodLibrary();
        syncGoalInputs();
        if (state.activeTab === 'reports') renderReports();
      }

      /* ======================== EVENT LISTENERS ======================== */
      // Menu Drawer & Profile Picture Controls
      function openMenuDrawer() {
        renderFirebaseUI();
        document.getElementById('menu-drawer-backdrop').classList.remove('hidden');
      }

      function closeMenuDrawer() {
        document.getElementById('menu-drawer-backdrop').classList.add('hidden');
      }

      document.getElementById('btn-menu-open').addEventListener('click', openMenuDrawer);
      document.getElementById('btn-menu-close').addEventListener('click', closeMenuDrawer);
      document.getElementById('menu-drawer-backdrop').addEventListener('click', function (e) {
        if (e.target.id === 'menu-drawer-backdrop') closeMenuDrawer();
      });

      document.getElementById('btn-menu-lang-bn').addEventListener('click', function () {
        state.lang = 'bn';
        saveState();
        renderAll();
      });

      document.getElementById('btn-menu-lang-en').addEventListener('click', function () {
        state.lang = 'en';
        saveState();
        renderAll();
      });

      function handleThemePick(e) {
        const btn = e.target.closest('[data-set-theme]');
        if (!btn) return;
        state.theme = btn.getAttribute('data-set-theme');
        saveState();
        renderAll();
      }
      document.getElementById('menu-theme-pills').addEventListener('click', handleThemePick);
      document.getElementById('menu-accent-swatches').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-set-accent]');
        if (!btn) return;
        state.accent = btn.getAttribute('data-set-accent');
        saveState();
        applyAccent();
      });

      function triggerProfilePhotoUpload() {
        const inp = document.getElementById('profile-photo-input');
        inp.value = '';
        inp.click();
      }

      document.getElementById('btn-menu-change-photo').addEventListener('click', triggerProfilePhotoUpload);
      document.getElementById('btn-menu-remove-photo').addEventListener('click', function () {
        state.customAvatar = '';
        saveState();
        renderProfileAvatars();
        showToast(t('toastPhotoRemoved'));
      });

      document.getElementById('profile-photo-input').addEventListener('change', function (e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
          const img = new Image();
          img.onload = function () {
            const size = 180;
            const minSide = Math.min(img.width, img.height);
            const sx = (img.width - minSide) / 2;
            const sy = (img.height - minSide) / 2;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
            state.customAvatar = canvas.toDataURL('image/jpeg', 0.82);
            saveState();
            renderProfileAvatars();
            showToast(t('toastPhotoUpdated'));
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });

      document.getElementById('btn-menu-sync').addEventListener('click', function () {
        pushStateToCloud(true);
        closeMenuDrawer();
      });

      document.getElementById('btn-menu-logout').addEventListener('click', function () {
        closeMenuDrawer();
        try {
          localStorage.removeItem('cal_tracker_guest_ok');
          localStorage.removeItem('cal_tracker_authed');
        } catch (e) {}
        if (fbAuth) fbAuth.signOut().catch(function () {});
        showLoginScreen();
      });

      // Confirm modal
      document.getElementById('btn-confirm-cancel').addEventListener('click', closeConfirm);
      document.getElementById('btn-confirm-ok').addEventListener('click', function () {
        const fn = confirmCallback;
        closeConfirm();
        if (typeof fn === 'function') fn();
      });

      // Bottom Nav
      document.querySelectorAll('.nav-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          switchTab(btn.getAttribute('data-tab'));
        });
      });

      // Date navigation
      document.getElementById('btn-prev-date').addEventListener('click', function () {
        state.selectedDate = shiftDateStr(state.selectedDate, -1);
        renderToday();
      });
      document.getElementById('btn-next-date').addEventListener('click', function () {
        state.selectedDate = shiftDateStr(state.selectedDate, 1);
        renderToday();
      });
      document.getElementById('btn-jump-today').addEventListener('click', function () {
        state.selectedDate = getLocalDateStr(0);
        renderToday();
      });

      // Water buttons
      document.getElementById('btn-water-plus').addEventListener('click', function () { adjustWater(1); });
      document.getElementById('btn-water-minus').addEventListener('click', function () { adjustWater(-1); });
      document.getElementById('water-cups-row').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-water-set]');
        if (!btn) return;
        const target = Number(btn.getAttribute('data-water-set')) || 0;
        const day = getDayLog(state.selectedDate);
        day.water = day.water === target ? Math.max(0, target - 1) : target;
        saveState();
        renderToday();
      });

      // Quick add strip delegation
      document.getElementById('quick-add-strip').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-quick-id]');
        if (!btn) return;
        const fid = btn.getAttribute('data-quick-id');
        const food = PRESET_FOODS.find(function (f) { return f.id === fid; });
        if (food) {
          const hr = new Date().getHours();
          const autoMeal = hr < 11 ? 'breakfast' : (hr < 16 ? 'lunch' : (hr < 19 ? 'snacks' : 'dinner'));
          confirmBeforeAddFood(food, autoMeal, 1);
        }
      });

      document.getElementById('btn-see-all-foods').addEventListener('click', function () {
        switchTab('add');
      });

      // Meals container delegation
      document.getElementById('meals-container').addEventListener('click', function (e) {
        const addBtn = e.target.closest('[data-add-meal]');
        if (addBtn) {
          state.selectedMeal = addBtn.getAttribute('data-add-meal');
          renderAddTabControls();
          switchTab('add');
          return;
        }
        const editBtn = e.target.closest('[data-edit-entry]');
        if (editBtn) {
          openEditEntryModal(editBtn.getAttribute('data-edit-entry'));
          return;
        }
        const delBtn = e.target.closest('[data-del-entry]');
        if (delBtn) {
          deleteEntry(delBtn.getAttribute('data-del-entry'));
        }
      });

      // Add tab controls
      document.getElementById('add-meal-pills').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-pick-meal]');
        if (!btn) return;
        state.selectedMeal = btn.getAttribute('data-pick-meal');
        renderAddTabControls();
      });

      document.getElementById('qty-pills').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-pick-qty]');
        if (!btn) return;
        state.selectedQty = Number(btn.getAttribute('data-pick-qty')) || 1;
        renderAddTabControls();
        renderFoodLibrary();
      });

      let searchDebounceTimer = null;
      document.getElementById('food-search-input').addEventListener('input', function () {
        if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(renderFoodLibrary, 220);
      });
      document.getElementById('food-cat-pills').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-pick-cat]');
        if (!btn) return;
        state.selectedCat = btn.getAttribute('data-pick-cat') || 'all';
        renderAddTabControls();
        renderFoodLibrary();
      });

      document.getElementById('food-library-list').addEventListener('click', function (e) {
        const editCustomBtn = e.target.closest('[data-edit-custom]');
        if (editCustomBtn) {
          openEditCustomFoodModal(editCustomBtn.getAttribute('data-edit-custom'));
          return;
        }
        const delBtn = e.target.closest('[data-del-custom]');
        if (delBtn) {
          deleteCustomFood(delBtn.getAttribute('data-del-custom'));
          return;
        }
        const logBtn = e.target.closest('[data-log-food]');
        if (!logBtn) return;
        const fid = logBtn.getAttribute('data-log-food');
        const isCustom = logBtn.getAttribute('data-is-custom') === '1';
        const pool = isCustom ? state.customFoods : PRESET_FOODS;
        const food = pool.find(function (f) { return f.id === fid; });
        if (food) {
          confirmBeforeAddFood(food, state.selectedMeal, state.selectedQty);
        }
      });

      // Auto-Calculate Nutrition from Food Name + Weight/Serving
      function parseWeightGrams(str) {
        const sTxt = String(str || '').replace(/[০-৯]/g, function (d) { return '০১২৩৪৫৬৭৮৯'.indexOf(d); });
        const gm = sTxt.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams|গ্রাম|ml|মিলি)/i);
        if (gm) return { type: 'g', val: Number(gm[1]) };
        const kg = sTxt.match(/(\d+(?:\.\d+)?)\s*(?:kg|কেজি)/i);
        if (kg) return { type: 'g', val: Number(kg[1]) * 1000 };
        const num = sTxt.match(/(\d+(?:\.\d+)?)/);
        if (num) return { type: 'qty', val: Number(num[1]) };
        return { type: 'qty', val: 1 };
      }

      document.getElementById('btn-cf-auto-calc').addEventListener('click', async function () {
        const name = (document.getElementById('cf-name').value || '').trim();
        const servingRaw = (document.getElementById('cf-serving').value || '').trim();
        const statusEl = document.getElementById('cf-auto-status');
        if (!name) {
          statusEl.textContent = t('cfAutoNeedName');
          document.getElementById('cf-name').focus();
          return;
        }
        statusEl.textContent = t('cfAutoLoading');

        const parsedWt = parseWeightGrams(servingRaw || name);
        const groqKey = (state.groqApiKey || '').trim();
        const geminiKey = (state.geminiApiKey || '').trim();

        // 1. Try AI (Groq Free -> Gemini Fallback) for accurate Bangla/English dish + exact weight calculation
        if (groqKey || geminiKey) {
          const prompt = 'Calculate accurate nutrition for food: "' + name + '", portion/weight: "' + (servingRaw || '1 standard serving') + '". Reply ONLY with raw JSON (no markdown): {"serving":"' + (servingRaw || '1 serving') + '","calories":250,"protein":12,"carbs":30,"fat":8}';
          let rawText = '';
          let srcName = '';
          if (groqKey) {
            try {
              const gr = await callGroqVision(groqKey, prompt, null);
              rawText = gr.text || '';
              srcName = 'Groq AI';
            } catch (e1) {}
          }
          if (!rawText && geminiKey) {
            try {
              const mr = await callGeminiWithFallback(geminiKey, [{ text: prompt }]);
              const j = mr.json;
              rawText = j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] ? j.candidates[0].content.parts[0].text : '';
              srcName = 'Gemini AI';
            } catch (e2) {}
          }
          if (rawText) {
            try {
              const m = rawText.match(/\{[\s\S]*\}/);
              if (m) {
                const obj = JSON.parse(m[0]);
                document.getElementById('cf-cal').value = Math.round(Number(obj.calories) || 0);
                document.getElementById('cf-protein').value = Math.round((Number(obj.protein) || 0) * 10) / 10;
                document.getElementById('cf-carbs').value = Math.round((Number(obj.carbs) || 0) * 10) / 10;
                document.getElementById('cf-fat').value = Math.round((Number(obj.fat) || 0) * 10) / 10;
                if (!servingRaw && obj.serving) document.getElementById('cf-serving').value = obj.serving;
                statusEl.textContent = t('cfAutoDone').replace('{src}', srcName);
                return;
              }
            } catch (ep) {}
          }
        }

        // 2. Instant Local Verified Food Match + Exact Gram Scaling
        const qLow = name.toLowerCase();
        const localMatch = state.customFoods.concat(PRESET_FOODS).find(function (f) {
          return (f.nameBn && (f.nameBn.toLowerCase().includes(qLow) || qLow.includes(f.nameBn.toLowerCase()))) ||
                 (f.nameEn && (f.nameEn.toLowerCase().includes(qLow) || qLow.includes(f.nameEn.toLowerCase())));
        });
        if (localMatch) {
          let factor = 1;
          if (parsedWt.type === 'g') {
            const baseGMatch = String(localMatch.servingEn || '').match(/(\d+)\s*g/i);
            const baseG = baseGMatch ? Number(baseGMatch[1]) : 100;
            factor = parsedWt.val / Math.max(1, baseG);
          } else {
            factor = parsedWt.val || 1;
          }
          document.getElementById('cf-cal').value = Math.round((localMatch.calories || 0) * factor);
          document.getElementById('cf-protein').value = Math.round((localMatch.protein || 0) * factor * 10) / 10;
          document.getElementById('cf-carbs').value = Math.round((localMatch.carbs || 0) * factor * 10) / 10;
          document.getElementById('cf-fat').value = Math.round((localMatch.fat || 0) * factor * 10) / 10;
          if (!servingRaw) document.getElementById('cf-serving').value = state.lang === 'bn' ? localMatch.servingBn : localMatch.servingEn;
          statusEl.textContent = t('cfAutoDone').replace('{src}', 'Local DB');
          return;
        }

        // 3. Free Open Food Facts Search Fallback (No API Key Needed)
        try {
          const resp = await fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + encodeURIComponent(name) + '&search_simple=1&action=process&json=1&page_size=1');
          const data = await resp.json();
          const prod = data && Array.isArray(data.products) && data.products[0];
          if (prod && prod.nutriments && prod.nutriments['energy-kcal_100g'] !== undefined) {
            const n = prod.nutriments;
            const gScale = parsedWt.type === 'g' ? (parsedWt.val / 100) : 1;
            document.getElementById('cf-cal').value = Math.round((Number(n['energy-kcal_100g']) || 0) * gScale);
            document.getElementById('cf-protein').value = Math.round((Number(n.proteins_100g) || 0) * gScale * 10) / 10;
            document.getElementById('cf-carbs').value = Math.round((Number(n.carbohydrates_100g) || 0) * gScale * 10) / 10;
            document.getElementById('cf-fat').value = Math.round((Number(n.fat_100g) || 0) * gScale * 10) / 10;
            if (!servingRaw) document.getElementById('cf-serving').value = '100g';
            statusEl.textContent = t('cfAutoDone').replace('{src}', 'Open Food Facts');
            return;
          }
        } catch (e3) {}

        statusEl.textContent = t('cfAutoNotFound');
      });

      // Custom food form
      document.getElementById('custom-food-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = (document.getElementById('cf-name').value || '').trim();
        const cal = Number(document.getElementById('cf-cal').value) || 0;
        const serving = (document.getElementById('cf-serving').value || '').trim() || (state.lang === 'bn' ? '১ পরিবেশন' : '1 serving');
        const protein = Number(document.getElementById('cf-protein').value) || 0;
        const carbs = Number(document.getElementById('cf-carbs').value) || 0;
        const fat = Number(document.getElementById('cf-fat').value) || 0;
        const saveToLib = document.getElementById('cf-save-lib').checked;

        if (!name) return;
        const foodObj = {
          id: 'cf_' + Date.now(),
          nameEn: name,
          nameBn: name,
          servingEn: serving,
          servingBn: serving,
          calories: cal,
          protein: protein,
          carbs: carbs,
          fat: fat,
          emoji: '🍽️'
        };
        confirmBeforeAddFood(foodObj, state.selectedMeal, 1, function () {
          let wasDupLib = false;
          if (saveToLib) {
            wasDupLib = !addCustomFoodUnique(foodObj);
          }
          logFoodItem(foodObj, state.selectedMeal, 1);
          if (wasDupLib) {
            showToast(state.lang === 'bn' ? 'একই খাবার তালিকায় আগেই আছে — শুধু আজকের হিসাবে যোগ হয়েছে' : 'Already in saved foods — logged to today only');
          }
          document.getElementById('custom-food-form').reset();
          document.getElementById('cf-auto-status').textContent = '';
          document.getElementById('cf-save-lib').checked = true;
        });
      });

      // Reports history click
      document.getElementById('history-days-list').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-jump-date]');
        if (!btn) return;
        state.selectedDate = btn.getAttribute('data-jump-date');
        renderToday();
        switchTab('today');
      });

      // Smart BMR Calculator (Mifflin-St Jeor)
      document.getElementById('bmr-calc-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const gender = document.getElementById('calc-gender').value;
        const age = Number(document.getElementById('calc-age').value) || 28;
        const weight = Number(document.getElementById('calc-weight').value) || 70;
        const height = Number(document.getElementById('calc-height').value) || 170;
        const activity = Number(document.getElementById('calc-activity').value) || 1.375;
        const goalType = document.getElementById('calc-goal-type').value;

        const bmr = gender === 'male'
          ? (10 * weight) + (6.25 * height) - (5 * age) + 5
          : (10 * weight) + (6.25 * height) - (5 * age) - 161;
        let tdee = Math.round(bmr * activity);
        if (goalType === 'lose') tdee = Math.max(1200, tdee - 500);
        if (goalType === 'gain') tdee = tdee + 300;

        // Balanced macro split: 25% Protein, 50% Carbs, 25% Fat
        state.goals.calories = tdee;
        state.goals.protein = Math.round((tdee * 0.25) / 4);
        state.goals.carbs = Math.round((tdee * 0.50) / 4);
        state.goals.fat = Math.round((tdee * 0.25) / 9);
        saveState();
        renderAll();
        showToast(t('toastGoalSaved').replace('{cal}', tdee));
      });

      // Manual Goals Form
      document.getElementById('manual-goals-form').addEventListener('submit', function (e) {
        e.preventDefault();
        state.goals.calories = Math.max(800, Number(document.getElementById('mg-cal').value) || 2000);
        state.goals.water = Math.max(1, Number(document.getElementById('mg-water').value) || 8);
        state.goals.protein = Math.max(10, Number(document.getElementById('mg-pro').value) || 100);
        state.goals.carbs = Math.max(10, Number(document.getElementById('mg-carb').value) || 250);
        state.goals.fat = Math.max(10, Number(document.getElementById('mg-fat').value) || 65);
        saveState();
        renderAll();
        showToast(t('toastGoalSaved').replace('{cal}', state.goals.calories));
      });

      // Export CSV
      document.getElementById('btn-export-csv').addEventListener('click', function () {
        const rows = [['Date', 'Meal', 'Food (EN)', 'Food (BN)', 'Qty', 'Serving', 'Calories', 'Protein(g)', 'Carbs(g)', 'Fat(g)', 'Time']];
        Object.keys(state.logsByDate).sort().forEach(function (ds) {
          (state.logsByDate[ds].entries || []).forEach(function (e) {
            rows.push([ds, e.meal, e.nameEn, e.nameBn, e.qty, e.servingEn, e.calories, e.protein, e.carbs, e.fat, e.time]);
          });
        });
        const csv = '\uFEFF' + rows.map(function (r) {
          return r.map(function (cell) { return '"' + String(cell || '').replace(/"/g, '""') + '"'; }).join(',');
        }).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'calorie_log_' + getLocalDateStr(0) + '.csv';
        a.click();
        showToast(t('toastExported'));
      });

      // Export JSON
      document.getElementById('btn-export-json').addEventListener('click', function () {
        const data = JSON.stringify({
          goals: state.goals,
          logsByDate: state.logsByDate,
          customFoods: state.customFoods
        }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'calorie_tracker_backup_' + getLocalDateStr(0) + '.json';
        a.click();
        showToast(t('toastExported'));
      });

      // Import JSON
      document.getElementById('input-import-json').addEventListener('change', function (e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
          try {
            const parsed = JSON.parse(ev.target.result);
            if (parsed.goals) state.goals = { ...state.goals, ...parsed.goals };
            if (parsed.logsByDate && typeof parsed.logsByDate === 'object') state.logsByDate = parsed.logsByDate;
            if (Array.isArray(parsed.customFoods)) state.customFoods = parsed.customFoods;
            saveState();
            renderAll();
            showToast(t('toastImported'));
          } catch (err) {
            showToast(t('toastImportErr'));
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      });

      // Clear selected day
      document.getElementById('btn-clear-today').addEventListener('click', function () {
        openConfirm(t('confirmClearTitle'), t('confirmClearMsg'), function () {
          state.logsByDate[state.selectedDate] = { entries: [], water: 0 };
          saveState();
          renderAll();
          showToast(t('toastCleared'));
        });
      });

      /* ======================== CAMERA AI FOOD SCANNER ======================== */
      let camBaseNutrition = { calories: 205, protein: 4.3, carbs: 44.5, fat: 0.4 };
      let camScale = 1;
      let camScannedBarcode = '';

      function getAutoMealByTime() {
        const hr = new Date().getHours();
        return hr < 11 ? 'breakfast' : (hr < 16 ? 'lunch' : (hr < 19 ? 'snacks' : 'dinner'));
      }

      function renderCamQuickChips() {
        const chipsEl = document.getElementById('cam-quick-chips');
        const allFoods = state.customFoods.concat(PRESET_FOODS);
        chipsEl.innerHTML = allFoods.map(function (f) {
          const nm = state.lang === 'bn' ? (f.nameBn || f.nameEn) : f.nameEn;
          return '<button type="button" data-cam-pick="' + f.id + '" class="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 transition">' +
            (f.emoji ? f.emoji + ' ' : '🍽️ ') + escapeHtml(nm) + ' (' + f.calories + ')</button>';
        }).join('');
      }

      function applyCamScale(mult) {
        camScale = mult;
        document.querySelectorAll('.cam-scale-btn').forEach(function (btn) {
          const isAct = Number(btn.getAttribute('data-cam-scale')) === mult;
          btn.classList.toggle('bg-emerald-600', isAct);
          btn.classList.toggle('text-white', isAct);
          btn.classList.toggle('bg-white', !isAct);
          btn.classList.toggle('dark:bg-slate-700', !isAct);
          btn.classList.toggle('text-slate-700', !isAct);
          btn.classList.toggle('dark:text-slate-200', !isAct);
        });
        document.getElementById('cam-cal').value = Math.round((camBaseNutrition.calories || 0) * mult);
        document.getElementById('cam-pro').value = Math.round((camBaseNutrition.protein || 0) * mult * 10) / 10;
        document.getElementById('cam-carb').value = Math.round((camBaseNutrition.carbs || 0) * mult * 10) / 10;
        document.getElementById('cam-fat').value = Math.round((camBaseNutrition.fat || 0) * mult * 10) / 10;
      }

      function fillCamForm(item) {
        document.getElementById('cam-name').value = state.lang === 'bn' ? (item.nameBn || item.nameEn || '') : (item.nameEn || item.nameBn || '');
        document.getElementById('cam-serving').value = state.lang === 'bn' ? (item.servingBn || item.servingEn || '১ প্লেট') : (item.servingEn || item.servingBn || '1 serving');
        camBaseNutrition = {
          calories: Number(item.calories) || 0,
          protein: Number(item.protein) || 0,
          carbs: Number(item.carbs) || 0,
          fat: Number(item.fat) || 0
        };
        applyCamScale(1);
      }

      function openCameraModal(imgDataUrl) {
        camScannedBarcode = '';
        document.getElementById('cam-preview-img').src = imgDataUrl;
        document.getElementById('cam-meal').value = state.activeTab === 'add' ? state.selectedMeal : getAutoMealByTime();
        document.getElementById('cam-save-lib').checked = true;
        renderCamQuickChips();
        const modal = document.getElementById('camera-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }

      function closeCameraModal() {
        const modal = document.getElementById('camera-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }

      function compressImageFile(file, callback) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          const img = new Image();
          img.onload = function () {
            const maxDim = 800;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
              else { w = Math.round((w * maxDim) / h); h = maxDim; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            callback(dataUrl);
          };
          img.onerror = function () { callback(ev.target.result); };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }

      const GEMINI_CANDIDATE_MODELS = [
        'gemini-flash-latest',
        'gemini-3.8-flash',
        'gemini-2.5-flash',
        'gemini-4-hydrogen',
        'gemini-3.5-flash-lite'
      ];

      function clearCamForm() {
        document.getElementById('cam-name').value = '';
        document.getElementById('cam-serving').value = state.lang === 'bn' ? '১ পরিবেশন' : '1 serving';
        camBaseNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        applyCamScale(1);
        document.getElementById('cam-cal').value = '';
      }

      async function discoverAvailableGeminiModels(apiKey) {
        const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(apiKey));
        if (!resp.ok) {
          let errMsg = 'HTTP ' + resp.status;
          try {
            const j = await resp.json();
            if (j && j.error && j.error.message) errMsg = j.error.message;
          } catch (e) {}
          throw new Error(errMsg);
        }
        const data = await resp.json();
        const list = Array.isArray(data.models) ? data.models : [];
        const usable = list
          .filter(function (m) {
            return Array.isArray(m.supportedGenerationMethods) &&
              m.supportedGenerationMethods.indexOf('generateContent') !== -1 &&
              /gemini/i.test(m.name || '');
          })
          .map(function (m) { return String(m.name).replace(/^models\//, ''); });
        // Prefer flash/hydrogen models first
        usable.sort(function (a, b) {
          const score = function (x) {
            if (/flash/i.test(x) && !/lite|exp|preview/i.test(x)) return 0;
            if (/flash/i.test(x)) return 1;
            if (/hydrogen/i.test(x)) return 2;
            return 3;
          };
          return score(a) - score(b);
        });
        return usable;
      }

      async function callGeminiWithFallback(apiKey, parts) {
        const tried = {};
        let lastErr = '';
        const queue = GEMINI_CANDIDATE_MODELS.slice();

        for (let i = 0; i < queue.length; i++) {
          const model = queue[i];
          if (tried[model]) continue;
          tried[model] = true;
          const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(apiKey);
          const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
          });
          if (resp.ok) {
            const json = await resp.json();
            return { model: model, json: json };
          }
          let msg = 'HTTP ' + resp.status;
          try {
            const ej = await resp.json();
            if (ej && ej.error && ej.error.message) msg = ej.error.message;
          } catch (e) {}
          lastErr = msg;
          // If key invalid (400/401/403), stop trying more models
          if (resp.status === 400 || resp.status === 401 || resp.status === 403) {
            if (/API key|permission|denied|invalid/i.test(msg)) throw new Error(msg);
          }
        }

        // Dynamic discovery fallback if pinned names returned 404
        const discovered = await discoverAvailableGeminiModels(apiKey);
        for (let j = 0; j < Math.min(3, discovered.length); j++) {
          const dModel = discovered[j];
          if (tried[dModel]) continue;
          const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(dModel) + ':generateContent?key=' + encodeURIComponent(apiKey);
          const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
          });
          if (resp.ok) {
            const json = await resp.json();
            return { model: dModel, json: json };
          }
        }
        throw new Error(lastErr || 'No active Gemini model responded');
      }

      function normalizeGroqKey(k) {
        const tKey = String(k || '').trim();
        return tKey.replace(/^Gsk_/, 'gsk_');
      }

      async function discoverGroqModels(apiKey, needVision) {
        const resp = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { 'Authorization': 'Bearer ' + apiKey }
        });
        if (!resp.ok) {
          let errMsg = 'HTTP ' + resp.status;
          try {
            const ej = await resp.json();
            if (ej && ej.error && ej.error.message) errMsg = ej.error.message;
          } catch (e) {}
          throw new Error(errMsg);
        }
        const data = await resp.json();
        const raw = Array.isArray(data.data) ? data.data : [];
        const ids = raw
          .map(function (m) { return m.id || ''; })
          .filter(function (id) {
            return id && !/whisper|tts|orpheus|playai|guard|safeguard|embed|rerank/i.test(id);
          });
        ids.sort(function (a, b) {
          const score = function (x) {
            if (needVision) {
              if (/vision|vl|scout|maverick|llama-4|multimodal|pixtral|gemma-3/i.test(x)) return 0;
              if (/qwen|kimi|llama-3\.3/i.test(x)) return 1;
              return 2;
            }
            if (/llama-4|scout|llama-3\.3|llama-3\.1-8b|gpt-oss|qwen/i.test(x)) return 0;
            return 1;
          };
          return score(a) - score(b);
        });
        return ids;
      }

      async function callGroqVision(rawKey, promptText, dataUrl) {
        const apiKey = normalizeGroqKey(rawKey);
        const candidates = await discoverGroqModels(apiKey, Boolean(dataUrl));
        if (!candidates.length) throw new Error('No active Groq models available');
        let lastErr = '';
        const limit = Math.min(6, candidates.length);
        for (let i = 0; i < limit; i++) {
          const model = candidates[i];
          const content = dataUrl
            ? [{ type: 'text', text: promptText }, { type: 'image_url', image_url: { url: dataUrl } }]
            : promptText;
          const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
              model: model,
              temperature: 0.2,
              max_tokens: 300,
              messages: [{ role: 'user', content: content }]
            })
          });
          if (resp.ok) {
            const json = await resp.json();
            const text = json && json.choices && json.choices[0] && json.choices[0].message ? json.choices[0].message.content : '';
            return { model: 'Groq ' + model.split('/').pop().slice(0, 18), text: text };
          }
          let msg = 'Groq HTTP ' + resp.status;
          try {
            const ej = await resp.json();
            if (ej && ej.error && ej.error.message) msg = ej.error.message;
          } catch (e) {}
          lastErr = msg;
          if (resp.status === 401 || resp.status === 403) throw new Error(msg);
        }
        throw new Error(lastErr || 'Groq vision model unavailable');
      }

      async function analyzeFoodPhotoWithGemini(dataUrl, fileName) {
        const loader = document.getElementById('cam-loading');
        const modeText = document.getElementById('cam-mode-text');
        const groqKey = (state.groqApiKey || '').trim();
        const geminiKey = (state.geminiApiKey || '').trim();

        if (!groqKey && !geminiKey) {
          loader.classList.add('hidden');
          modeText.textContent = t('camOfflineMode');
          clearCamForm();
          return;
        }

        loader.classList.remove('hidden');
        const prompt = 'Identify the food or packaged snack/drink in this photo and estimate nutrition for 1 standard serving (or visible portion). Reply ONLY with raw JSON (no markdown fences) in this exact schema: {"nameEn":"...","nameBn":"...","servingEn":"...","servingBn":"...","calories":250,"protein":12,"carbs":30,"fat":8}';
        let rawText = '';
        let usedEngine = '';
        let errors = [];

        // 1. Try Groq Vision Free Tier first if Groq key is set
        if (groqKey) {
          try {
            const gRes = await callGroqVision(groqKey, prompt, dataUrl);
            rawText = gRes.text || '';
            usedEngine = gRes.model;
          } catch (e1) {
            errors.push('Groq: ' + (e1 && e1.message ? e1.message : 'failed'));
          }
        }

        // 2. Auto-fallback to Gemini Vision if Groq wasn't set or failed
        if (!rawText && geminiKey) {
          try {
            const base64Data = dataUrl.split(',')[1];
            const result = await callGeminiWithFallback(geminiKey, [
              { text: prompt },
              { inline_data: { mime_type: 'image/jpeg', data: base64Data } }
            ]);
            const json = result.json;
            rawText = json && json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts && json.candidates[0].content.parts[0] ? json.candidates[0].content.parts[0].text : '';
            usedEngine = result.model;
          } catch (e2) {
            errors.push('Gemini: ' + (e2 && e2.message ? e2.message : 'failed'));
          }
        }

        try {
          if (!rawText) throw new Error(errors.join(' | ') || 'No AI response');
          const match = rawText.match(/\{[\s\S]*\}/);
          if (!match) throw new Error('Could not parse nutrition JSON');
          const parsed = JSON.parse(match[0]);
          fillCamForm({
            nameEn: parsed.nameEn || 'Scanned Meal',
            nameBn: parsed.nameBn || parsed.nameEn || 'ছবির খাবার',
            servingEn: parsed.servingEn || '1 serving',
            servingBn: parsed.servingBn || parsed.servingEn || '১ পরিবেশন',
            calories: Number(parsed.calories) || 0,
            protein: Number(parsed.protein) || 0,
            carbs: Number(parsed.carbs) || 0,
            fat: Number(parsed.fat) || 0
          });
          modeText.textContent = t('camAiSuccess') + ' (' + usedEngine + ')';
        } catch (err) {
          const msg = String(err && err.message ? err.message : '');
          if (/Failed to fetch|NetworkError|Load failed/i.test(msg)) {
            modeText.textContent = t('camNetBlocked');
          } else {
            modeText.textContent = t('camAiError') + (msg ? ' [' + msg.slice(0, 80) + ']' : '');
          }
          clearCamForm();
        } finally {
          loader.classList.add('hidden');
        }
      }

      let liveStream = null;
      let camFacingMode = 'environment';

      function openSourceChooser() {
        const m = document.getElementById('source-chooser-modal');
        m.classList.remove('hidden');
        m.classList.add('flex');
      }

      function closeSourceChooser() {
        const m = document.getElementById('source-chooser-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }

      function stopLiveCamera() {
        if (liveStream) {
          liveStream.getTracks().forEach(function (tr) { tr.stop(); });
          liveStream = null;
        }
        const vid = document.getElementById('live-camera-video');
        if (vid) vid.srcObject = null;
        const m = document.getElementById('live-camera-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }

      function triggerNativeCameraInput() {
        const inp = document.getElementById('camera-file-input');
        inp.value = '';
        inp.click();
      }

      function triggerGalleryInput() {
        const inp = document.getElementById('gallery-file-input');
        inp.value = '';
        inp.click();
      }

      async function startLiveCamera() {
        closeSourceChooser();
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          triggerNativeCameraInput();
          return;
        }
        stopLiveCamera();
        try {
          liveStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: camFacingMode } },
            audio: false
          });
          const vid = document.getElementById('live-camera-video');
          vid.srcObject = liveStream;
          const m = document.getElementById('live-camera-modal');
          m.classList.remove('hidden');
          m.classList.add('flex');
        } catch (err) {
          stopLiveCamera();
          triggerNativeCameraInput();
        }
      }

      function captureFromLiveVideo() {
        const vid = document.getElementById('live-camera-video');
        if (!vid || !vid.videoWidth) return;
        const maxDim = 800;
        let w = vid.videoWidth;
        let h = vid.videoHeight;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(vid, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        stopLiveCamera();
        openCameraModal(dataUrl);
        analyzeFoodPhotoWithGemini(dataUrl, 'camera_photo.jpg');
      }

      function handleSelectedPhotoFile(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        closeSourceChooser();
        stopLiveCamera();
        compressImageFile(file, function (dataUrl) {
          openCameraModal(dataUrl);
          analyzeFoodPhotoWithGemini(dataUrl, file.name);
        });
      }

      document.getElementById('btn-camera-today').addEventListener('click', openSourceChooser);
      document.getElementById('btn-camera-add').addEventListener('click', openSourceChooser);
      document.getElementById('btn-cam-retake').addEventListener('click', function () {
        closeCameraModal();
        openSourceChooser();
      });
      document.getElementById('btn-close-cam-modal').addEventListener('click', closeCameraModal);

      document.getElementById('btn-close-chooser').addEventListener('click', closeSourceChooser);
      document.getElementById('btn-chooser-cancel').addEventListener('click', closeSourceChooser);
      document.getElementById('btn-pick-live-camera').addEventListener('click', startLiveCamera);
      document.getElementById('btn-pick-gallery').addEventListener('click', function () {
        closeSourceChooser();
        triggerGalleryInput();
      });

      document.getElementById('btn-close-live-cam').addEventListener('click', stopLiveCamera);
      document.getElementById('btn-flip-camera').addEventListener('click', function () {
        camFacingMode = camFacingMode === 'environment' ? 'user' : 'environment';
        startLiveCamera();
      });
      document.getElementById('btn-live-shutter').addEventListener('click', captureFromLiveVideo);
      document.getElementById('btn-live-switch-gallery').addEventListener('click', function () {
        stopLiveCamera();
        triggerGalleryInput();
      });
      document.getElementById('btn-live-native-cam').addEventListener('click', function () {
        stopLiveCamera();
        triggerNativeCameraInput();
      });

      document.getElementById('camera-file-input').addEventListener('change', handleSelectedPhotoFile);
      document.getElementById('gallery-file-input').addEventListener('change', handleSelectedPhotoFile);

      document.getElementById('cam-quick-chips').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-cam-pick]');
        if (!btn) return;
        const fid = btn.getAttribute('data-cam-pick');
        const allFoods = state.customFoods.concat(PRESET_FOODS);
        const found = allFoods.find(function (f) { return f.id === fid; });
        if (found) fillCamForm(found);
      });

      document.getElementById('cam-scale-pills').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-cam-scale]');
        if (!btn) return;
        applyCamScale(Number(btn.getAttribute('data-cam-scale')) || 1);
      });

      document.getElementById('cam-result-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = (document.getElementById('cam-name').value || '').trim();
        if (!name) return;
        const meal = document.getElementById('cam-meal').value || getAutoMealByTime();
        const serving = (document.getElementById('cam-serving').value || '').trim() || (state.lang === 'bn' ? '১ পরিবেশন' : '1 serving');
        const cal = Number(document.getElementById('cam-cal').value) || 0;
        const pro = Number(document.getElementById('cam-pro').value) || 0;
        const carb = Number(document.getElementById('cam-carb').value) || 0;
        const fat = Number(document.getElementById('cam-fat').value) || 0;
        const saveLib = document.getElementById('cam-save-lib').checked;

        const camPreviewSrc = (document.getElementById('cam-preview-img') || {}).src || '';
        const foodObj = {
          id: 'cam_' + Date.now(),
          nameEn: name,
          nameBn: name,
          servingEn: serving,
          servingBn: serving,
          calories: cal,
          protein: pro,
          carbs: carb,
          fat: fat,
          barcode: camScannedBarcode || '',
          emoji: camScannedBarcode ? '🏷️' : '📷',
          photo: camPreviewSrc.indexOf('data:image') === 0 ? shrinkDataUrlThumb(camPreviewSrc) : ''
        };
        confirmBeforeAddFood(foodObj, meal, 1, function () {
          let wasDupLib = false;
          if (saveLib) {
            wasDupLib = !addCustomFoodUnique(foodObj);
          }
          logFoodItem(foodObj, meal, 1);
          if (wasDupLib) {
            showToast(state.lang === 'bn' ? 'একই নাম/বারকোড তালিকায় আগেই আছে — শুধু আজকের হিসাবে যোগ হয়েছে' : 'Exact name/barcode already saved — logged to today only');
          }
          closeCameraModal();
          switchTab('today');
        });
      });

      /* ======================== FIREBASE AUTH & FIRESTORE SYNC ======================== */
      const DEFAULT_FIREBASE_CONFIG = {
        apiKey: "AIzaSyDTa6QDG653jRSeylE392IWv6fKOITdlw4",
        authDomain: "calories-tracker-4b0bb.firebaseapp.com",
        projectId: "calories-tracker-4b0bb",
        storageBucket: "calories-tracker-4b0bb.firebasestorage.app",
        messagingSenderId: "250215786286",
        appId: "1:250215786286:web:8290ab24ea321f9099bcbf"
      };

      let fbApp = null;
      let fbAuth = null;
      let fbDb = null;
      let fbUser = null;
      let fbUnsub = null;
      let fbPushTimer = null;
      let fbApplyingRemote = false;
      let fbLastSyncTime = '';

      function getActiveFirebaseConfig() {
        if (state.firebaseConfig && state.firebaseConfig.apiKey && state.firebaseConfig.projectId) {
          return state.firebaseConfig;
        }
        if (DEFAULT_FIREBASE_CONFIG && DEFAULT_FIREBASE_CONFIG.apiKey && DEFAULT_FIREBASE_CONFIG.projectId) {
          return DEFAULT_FIREBASE_CONFIG;
        }
        return null;
      }

      function renderProfileAvatars() {
        const photoSrc = state.customAvatar || (fbUser && fbUser.photoURL ? fbUser.photoURL : '');
        const hImg = document.getElementById('header-avatar-img');
        const hSvg = document.getElementById('header-avatar-svg');
        const mImg = document.getElementById('menu-avatar-img');
        const mSvg = document.getElementById('menu-avatar-svg');
        const remBtn = document.getElementById('btn-menu-remove-photo');

        if (photoSrc) {
          if (hImg) { hImg.src = photoSrc; hImg.classList.remove('hidden'); }
          if (hSvg) hSvg.classList.add('hidden');
          if (mImg) { mImg.src = photoSrc; mImg.classList.remove('hidden'); }
          if (mSvg) mSvg.classList.add('hidden');
        } else {
          if (hImg) hImg.classList.add('hidden');
          if (hSvg) hSvg.classList.remove('hidden');
          if (mImg) mImg.classList.add('hidden');
          if (mSvg) mSvg.classList.remove('hidden');
        }
        if (remBtn) remBtn.classList.toggle('hidden', !state.customAvatar);
      }

      function renderFirebaseUI() {
        const pill = document.getElementById('fb-status-pill');
        const menuSyncBtn = document.getElementById('btn-menu-sync');
        const menuLogoutBtn = document.getElementById('btn-menu-logout');
        const menuEmailEl = document.getElementById('menu-user-email');
        const lastEl = document.getElementById('fb-last-sync');

        if (!pill || !menuEmailEl) return;
        if (fbUser) {
          const userLabel = fbUser.email || fbUser.displayName || fbUser.uid;
          pill.textContent = t('fbConnected');
          pill.className = 'shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300';
          menuEmailEl.textContent = userLabel;
          if (lastEl) lastEl.textContent = fbLastSyncTime ? (t('fbSyncedAt') + fbLastSyncTime) : '';
          if (menuSyncBtn) menuSyncBtn.classList.remove('hidden');
          if (menuLogoutBtn) {
            menuLogoutBtn.textContent = '🚪 ' + t('fbLogout');
            menuLogoutBtn.className = 'w-full py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900 transition';
          }
          hideLoginScreen();
        } else {
          const guestLabel = state.lang === 'bn' ? 'অফলাইন / গেস্ট' : 'Offline / Guest';
          pill.textContent = t('fbOffline');
          pill.className = 'shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
          menuEmailEl.textContent = guestLabel;
          if (lastEl) lastEl.textContent = '';
          if (menuSyncBtn) menuSyncBtn.classList.add('hidden');
          if (menuLogoutBtn) {
            menuLogoutBtn.textContent = '🔐 ' + t('loginBtn');
            menuLogoutBtn.className = 'w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition';
          }
        }
        renderProfileAvatars();
      }

      function getCloudDocRef() {
        if (!fbDb || !fbUser) return null;
        return fbDb.collection('users').doc(fbUser.uid).collection('apps').doc('calorie_tracker');
      }

      async function pushStateToCloud(showSuccessToast) {
        const ref = getCloudDocRef();
        if (!ref || fbApplyingRemote) return;
        try {
          await ref.set({
            goals: state.goals,
            logsByDate: state.logsByDate,
            customFoods: state.customFoods,
            geminiApiKey: state.geminiApiKey || '',
            customAvatar: state.customAvatar || '',
            weightLog: state.weightLog || {},
            accent: state.accent || 'emerald',
            groqApiKey: state.groqApiKey || '',
            updatedAt: Date.now()
          }, { merge: true });
          fbLastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          renderFirebaseUI();
          if (showSuccessToast) showToast(t('fbToastSynced'));
        } catch (err) {
          const msgEl = document.getElementById('fb-msg-line');
          if (msgEl) msgEl.textContent = '⚠️ ' + (err && err.message ? err.message : 'Sync error');
        }
      }

      function scheduleCloudPush() {
        if (!fbUser || fbApplyingRemote) return;
        if (fbPushTimer) clearTimeout(fbPushTimer);
        fbPushTimer = setTimeout(function () { pushStateToCloud(false); }, 900);
      }

      function attachFirestoreListener() {
        if (fbUnsub) { fbUnsub(); fbUnsub = null; }
        const ref = getCloudDocRef();
        if (!ref) return;
        const skel = document.getElementById('cloud-skeleton');
        if (skel && Object.keys(state.logsByDate || {}).length === 0) skel.classList.remove('hidden');
        fbUnsub = ref.onSnapshot(function (snap) {
          if (skel) skel.classList.add('hidden');
          if (!snap.exists) {
            pushStateToCloud(false);
            return;
          }
          const data = snap.data() || {};
          fbApplyingRemote = true;
          try {
            if (data.goals && typeof data.goals === 'object') {
              state.goals = { ...state.goals, ...data.goals };
            }
            if (data.logsByDate && typeof data.logsByDate === 'object') {
              state.logsByDate = data.logsByDate;
            }
            if (Array.isArray(data.customFoods)) {
              state.customFoods = data.customFoods;
            }
            if (typeof data.geminiApiKey === 'string' && data.geminiApiKey) {
              state.geminiApiKey = data.geminiApiKey;
            }
            if (typeof data.customAvatar === 'string') {
              state.customAvatar = data.customAvatar;
            }
            if (data.weightLog && typeof data.weightLog === 'object') {
              state.weightLog = data.weightLog;
            }
            if (typeof data.accent === 'string' && data.accent) {
              state.accent = data.accent;
            }
            if (typeof data.groqApiKey === 'string' && data.groqApiKey) {
              state.groqApiKey = data.groqApiKey;
            }
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({
                lang: state.lang,
                theme: state.theme,
                goals: state.goals,
                logsByDate: state.logsByDate,
                customFoods: state.customFoods,
                geminiApiKey: state.geminiApiKey || '',
                firebaseConfig: state.firebaseConfig || null,
                customAvatar: state.customAvatar || '',
                weightLog: state.weightLog || {},
                accent: state.accent || 'emerald',
                groqApiKey: state.groqApiKey || ''
              }));
            } catch (e) {}
            fbLastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            renderAll();
          } finally {
            fbApplyingRemote = false;
          }
        }, function (err) {
          const msgEl = document.getElementById('fb-msg-line');
          if (msgEl) msgEl.textContent = '⚠️ ' + (err && err.message ? err.message : 'Firestore error');
        });
      }

      function initFirebaseIfConfigured() {
        const cfg = getActiveFirebaseConfig();
        const msgEl = document.getElementById('fb-msg-line');
        if (!cfg || typeof firebase === 'undefined') {
          renderFirebaseUI();
          return;
        }
        try {
          if (firebase.apps && firebase.apps.length > 0) {
            fbApp = firebase.apps[0];
          } else {
            fbApp = firebase.initializeApp(cfg);
          }
          fbAuth = firebase.auth();
          fbDb = firebase.firestore();
          try {
            fbDb.enablePersistence({ synchronizeTabs: true }).catch(function () {});
          } catch (e) {}
          fbAuth.onAuthStateChanged(function (user) {
            fbUser = user || null;
            if (msgEl) msgEl.textContent = '';
            if (fbUser) {
              try { localStorage.setItem('cal_tracker_authed', '1'); } catch (e) {}
              hideLoginScreen();
              attachFirestoreListener();
            } else {
              try { localStorage.removeItem('cal_tracker_authed'); } catch (e) {}
              if (fbUnsub) {
                fbUnsub();
                fbUnsub = null;
              }
              let isGuest = false;
              try { isGuest = localStorage.getItem('cal_tracker_guest_ok') === '1'; } catch (e) {}
              if (!isGuest) showLoginScreen();
            }
            renderFirebaseUI();
          });
        } catch (err) {
          if (msgEl) msgEl.textContent = '⚠️ ' + (err && err.message ? err.message : 'Firebase init error');
        }
        renderFirebaseUI();
      }

      function parseFirebaseConfigInput(raw) {
        let text = String(raw || '').trim();
        if (!text) return null;
        // Allow pasting full JS snippet like `const firebaseConfig = { apiKey: "...", ... };`
        const braceMatch = text.match(/\{[\s\S]*\}/);
        if (braceMatch) text = braceMatch[0];
        try {
          return JSON.parse(text);
        } catch (e) {
          // Convert JS object keys (unquoted) & single quotes to valid JSON
          const fixed = text
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
            .replace(/'/g, '"')
            .replace(/,\s*}/g, '}');
          return JSON.parse(fixed);
        }
      }

      function showLoginScreen() {
        const el = document.getElementById('login-screen');
        if (el) el.classList.remove('hidden');
      }

      function hideLoginScreen() {
        const el = document.getElementById('login-screen');
        if (el) el.classList.add('hidden');
      }

      function showLoginError(msg) {
        const el = document.getElementById('login-err-msg');
        if (!el) return;
        if (!msg) {
          el.classList.add('hidden');
          el.textContent = '';
        } else {
          el.textContent = msg;
          el.classList.remove('hidden');
        }
      }

      document.getElementById('btn-login-lang').addEventListener('click', function () {
        state.lang = state.lang === 'bn' ? 'en' : 'bn';
        saveState();
        renderAll();
      });

      document.getElementById('btn-login-guest').addEventListener('click', function () {
        try { localStorage.setItem('cal_tracker_guest_ok', '1'); } catch (e) {}
        hideLoginScreen();
      });

      document.getElementById('btn-header-profile').addEventListener('click', triggerProfilePhotoUpload);

      document.getElementById('btn-login-google').addEventListener('click', async function () {
        if (!fbAuth) {
          showLoginError(t('loginNeedFb'));
          return;
        }
        showLoginError('');
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          await fbAuth.signInWithPopup(provider);
          hideLoginScreen();
        } catch (err) {
          showLoginError('⚠️ ' + (err && err.message ? err.message : 'Google Sign-In failed'));
        }
      });

      document.getElementById('login-email-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!fbAuth) {
          showLoginError(t('loginNeedFb'));
          return;
        }
        const email = (document.getElementById('login-email-inp').value || '').trim();
        const pass = document.getElementById('login-pass-inp').value || '';
        showLoginError('');
        try {
          await fbAuth.signInWithEmailAndPassword(email, pass);
          hideLoginScreen();
        } catch (err) {
          showLoginError('⚠️ ' + (err && err.message ? err.message : 'Login failed'));
        }
      });

      document.getElementById('btn-login-email-signup').addEventListener('click', async function () {
        if (!fbAuth) {
          showLoginError(t('loginNeedFb'));
          return;
        }
        const email = (document.getElementById('login-email-inp').value || '').trim();
        const pass = document.getElementById('login-pass-inp').value || '';
        if (!email || pass.length < 6) {
          showLoginError('⚠️ Email & 6+ char password required');
          return;
        }
        showLoginError('');
        try {
          await fbAuth.createUserWithEmailAndPassword(email, pass);
          hideLoginScreen();
        } catch (err) {
          showLoginError('⚠️ ' + (err && err.message ? err.message : 'Sign-up failed'));
        }
      });

      function applyAiKeyLockState() {
        const locked = Boolean(state.aiKeysLocked);
        const chk = document.getElementById('chk-ai-key-lock');
        const gInp = document.getElementById('input-groq-key');
        const mInp = document.getElementById('input-gemini-key');
        const saveBtn = document.getElementById('btn-save-ai-key');
        const badge = document.getElementById('ai-lock-badge');
        if (chk) chk.checked = locked;
        if (gInp) gInp.disabled = locked;
        if (mInp) mInp.disabled = locked;
        if (saveBtn) saveBtn.disabled = locked;
        if (badge) badge.classList.toggle('hidden', !locked);
      }

      function openAiKeyModal() {
        syncGoalInputs();
        applyAiKeyLockState();
        const m = document.getElementById('ai-key-modal');
        m.classList.remove('hidden');
        m.classList.add('flex');
      }

      function closeAiKeyModal() {
        const m = document.getElementById('ai-key-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }

      document.getElementById('btn-open-ai-key-modal').addEventListener('click', openAiKeyModal);
      document.getElementById('btn-close-ai-key-modal').addEventListener('click', closeAiKeyModal);
      document.getElementById('ai-key-modal').addEventListener('click', function (e) {
        if (e.target.id === 'ai-key-modal') closeAiKeyModal();
      });

      document.getElementById('chk-ai-key-lock').addEventListener('change', function (e) {
        state.aiKeysLocked = Boolean(e.target.checked);
        saveState();
        applyAiKeyLockState();
        renderStaticLabels();
        showToast(state.aiKeysLocked ? t('toastKeysLocked') : t('toastKeysUnlocked'));
      });

      document.getElementById('ai-key-form').addEventListener('submit', function (e) {
        e.preventDefault();
        if (state.aiKeysLocked) return;
        const gVal = normalizeGroqKey(document.getElementById('input-groq-key').value);
        const mVal = (document.getElementById('input-gemini-key').value || '').trim();
        state.groqApiKey = gVal;
        state.geminiApiKey = mVal;
        saveState();
        renderStaticLabels();
        showToast((gVal || mVal) ? t('toastKeySaved') : t('toastKeyCleared'));
      });

      document.getElementById('btn-test-ai-key').addEventListener('click', async function () {
        const gVal = normalizeGroqKey(document.getElementById('input-groq-key').value);
        const mVal = (document.getElementById('input-gemini-key').value || '').trim();
        const statusEl = document.getElementById('lbl-ai-key-status');
        if (!gVal && !mVal) {
          statusEl.textContent = t('aiKeyEmpty');
          return;
        }
        state.groqApiKey = gVal;
        state.geminiApiKey = mVal;
        saveState();
        statusEl.textContent = t('aiTesting');
        const results = [];
        if (gVal) {
          try {
            const gr = await callGroqVision(gVal, 'Reply OK', null);
            results.push('✅ ' + gr.model);
          } catch (e1) {
            results.push('❌ Groq: ' + String(e1 && e1.message ? e1.message : 'err').slice(0, 45));
          }
        }
        if (mVal) {
          try {
            const mr = await callGeminiWithFallback(mVal, [{ text: 'Reply OK' }]);
            results.push('✅ Gemini (' + mr.model + ')');
          } catch (e2) {
            results.push('❌ Gemini: ' + String(e2 && e2.message ? e2.message : 'err').slice(0, 45));
          }
        }
        statusEl.textContent = results.join(' · ');
      });

      /* ======================== FREE BARCODE SCANNER (OPEN FOOD FACTS) ======================== */
      let barcodeStream = null;
      let barcodeScanTimer = null;
      let barcodeScanMode = 'food';

      function stopBarcodeScanner() {
        if (barcodeScanTimer) { clearInterval(barcodeScanTimer); barcodeScanTimer = null; }
        if (barcodeStream) {
          barcodeStream.getTracks().forEach(function (tr) { tr.stop(); });
          barcodeStream = null;
        }
        const vid = document.getElementById('barcode-video');
        if (vid) vid.srcObject = null;
        const m = document.getElementById('barcode-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }

      async function lookupBarcodeOpenFoodFacts(code) {
        const cleanCode = String(code || '').replace(/[^0-9]/g, '');
        const statusEl = document.getElementById('barcode-status-msg');
        if (!cleanCode) return;
        statusEl.textContent = t('barcodeSearching');
        try {
          const resp = await fetch('https://world.openfoodfacts.org/api/v2/product/' + encodeURIComponent(cleanCode) + '.json');
          const data = await resp.json();
          if (!data || data.status !== 1 || !data.product) {
            statusEl.textContent = t('barcodeNotFound');
            return;
          }
          const p = data.product;
          const n = p.nutriments || {};
          const hasServing = n['energy-kcal_serving'] !== undefined && n['energy-kcal_serving'] !== null;
          const kcal = Math.round(Number(hasServing ? n['energy-kcal_serving'] : (n['energy-kcal_100g'] || n['energy-kcal'] || 0)) || 0);
          const pro = Math.round((Number(hasServing ? n['proteins_serving'] : (n['proteins_100g'] || 0)) || 0) * 10) / 10;
          const carb = Math.round((Number(hasServing ? n['carbohydrates_serving'] : (n['carbohydrates_100g'] || 0)) || 0) * 10) / 10;
          const fat = Math.round((Number(hasServing ? n['fat_serving'] : (n['fat_100g'] || 0)) || 0) * 10) / 10;
          const pName = p.product_name || p.brands || ('Barcode ' + cleanCode);
          const pSrv = hasServing && p.serving_size ? p.serving_size : '100g';
          const pImg = p.image_front_small_url || p.image_url || ICON_URI;

          stopBarcodeScanner();
          openCameraModal(pImg);
          camScannedBarcode = cleanCode;
          fillCamForm({
            nameEn: pName,
            nameBn: pName,
            servingEn: pSrv,
            servingBn: pSrv,
            calories: kcal,
            protein: pro,
            carbs: carb,
            fat: fat
          });
          document.getElementById('cam-loading').classList.add('hidden');
          document.getElementById('cam-mode-text').textContent = t('barcodeSuccess') + ' (#' + cleanCode + ')';
        } catch (err) {
          statusEl.textContent = t('camNetBlocked');
        }
      }

      async function openBarcodeScanner() {
        closeSourceChooser();
        const m = document.getElementById('barcode-modal');
        const statusEl = document.getElementById('barcode-status-msg');
        statusEl.textContent = '';
        document.getElementById('input-barcode-num').value = '';
        m.classList.remove('hidden');
        m.classList.add('flex');

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
        try {
          barcodeStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false
          });
          const vid = document.getElementById('barcode-video');
          vid.srcObject = barcodeStream;
          if ('BarcodeDetector' in window) {
            const detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
            barcodeScanTimer = setInterval(async function () {
              if (!vid || vid.readyState < 2) return;
              try {
                const found = await detector.detect(vid);
                if (found && found.length > 0 && found[0].rawValue) {
                  clearInterval(barcodeScanTimer);
                  barcodeScanTimer = null;
                  if (barcodeScanMode === 'product_info') {
                    stopBarcodeScanner();
                    document.getElementById('input-settings-barcode').value = found[0].rawValue;
                    lookupProductPriceAndDetails(found[0].rawValue);
                  } else {
                    lookupBarcodeOpenFoodFacts(found[0].rawValue);
                  }
                }
              } catch (e) {}
            }, 450);
          }
        } catch (err) {}
      }

      document.getElementById('btn-pick-barcode').addEventListener('click', function () {
        barcodeScanMode = 'food';
        openBarcodeScanner();
      });
      document.getElementById('btn-close-barcode').addEventListener('click', stopBarcodeScanner);
      document.getElementById('barcode-manual-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const code = document.getElementById('input-barcode-num').value;
        if (barcodeScanMode === 'product_info') {
          stopBarcodeScanner();
          document.getElementById('input-settings-barcode').value = code;
          lookupProductPriceAndDetails(code);
        } else {
          lookupBarcodeOpenFoodFacts(code);
        }
      });

      async function lookupProductPriceAndDetails(rawCode) {
        const code = String(rawCode || '').replace(/[^0-9]/g, '');
        const statusEl = document.getElementById('prod-check-status');
        const resEl = document.getElementById('prod-check-result');
        if (!code) return;
        statusEl.textContent = t('prodSearching');
        resEl.classList.add('hidden');
        resEl.innerHTML = '';

        const endpoints = [
          'https://world.openfoodfacts.org/api/v2/product/' + encodeURIComponent(code) + '.json',
          'https://world.openproductsfacts.org/api/v2/product/' + encodeURIComponent(code) + '.json',
          'https://world.openbeautyfacts.org/api/v2/product/' + encodeURIComponent(code) + '.json'
        ];

        let product = null;
        let prices = [];
        try {
          // Fetch prices in parallel with Open Food Facts
          const pricePromise = fetch('https://prices.openfoodfacts.org/api/v1/prices?product_code=' + encodeURIComponent(code) + '&size=5')
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (j) { return (j && Array.isArray(j.items)) ? j.items : []; })
            .catch(function () { return []; });

          for (let i = 0; i < endpoints.length; i++) {
            try {
              const resp = await fetch(endpoints[i]);
              if (!resp.ok) continue;
              const data = await resp.json();
              if (data && data.status === 1 && data.product) {
                product = data.product;
                break;
              }
            } catch (e) {}
          }
          prices = await pricePromise;
        } catch (err) {
          statusEl.textContent = t('camNetBlocked');
          return;
        }

        const googleQuery = encodeURIComponent((product && product.product_name ? product.product_name + ' ' : '') + code + ' price');
        const googleUrl = 'https://www.google.com/search?q=' + googleQuery;

        function getBarcodeOriginCountry(bc) {
          const p3 = Number(String(bc).slice(0, 3));
          if (p3 === 628) return state.lang === 'bn' ? '🇸🇦 সৌদি আরব (Saudi Arabia)' : '🇸🇦 Saudi Arabia';
          if (p3 === 894) return state.lang === 'bn' ? '🇧🇩 বাংলাদেশ (Bangladesh)' : '🇧🇩 Bangladesh';
          if (p3 === 890) return state.lang === 'bn' ? '🇮🇳 ভারত (India)' : '🇮🇳 India';
          if (p3 === 629) return state.lang === 'bn' ? '🇦🇪 সংযুক্ত আরব আমিরাত (UAE)' : '🇦🇪 UAE';
          if (p3 === 896) return state.lang === 'bn' ? '🇵🇰 পাকিস্তান (Pakistan)' : '🇵🇰 Pakistan';
          if (p3 === 622) return state.lang === 'bn' ? '🇪🇬 মিশর (Egypt)' : '🇪🇬 Egypt';
          if (p3 === 869 || p3 === 868) return state.lang === 'bn' ? '🇹🇷 তুরস্ক (Turkey)' : '🇹🇷 Turkey';
          if (p3 >= 690 && p3 <= 699) return state.lang === 'bn' ? '🇨🇳 চীন (China)' : '🇨🇳 China';
          if (p3 >= 500 && p3 <= 509) return state.lang === 'bn' ? '🇬🇧 যুক্তরাজ্য (UK)' : '🇬🇧 United Kingdom';
          if (p3 >= 400 && p3 <= 440) return state.lang === 'bn' ? '🇩🇪 জার্মানি (Germany)' : '🇩🇪 Germany';
          if (p3 >= 300 && p3 <= 379) return state.lang === 'bn' ? '🇫🇷 ফ্রান্স (France)' : '🇫🇷 France';
          if (p3 >= 800 && p3 <= 839) return state.lang === 'bn' ? '🇮🇹 ইতালি (Italy)' : '🇮🇹 Italy';
          if (p3 === 880) return state.lang === 'bn' ? '🇰🇷 দক্ষিণ কোরিয়া (South Korea)' : '🇰🇷 South Korea';
          if (p3 >= 450 && p3 <= 459 || p3 >= 490 && p3 <= 499) return state.lang === 'bn' ? '🇯🇵 জাপান (Japan)' : '🇯🇵 Japan';
          if (p3 === 885) return state.lang === 'bn' ? '🇹🇭 থাইল্যান্ড (Thailand)' : '🇹🇭 Thailand';
          if (p3 === 955) return state.lang === 'bn' ? '🇲🇾 মালয়েশিয়া (Malaysia)' : '🇲🇾 Malaysia';
          if (p3 === 899) return state.lang === 'bn' ? '🇮🇩 ইন্দোনেশিয়া (Indonesia)' : '🇮🇩 Indonesia';
          if (p3 >= 0 && p3 <= 139) return state.lang === 'bn' ? '🇺🇸 যুক্তরাষ্ট্র / কানাডা (USA/Canada)' : '🇺🇸 USA / Canada';
          return '';
        }

        const originCountry = getBarcodeOriginCountry(code);

        if (!product && prices.length === 0) {
          statusEl.textContent = t('prodNotFound');
          resEl.innerHTML =
            '<div class="space-y-2.5">' +
              '<div class="flex items-center justify-between gap-2">' +
                '<span class="text-xs font-mono font-extrabold text-slate-800 dark:text-slate-100">#' + escapeHtml(code) + '</span>' +
                (originCountry ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">' + escapeHtml(originCountry) + '</span>' : '') +
              '</div>' +
              '<div class="grid grid-cols-2 gap-2">' +
                '<button type="button" data-open-google="' + escapeHtml(googleUrl) + '" data-bc-code="' + escapeHtml(code) + '" data-bc-origin="' + escapeHtml(originCountry) + '" class="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition">' + escapeHtml(t('prodGooglePrice')) + '</button>' +
                '<button type="button" data-copy-barcode="' + escapeHtml(code) + '" class="py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition">📋 ' + (state.lang === 'bn' ? 'নম্বর কপি' : 'Copy Code') + '</button>' +
              '</div>' +
            '</div>';
          resEl.classList.remove('hidden');
          return;
        }

        statusEl.textContent = '';
        const pName = (product && (product.product_name || product.generic_name)) || ('Product #' + code);
        const brand = (product && product.brands) || '';
        const qty = (product && product.quantity) || '';
        const imgUrl = (product && (product.image_front_small_url || product.image_url)) || '';
        const cats = (product && product.categories) ? String(product.categories).split(',').slice(0, 3).join(', ') : '';
        const ing = (product && (product.ingredients_text_en || product.ingredients_text)) ? String(product.ingredients_text_en || product.ingredients_text).slice(0, 180) : '';
        const nutri = (product && product.nutriscore_grade) ? String(product.nutriscore_grade).toUpperCase() : '';
        const n = (product && product.nutriments) || {};
        const kcal100 = n['energy-kcal_100g'] !== undefined ? Math.round(Number(n['energy-kcal_100g']) || 0) : null;

        let priceHtml = '';
        if (prices.length > 0) {
          const priceRows = prices.slice(0, 3).map(function (pr) {
            const loc = pr.location && pr.location.osm_name ? ' · ' + pr.location.osm_name : (pr.location && pr.location.city ? ' · ' + pr.location.city : '');
            const dt = pr.date ? ' (' + pr.date + ')' : '';
            return '<span class="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold mr-1.5 mb-1">' +
              escapeHtml(String(pr.price) + ' ' + (pr.currency || '') + loc + dt) + '</span>';
          }).join('');
          priceHtml = '<div><p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">' + escapeHtml(t('prodPriceLbl')) + '</p><div>' + priceRows + '</div></div>';
        } else {
          priceHtml = '<p class="text-[11px] font-semibold text-amber-600 dark:text-amber-400">💰 ' + escapeHtml(t('prodNoPrice')) + '</p>';
        }

        resEl.innerHTML =
          '<div class="flex items-start gap-3">' +
            (imgUrl ? '<img loading="lazy" src="' + escapeHtml(imgUrl) + '" alt="Product" class="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200 dark:border-slate-700 shrink-0">' : '') +
            '<div class="min-w-0 flex-1">' +
              '<p class="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">' + escapeHtml(pName) + '</p>' +
              (brand || qty ? '<p class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">' + escapeHtml([brand, qty].filter(Boolean).join(' · ')) + '</p>' : '') +
              '<p class="text-[10px] font-mono text-slate-400 mt-0.5">#' + escapeHtml(code) + (nutri ? ' · Nutri-Score: ' + escapeHtml(nutri) : '') + '</p>' +
            '</div>' +
          '</div>' +
          priceHtml +
          (kcal100 !== null ? '<p class="text-[11px] font-semibold text-slate-700 dark:text-slate-300">🔥 ' + kcal100 + ' kcal / 100g (P:' + (Math.round((Number(n.proteins_100g) || 0) * 10) / 10) + 'g · C:' + (Math.round((Number(n.carbohydrates_100g) || 0) * 10) / 10) + 'g · F:' + (Math.round((Number(n.fat_100g) || 0) * 10) / 10) + 'g)</p>' : '') +
          (cats ? '<p class="text-[11px] text-slate-500 dark:text-slate-400"><b>Category:</b> ' + escapeHtml(cats) + '</p>' : '') +
          (ing ? '<p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed"><b>Ingredients:</b> ' + escapeHtml(ing) + '</p>' : '') +
          (originCountry ? '<p class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">🌍 ' + escapeHtml(originCountry) + '</p>' : '') +
          '<div class="grid grid-cols-3 gap-2">' +
            '<button type="button" data-open-google="' + escapeHtml(googleUrl) + '" data-bc-code="' + escapeHtml(code) + '" data-bc-name="' + escapeHtml(pName) + '" data-bc-origin="' + escapeHtml(originCountry) + '" class="col-span-2 py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition">' + escapeHtml(t('prodGooglePrice')) + '</button>' +
            '<button type="button" data-copy-barcode="' + escapeHtml(code) + '" class="py-2 px-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition">📋 ' + (state.lang === 'bn' ? 'কপি' : 'Copy') + '</button>' +
          '</div>';
        resEl.classList.remove('hidden');
      }

      document.getElementById('btn-settings-barcode-scan').addEventListener('click', function () {
        barcodeScanMode = 'product_info';
        openBarcodeScanner();
      });

      document.getElementById('settings-barcode-form').addEventListener('submit', function (e) {
        e.preventDefault();
        lookupProductPriceAndDetails(document.getElementById('input-settings-barcode').value);
      });

      let currentPopupUrl = '';

      function closeProdPopup() {
        const m = document.getElementById('prod-popup-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }

      document.getElementById('btn-close-prod-popup').addEventListener('click', closeProdPopup);
      document.getElementById('prod-popup-modal').addEventListener('click', function (e) {
        if (e.target.id === 'prod-popup-modal') closeProdPopup();
      });

      document.getElementById('btn-popup-open-ext').addEventListener('click', function () {
        if (!currentPopupUrl) return;
        const win = window.open(currentPopupUrl, '_blank', 'noopener,noreferrer');
        if (!win) {
          copyTextSafe(currentPopupUrl);
          showToast(state.lang === 'bn' ? 'লিংক কপি হয়েছে — Chrome-এ পেস্ট করুন!' : 'Link copied — paste in Chrome!');
        }
      });

      document.getElementById('btn-popup-copy-link').addEventListener('click', function () {
        if (!currentPopupUrl) return;
        copyTextSafe(currentPopupUrl);
        showToast(state.lang === 'bn' ? 'Google সার্চ লিংক কপি হয়েছে!' : 'Google search link copied!');
      });

      async function openProductDetailsPopup(code, prodName, originCountry, googleUrl) {
        currentPopupUrl = googleUrl;
        const m = document.getElementById('prod-popup-modal');
        const bodyEl = document.getElementById('prod-popup-body');
        document.getElementById('prod-popup-title').textContent = state.lang === 'bn' ? '🔍 পণ্যের দাম ও বিস্তারিত' : '🔍 Product Price & Details';
        document.getElementById('btn-popup-open-ext').textContent = state.lang === 'bn' ? '🌐 ব্রাউজারে খুলুন' : '🌐 Open in Browser';
        document.getElementById('btn-popup-copy-link').textContent = state.lang === 'bn' ? '📋 লিংক কপি' : '📋 Copy Link';

        const cleanQuery = encodeURIComponent((prodName && !prodName.startsWith('Product #') ? prodName + ' ' : '') + code);
        const amzUrl = 'https://www.amazon.sa/s?k=' + cleanQuery;
        const noonUrl = 'https://www.noon.com/saudi-en/search/?q=' + cleanQuery;

        bodyEl.innerHTML =
          '<div class="rounded-2xl p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1.5">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<span class="font-mono font-extrabold text-sm text-slate-900 dark:text-white">#' + escapeHtml(code) + '</span>' +
              (originCountry ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">' + escapeHtml(originCountry) + '</span>' : '') +
            '</div>' +
            (prodName && !prodName.startsWith('Product #') ? '<p class="font-bold text-slate-800 dark:text-slate-100">' + escapeHtml(prodName) + '</p>' : '') +
          '</div>' +
          '<div id="prod-popup-ai-box" class="rounded-2xl p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">' +
            '<p class="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">' + (state.lang === 'bn' ? '⏳ AI দিয়ে পণ্যের তথ্য ও আনুমানিক দাম খোঁজা হচ্ছে...' : '⏳ Checking product info & estimated price with AI...') + '</p>' +
          '</div>' +
          '<div class="space-y-1.5">' +
            '<p class="text-[11px] font-bold text-slate-500 dark:text-slate-400">' + (state.lang === 'bn' ? 'অন্যান্য মার্কেটে দেখুন:' : 'Check on stores:') + '</p>' +
            '<div class="grid grid-cols-2 gap-2">' +
              '<button type="button" data-popup-store="' + escapeHtml(amzUrl) + '" class="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 font-bold text-[11px]">🛒 Amazon SA</button>' +
              '<button type="button" data-popup-store="' + escapeHtml(noonUrl) + '" class="py-2 px-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 font-bold text-[11px]">🛍️ Noon</button>' +
            '</div>' +
          '</div>';

        m.classList.remove('hidden');
        m.classList.add('flex');

        // Run AI lookup inside the popup using Groq or Gemini if configured!
        const aiBox = document.getElementById('prod-popup-ai-box');
        const groqKey = (state.groqApiKey || '').trim();
        const geminiKey = (state.geminiApiKey || '').trim();
        if (!groqKey && !geminiKey) {
          aiBox.innerHTML = '<p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">' +
            (state.lang === 'bn'
              ? 'ℹ️ এই পণ্যের সরাসরি অনলাইন দাম ওপেন ডেটাবেসে নেই। সেটিংসে Groq বা Gemini AI Key দিলে এখানেই পণ্যের বিবরণ ও আনুমানিক দাম দেখাবে, অথবা নিচের <b>ব্রাউজারে খুলুন</b> বাটনে ট্যাপ করুন।'
              : 'ℹ️ No open-database price found. Add a free Groq or Gemini key in Settings for instant in-app AI details, or tap Open in Browser below.') + '</p>';
          return;
        }

        const aiPrompt = state.lang === 'bn'
          ? 'Barcode: ' + code + (prodName && !prodName.startsWith('Product #') ? ', Name: ' + prodName : '') + (originCountry ? ', Origin: ' + originCountry : '') + '. বাংলায় সংক্ষেপে (৩-৪ লাইনে) এই পণ্যটি সম্পর্কে কী জানা যায়, সাধারণত এর আনুমানিক বাজারদাম (SAR ও BDT) কত হতে পারে তা জানাও। নিশ্চিত না হলে সৎভাবে বলো।'
          : 'Barcode: ' + code + (prodName && !prodName.startsWith('Product #') ? ', Name: ' + prodName : '') + (originCountry ? ', Origin: ' + originCountry : '') + '. Briefly (3-4 lines) describe this product and typical retail price range (SAR & BDT) if known; be honest if uncertain.';

        let aiText = '';
        if (groqKey) {
          try {
            const gr = await callGroqVision(groqKey, aiPrompt, null);
            aiText = gr.text || '';
          } catch (e1) {}
        }
        if (!aiText && geminiKey) {
          try {
            const mr = await callGeminiWithFallback(geminiKey, [{ text: aiPrompt }]);
            const j = mr.json;
            aiText = j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] ? j.candidates[0].content.parts[0].text : '';
          } catch (e2) {}
        }

        if (aiText) {
          aiBox.innerHTML =
            '<p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">✨ AI বিশ্লেষণ ও আনুমানিক তথ্য</p>' +
            '<p class="text-xs text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">' + escapeHtml(aiText.trim()) + '</p>';
        } else {
          aiBox.innerHTML = '<p class="text-[11px] text-amber-700 dark:text-amber-300">' +
            (state.lang === 'bn' ? '⚠️ AI থেকে উত্তর পাওয়া যায়নি—নিচের ব্রাউজার বাটনে ট্যাপ করে Google-এ দেখুন।' : '⚠️ Could not fetch AI info — tap Open in Browser below.') + '</p>';
        }
      }

      document.getElementById('prod-popup-body').addEventListener('click', function (e) {
        const sBtn = e.target.closest('[data-popup-store]');
        if (!sBtn) return;
        const u = sBtn.getAttribute('data-popup-store');
        const win = window.open(u, '_blank', 'noopener,noreferrer');
        if (!win) {
          copyTextSafe(u);
          showToast(state.lang === 'bn' ? 'স্টোর লিংক কপি হয়েছে!' : 'Store link copied!');
        }
      });

      document.getElementById('prod-check-result').addEventListener('click', function (e) {
        const gBtn = e.target.closest('[data-open-google]');
        if (gBtn) {
          const url = gBtn.getAttribute('data-open-google');
          const code = gBtn.getAttribute('data-bc-code') || document.getElementById('input-settings-barcode').value || '';
          const pName = gBtn.getAttribute('data-bc-name') || '';
          const orig = gBtn.getAttribute('data-bc-origin') || '';
          openProductDetailsPopup(code, pName, orig, url);
          return;
        }
        const cBtn = e.target.closest('[data-copy-barcode]');
        if (cBtn) {
          copyTextSafe(cBtn.getAttribute('data-copy-barcode'));
          showToast(state.lang === 'bn' ? 'বারকোড নম্বর কপি হয়েছে!' : 'Barcode copied!');
        }
      });

      /* ======================== PRO FEATURES HANDLERS ======================== */
      function adjustBurned(delta) {
        const day = getDayLog(state.selectedDate);
        day.burned = Math.max(0, (Number(day.burned) || 0) + delta);
        saveState();
        renderToday();
      }
      document.getElementById('btn-burn-minus').addEventListener('click', function () { adjustBurned(-50); });
      document.getElementById('btn-burn-plus').addEventListener('click', function () { adjustBurned(100); });
      document.getElementById('btn-burn-walk').addEventListener('click', function () { adjustBurned(150); });

      function copyTextSafe(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).catch(function () {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta);
          });
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) {}
          document.body.removeChild(ta);
        }
      }

      document.getElementById('btn-copy-summary').addEventListener('click', function () {
        const tot = getDayTotals(state.selectedDate);
        const net = Math.max(0, Math.round(tot.calories - (tot.burned || 0)));
        const dateLbl = formatDisplayDate(state.selectedDate, state.lang);
        const text = state.lang === 'bn'
          ? '📅 ' + dateLbl + '\n🔥 নেট ক্যালরি: ' + net + ' / ' + state.goals.calories + ' kcal (খাওয়া: ' + Math.round(tot.calories) + ', বার্ন: ' + (tot.burned || 0) + ')\n🥩 প্রোটিন: ' + Math.round(tot.protein) + 'g | 🍚 কার্বস: ' + Math.round(tot.carbs) + 'g | 🥑 ফ্যাট: ' + Math.round(tot.fat) + 'g\n💧 পানি: ' + (tot.water || 0) + ' / ' + state.goals.water + ' গ্লাস'
          : '📅 ' + dateLbl + '\n🔥 Net Calories: ' + net + ' / ' + state.goals.calories + ' kcal (Eaten: ' + Math.round(tot.calories) + ', Burned: ' + (tot.burned || 0) + ')\n🥩 Protein: ' + Math.round(tot.protein) + 'g | 🍚 Carbs: ' + Math.round(tot.carbs) + 'g | 🥑 Fat: ' + Math.round(tot.fat) + 'g\n💧 Water: ' + (tot.water || 0) + ' / ' + state.goals.water + ' glasses';
        copyTextSafe(text);
        showToast(t('toastCopiedSummary'));
      });

      document.getElementById('btn-copy-yesterday').addEventListener('click', function () {
        const prevDateStr = shiftDateStr(state.selectedDate, -1);
        const prevLog = state.logsByDate[prevDateStr];
        if (!prevLog || !Array.isArray(prevLog.entries) || prevLog.entries.length === 0) return;
        const today = getDayLog(state.selectedDate);
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        prevLog.entries.forEach(function (item, i) {
          today.entries.push({ ...item, id: 'cp_' + Date.now() + '_' + i, time: nowTime });
        });
        saveState();
        renderAll();
        showToast(t('toastCopiedYesterday').replace('{n}', prevLog.entries.length));
      });

      let editModalMode = 'entry';

      function openEditEntryModal(entryId) {
        const day = getDayLog(state.selectedDate);
        const item = (day.entries || []).find(function (e) { return e.id === entryId; });
        if (!item) return;
        editModalMode = 'entry';
        document.getElementById('edit-entry-id').value = item.id;
        document.getElementById('edit-name').value = state.lang === 'bn' ? (item.nameBn || item.nameEn) : (item.nameEn || item.nameBn);
        document.getElementById('edit-meal').value = item.meal || 'lunch';
        document.getElementById('edit-meal').disabled = false;
        document.getElementById('edit-serving').value = state.lang === 'bn' ? (item.servingBn || item.servingEn) : (item.servingEn || item.servingBn);
        document.getElementById('edit-cal').value = Math.round(item.calories || 0);
        document.getElementById('edit-pro').value = item.protein || 0;
        document.getElementById('edit-carb').value = item.carbs || 0;
        document.getElementById('edit-fat').value = item.fat || 0;
        const m = document.getElementById('edit-entry-modal');
        m.classList.remove('hidden');
        m.classList.add('flex');
      }

      function openEditCustomFoodModal(foodId) {
        const item = state.customFoods.find(function (f) { return f.id === foodId; });
        if (!item) return;
        editModalMode = 'custom';
        document.getElementById('edit-entry-id').value = item.id;
        document.getElementById('edit-name').value = state.lang === 'bn' ? (item.nameBn || item.nameEn) : (item.nameEn || item.nameBn);
        document.getElementById('edit-meal').value = state.selectedMeal || 'lunch';
        document.getElementById('edit-meal').disabled = true;
        document.getElementById('edit-serving').value = state.lang === 'bn' ? (item.servingBn || item.servingEn) : (item.servingEn || item.servingBn);
        document.getElementById('edit-cal').value = Math.round(item.calories || 0);
        document.getElementById('edit-pro').value = item.protein || 0;
        document.getElementById('edit-carb').value = item.carbs || 0;
        document.getElementById('edit-fat').value = item.fat || 0;
        const m = document.getElementById('edit-entry-modal');
        m.classList.remove('hidden');
        m.classList.add('flex');
      }

      function closeEditEntryModal() {
        const m = document.getElementById('edit-entry-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }

      document.getElementById('btn-close-edit-modal').addEventListener('click', closeEditEntryModal);
      document.getElementById('edit-entry-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('edit-entry-id').value;
        const newName = (document.getElementById('edit-name').value || '').trim();
        const newSrv = (document.getElementById('edit-serving').value || '').trim();
        const newMeal = document.getElementById('edit-meal').value;
        const newCal = Math.max(0, Math.round(Number(document.getElementById('edit-cal').value) || 0));
        const newPro = Math.max(0, Number(document.getElementById('edit-pro').value) || 0);
        const newCarb = Math.max(0, Number(document.getElementById('edit-carb').value) || 0);
        const newFat = Math.max(0, Number(document.getElementById('edit-fat').value) || 0);

        const cTitle = state.lang === 'bn' ? 'পরিবর্তন সেভ করবেন?' : 'Save these changes?';
        const cMsg = state.lang === 'bn'
          ? '"' + newName + '" (' + newCal + ' kcal)-এর আপডেট করা তথ্য কি সেভ করতে চান?'
          : 'Save updated info for "' + newName + '" (' + newCal + ' kcal)?';
        const okLbl = state.lang === 'bn' ? 'হ্যাঁ, সেভ করুন' : 'Yes, Save';

        openConfirm(cTitle, cMsg, function () {
          if (editModalMode === 'custom') {
            const item = state.customFoods.find(function (f) { return f.id === id; });
            if (!item) return;
            if (newName) { item.nameBn = newName; item.nameEn = newName; }
            if (newSrv) { item.servingBn = newSrv; item.servingEn = newSrv; }
            item.calories = newCal;
            item.protein = newPro;
            item.carbs = newCarb;
            item.fat = newFat;
          } else {
            const day = getDayLog(state.selectedDate);
            const item = (day.entries || []).find(function (x) { return x.id === id; });
            if (!item) return;
            if (newName) { item.nameBn = newName; item.nameEn = newName; }
            if (newSrv) { item.servingBn = newSrv; item.servingEn = newSrv; }
            item.meal = newMeal || item.meal;
            item.calories = newCal;
            item.protein = newPro;
            item.carbs = newCarb;
            item.fat = newFat;
            item.qty = 1;
          }
          saveState();
          closeEditEntryModal();
          renderAll();
          showToast(t('toastEntryUpdated'));
        }, okLbl, 'emerald');
      });

      document.getElementById('weight-log-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const w = Number(document.getElementById('input-today-weight').value);
        if (!w || w < 25 || w > 250) return;
        if (!state.weightLog || typeof state.weightLog !== 'object') state.weightLog = {};
        if (!state.bodyLog || typeof state.bodyLog !== 'object') state.bodyLog = {};
        state.weightLog[state.selectedDate] = Math.round(w * 10) / 10;
        const fatVal = Number((document.getElementById('input-today-fat') || {}).value) || 0;
        const waistVal = Number((document.getElementById('input-today-waist') || {}).value) || 0;
        const gymVal = Boolean((document.getElementById('chk-today-gym') || {}).checked);
        state.bodyLog[state.selectedDate] = {
          fat: fatVal > 0 ? Math.round(fatVal * 10) / 10 : 0,
          waist: waistVal > 0 ? Math.round(waistVal * 10) / 10 : 0,
          gym: gymVal
        };
        saveState();
        renderReports();
        showToast(t('toastWeightSaved').replace('{w}', state.weightLog[state.selectedDate]));
      });

      function updateBmiDisplay() {
        const w = Number(document.getElementById('calc-weight').value) || 0;
        const hCm = Number(document.getElementById('calc-height').value) || 0;
        const tag = document.getElementById('lbl-bmi-tag');
        const cat = document.getElementById('lbl-bmi-cat');
        if (!tag || !cat || w <= 0 || hCm <= 0) return;
        const hM = hCm / 100;
        const bmi = w / (hM * hM);
        tag.textContent = 'BMI: ' + bmi.toFixed(1);
        if (bmi < 18.5) { cat.textContent = t('bmiUnder'); cat.className = 'font-bold text-sky-600 dark:text-sky-400'; }
        else if (bmi < 25) { cat.textContent = t('bmiNormal'); cat.className = 'font-bold text-emerald-600 dark:text-emerald-400'; }
        else if (bmi < 30) { cat.textContent = t('bmiOver'); cat.className = 'font-bold text-amber-600 dark:text-amber-400'; }
        else { cat.textContent = t('bmiObese'); cat.className = 'font-bold text-rose-600 dark:text-rose-400'; }
      }
      document.getElementById('calc-weight').addEventListener('input', updateBmiDisplay);
      document.getElementById('calc-height').addEventListener('input', updateBmiDisplay);
      updateBmiDisplay();

      // Contact buttons (WhatsApp direct chat + Facebook & Telegram ready buttons)
      document.getElementById('btn-contact-facebook').addEventListener('click', function () {
        showToast(state.lang === 'bn' ? 'Facebook লিংক শীঘ্রই যুক্ত হবে' : 'Facebook link coming soon');
      });
      document.getElementById('btn-contact-telegram').addEventListener('click', function () {
        showToast(state.lang === 'bn' ? 'Telegram লিংক শীঘ্রই যুক্ত হবে' : 'Telegram link coming soon');
      });

      /* ======================== GLOBAL HAPTIC FEEDBACK ======================== */
      document.addEventListener('click', function (e) {
        if (e.target.closest('button')) haptic(18);
      });

      /* ======================== PWA INSTALL PROMPT BANNER ======================== */
      let deferredPwaPrompt = null;
      window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPwaPrompt = e;
        let dismissed = false;
        try { dismissed = localStorage.getItem('cal_pwa_dismissed') === '1'; } catch (err) {}
        if (!dismissed) {
          const b = document.getElementById('pwa-install-banner');
          if (b) b.classList.remove('hidden');
        }
      });
      document.getElementById('btn-pwa-banner-install').addEventListener('click', function () {
        if (!deferredPwaPrompt) return;
        deferredPwaPrompt.prompt();
        deferredPwaPrompt.userChoice.then(function () {
          deferredPwaPrompt = null;
          document.getElementById('pwa-install-banner').classList.add('hidden');
        });
      });
      document.getElementById('btn-pwa-banner-close').addEventListener('click', function () {
        document.getElementById('pwa-install-banner').classList.add('hidden');
        try { localStorage.setItem('cal_pwa_dismissed', '1'); } catch (err) {}
      });

      /* ======================== VOICE INPUT (WEB SPEECH API + AI) ======================== */
      let speechRec = null;
      let isListening = false;

      function closeVoiceModal() {
        if (speechRec && isListening) {
          try { speechRec.stop(); } catch (e) {}
        }
        isListening = false;
        const micBtn = document.getElementById('btn-voice-mic-toggle');
        if (micBtn) micBtn.classList.remove('mic-listening');
        const m = document.getElementById('voice-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }

      document.getElementById('btn-voice-today').addEventListener('click', function () {
        document.getElementById('voice-transcript-inp').value = '';
        document.getElementById('voice-status-text').textContent = state.lang === 'bn'
          ? 'মাইকে ট্যাপ করে বলুন, যেমন: "১ কাপ ভাত আর ১টি ডিম"'
          : 'Tap mic and speak, e.g. "1 cup rice and 1 boiled egg"';
        const m = document.getElementById('voice-modal');
        m.classList.remove('hidden');
        m.classList.add('flex');
      });
      document.getElementById('btn-close-voice-modal').addEventListener('click', closeVoiceModal);

      document.getElementById('btn-voice-mic-toggle').addEventListener('click', function () {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const statusEl = document.getElementById('voice-status-text');
        const micBtn = document.getElementById('btn-voice-mic-toggle');
        if (!SR) {
          statusEl.textContent = state.lang === 'bn'
            ? 'এই ব্রাউজারে মাইক সাপোর্ট নেই—নিচের বক্সে লিখে সাবমিট করুন।'
            : 'Voice mic not supported here — type your meal below.';
          return;
        }
        if (isListening && speechRec) {
          try { speechRec.stop(); } catch (e) {}
          return;
        }
        speechRec = new SR();
        speechRec.lang = state.lang === 'bn' ? 'bn-BD' : 'en-US';
        speechRec.interimResults = true;
        speechRec.maxAlternatives = 1;
        isListening = true;
        micBtn.classList.add('mic-listening');
        haptic(40);
        statusEl.textContent = state.lang === 'bn' ? '🎙️ শুনছি... খাবারের নাম ও পরিমাণ বলুন' : '🎙️ Listening... speak your meal';

        speechRec.onresult = function (ev) {
          let txt = '';
          for (let i = 0; i < ev.results.length; i++) {
            txt += ev.results[i][0].transcript;
          }
          document.getElementById('voice-transcript-inp').value = txt.trim();
        };
        speechRec.onerror = function () {
          isListening = false;
          micBtn.classList.remove('mic-listening');
          statusEl.textContent = state.lang === 'bn' ? '⚠️ মাইক শোনা যায়নি—আবার চেষ্টা করুন বা লিখে দিন।' : '⚠️ Could not hear — try again or type below.';
        };
        speechRec.onend = function () {
          isListening = false;
          micBtn.classList.remove('mic-listening');
          const cur = (document.getElementById('voice-transcript-inp').value || '').trim();
          statusEl.textContent = cur
            ? (state.lang === 'bn' ? '✅ রেকর্ড হয়েছে! এখন নিচের বাটনে ট্যাপ করুন।' : '✅ Captured! Tap Calculate & Add below.')
            : (state.lang === 'bn' ? 'মাইকে ট্যাপ করে আবার বলুন' : 'Tap mic to speak again');
        };
        try { speechRec.start(); } catch (e) { isListening = false; micBtn.classList.remove('mic-listening'); }
      });

      document.getElementById('voice-parse-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const spoken = (document.getElementById('voice-transcript-inp').value || '').trim();
        const statusEl = document.getElementById('voice-status-text');
        if (!spoken) return;
        statusEl.textContent = t('cfAutoLoading');

        const groqKey = (state.groqApiKey || '').trim();
        const geminiKey = (state.geminiApiKey || '').trim();
        let parsedFood = null;

        if (groqKey || geminiKey) {
          const prompt = 'User spoke this meal: "' + spoken + '". Extract the food name (in Bangla and English), serving size, and total estimated calories, protein, carbs, fat. Reply ONLY with raw JSON: {"nameEn":"...","nameBn":"...","servingEn":"...","servingBn":"...","calories":250,"protein":12,"carbs":30,"fat":8}';
          let rawText = '';
          if (groqKey) {
            try { const gr = await callGroqVision(groqKey, prompt, null); rawText = gr.text || ''; } catch (e1) {}
          }
          if (!rawText && geminiKey) {
            try {
              const mr = await callGeminiWithFallback(geminiKey, [{ text: prompt }]);
              const j = mr.json;
              rawText = j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] ? j.candidates[0].content.parts[0].text : '';
            } catch (e2) {}
          }
          if (rawText) {
            try {
              const m = rawText.match(/\{[\s\S]*\}/);
              if (m) parsedFood = JSON.parse(m[0]);
            } catch (ep) {}
          }
        }

        // Local fallback match if AI unavailable
        if (!parsedFood) {
          const low = spoken.toLowerCase();
          const hit = state.customFoods.concat(PRESET_FOODS).find(function (f) {
            return (f.nameBn && low.includes(f.nameBn.toLowerCase().split(' ')[0])) ||
                   (f.nameEn && low.includes(f.nameEn.toLowerCase().split(' ')[0]));
          });
          if (hit) {
            const wt = parseWeightGrams(spoken);
            const mult = wt.type === 'qty' ? Math.max(0.5, Math.min(10, wt.val || 1)) : 1;
            parsedFood = {
              nameEn: hit.nameEn, nameBn: hit.nameBn,
              servingEn: hit.servingEn, servingBn: hit.servingBn,
              calories: Math.round(hit.calories * mult),
              protein: Math.round(hit.protein * mult * 10) / 10,
              carbs: Math.round(hit.carbs * mult * 10) / 10,
              fat: Math.round(hit.fat * mult * 10) / 10
            };
          }
        }

        if (!parsedFood) {
          statusEl.textContent = t('cfAutoNotFound');
          return;
        }
        closeVoiceModal();
        const autoMeal = getAutoMealByTime();
        confirmBeforeAddFood({
          id: 'v_' + Date.now(),
          nameEn: parsedFood.nameEn || spoken,
          nameBn: parsedFood.nameBn || parsedFood.nameEn || spoken,
          servingEn: parsedFood.servingEn || '1 serving',
          servingBn: parsedFood.servingBn || parsedFood.servingEn || '১ পরিবেশন',
          calories: Math.round(Number(parsedFood.calories) || 0),
          protein: Math.round((Number(parsedFood.protein) || 0) * 10) / 10,
          carbs: Math.round((Number(parsedFood.carbs) || 0) * 10) / 10,
          fat: Math.round((Number(parsedFood.fat) || 0) * 10) / 10
        }, autoMeal, 1);
      });

      /* ======================== SOCIAL SHARE CARD GENERATOR (CANVAS PNG) ======================== */
      function drawShareCard() {
        const canvas = document.getElementById('share-card-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const tot = getDayTotals(state.selectedDate);
        const goal = Math.max(1, Number(state.goals.calories) || 2000);
        const burned = Math.round(tot.burned || 0);
        const net = Math.max(0, Math.round(tot.calories - burned));
        const rem = Math.round(goal - net);
        const streak = computeStreak();
        const pct = Math.min(1, net / goal);

        // Insta Story Style Vibrant Gradient
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#312e81');
        bg.addColorStop(0.5, '#0f172a');
        bg.addColorStop(1, '#064e3b');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Ambient glow circles
        ctx.fillStyle = 'rgba(16,185,129,0.22)';
        ctx.beginPath(); ctx.arc(130, 140, 200, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(56,189,248,0.16)';
        ctx.beginPath(); ctx.arc(600, 740, 210, 0, Math.PI * 2); ctx.fill();

        // Frosted inner card
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(44, 48, W - 88, H - 96, 36);
        ctx.fill(); ctx.stroke();

        // Header
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 26px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(state.lang === 'bn' ? 'খাবার ও ক্যালরি হিসাব' : 'Daily Calorie Tracker', W / 2, 118);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '600 20px Inter, sans-serif';
        ctx.fillText(formatDisplayDate(state.selectedDate, state.lang) + (streak > 0 ? '  ·  🔥 ' + streak + (state.lang === 'bn' ? ' দিন স্ট্রিক' : 'd Streak') : ''), W / 2, 158);

        // Progress Ring
        const cx = W / 2, cy = 355, r = 128;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 22;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
        ctx.strokeStyle = net > goal ? '#fb7185' : '#10b981';
        ctx.lineCap = 'round';
        ctx.lineWidth = 22;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '800 58px Inter, sans-serif';
        ctx.fillText(String(net), cx, cy + 10);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 22px Inter, sans-serif';
        ctx.fillText('/ ' + goal + ' kcal', cx, cy + 48);

        // Stats Boxes (Eaten | Remaining | Burned)
        const boxes = [
          { lbl: state.lang === 'bn' ? 'খাওয়া' : 'Eaten', val: Math.round(tot.calories) + ' kcal', col: '#34d399' },
          { lbl: state.lang === 'bn' ? (rem >= 0 ? 'বাকি' : 'বেশি') : (rem >= 0 ? 'Left' : 'Over'), val: Math.abs(rem) + ' kcal', col: rem >= 0 ? '#38bdf8' : '#fb7185' },
          { lbl: state.lang === 'bn' ? 'বার্ন' : 'Burned', val: burned + ' kcal', col: '#fb923c' }
        ];
        boxes.forEach(function (b, idx) {
          const bx = 76 + idx * 196;
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
          ctx.beginPath(); ctx.roundRect(bx, 530, 178, 102, 22); ctx.fill();
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '600 18px Inter, sans-serif';
          ctx.fillText(b.lbl, bx + 89, 568);
          ctx.fillStyle = b.col;
          ctx.font = '800 24px Inter, sans-serif';
          ctx.fillText(b.val, bx + 89, 608);
        });

        // Macros + Water Line
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 22px Inter, sans-serif';
        ctx.fillText('🥩 P: ' + Math.round(tot.protein) + 'g   ·   🍚 C: ' + Math.round(tot.carbs) + 'g   ·   🥑 F: ' + Math.round(tot.fat) + 'g', W / 2, 695);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 22px Inter, sans-serif';
        ctx.fillText('💧 ' + (tot.water || 0) + ' / ' + state.goals.water + (state.lang === 'bn' ? ' গ্লাস পানি' : ' Glasses Water'), W / 2, 742);

        // Brand Footer
        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 19px Inter, sans-serif';
        ctx.fillText('Powered by জাহিদ', W / 2, 818);
      }

      function closeShareModal() {
        const m = document.getElementById('share-card-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }

      document.getElementById('btn-open-share-card').addEventListener('click', function () {
        drawShareCard();
        const m = document.getElementById('share-card-modal');
        m.classList.remove('hidden');
        m.classList.add('flex');
      });
      document.getElementById('btn-close-share-modal').addEventListener('click', closeShareModal);

      document.getElementById('btn-share-download').addEventListener('click', function () {
        const canvas = document.getElementById('share-card-canvas');
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'calorie_report_' + state.selectedDate + '.png';
        a.click();
        showToast(t('toastExported'));
      });

      document.getElementById('btn-share-native').addEventListener('click', function () {
        const canvas = document.getElementById('share-card-canvas');
        canvas.toBlob(async function (blob) {
          if (blob && navigator.share && navigator.canShare) {
            const file = new File([blob], 'calorie_report.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({ files: [file], title: t('title') });
                return;
              } catch (e) {}
            }
          }
          // Fallback to download if Web Share with files isn't supported
          document.getElementById('btn-share-download').click();
        }, 'image/png');
      });

      /* ======================== DAILY REMINDER (WEB NOTIFICATION) ======================== */
      function syncReminderInputs() {
        const chk = document.getElementById('chk-reminder-on');
        const tm = document.getElementById('input-reminder-time');
        if (chk) chk.checked = Boolean(state.reminderOn);
        if (tm) tm.value = state.reminderTime || '20:30';
      }

      function sendMealReminderNotification(isTest) {
        if (!('Notification' in window)) {
          showToast(state.lang === 'bn' ? 'এই ব্রাউজারে নোটিফিকেশন সাপোর্ট নেই' : 'Notifications not supported here');
          return;
        }
        const title = state.lang === 'bn' ? '🍽️ খাবার ও ক্যালরি হিসাব' : '🍽️ Daily Calorie Tracker';
        const body = state.lang === 'bn' ? 'আজকের খাবার কি লগ করেছেন? এখনই ক্যালরি আপডেট করুন!' : 'Did you log today\'s meals? Update your calorie log now!';
        if (Notification.permission === 'granted') {
          try { new Notification(title, { body: body, icon: ICON_URI }); } catch (e) {}
          if (isTest) showToast(state.lang === 'bn' ? '🔔 টেস্ট নোটিফিকেশন পাঠানো হয়েছে!' : '🔔 Test notification sent!');
        } else {
          Notification.requestPermission().then(function (perm) {
            if (perm === 'granted') {
              try { new Notification(title, { body: body, icon: ICON_URI }); } catch (e) {}
              showToast(state.lang === 'bn' ? '✅ রিমাইন্ডার নোটিফিকেশন চালু হয়েছে!' : '✅ Reminder notifications enabled!');
            }
          });
        }
      }

      document.getElementById('chk-reminder-on').addEventListener('change', function (e) {
        state.reminderOn = Boolean(e.target.checked);
        saveState();
        if (state.reminderOn) {
          if ('Notification' in window) {
            Notification.requestPermission().then(function (permission) {
              if (permission === 'granted') {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('./firebase-messaging-sw.js').catch(function () {});
                }
                showToast(state.lang === 'bn' ? '🔔 ডেইলি রিমাইন্ডার চালু হয়েছে!' : '🔔 Daily reminder enabled!');
                sendMealReminderNotification(false);
              } else {
                showToast(state.lang === 'bn' ? 'নোটিফিকেশন পারমিশন ব্লক করা আছে — ব্রাউজার সেটিংস থেকে Allow করুন' : 'Notification permission denied — allow in browser settings');
              }
            }).catch(function () {});
          } else {
            showToast(state.lang === 'bn' ? 'এই ব্রাউজারে নোটিফিকেশন সাপোর্ট নেই' : 'Notifications not supported in this browser');
          }
        }
      });
      document.getElementById('input-reminder-time').addEventListener('change', function (e) {
        state.reminderTime = e.target.value || '20:30';
        saveState();
      });
      document.getElementById('btn-test-reminder').addEventListener('click', function () {
        sendMealReminderNotification(true);
      });
      syncReminderInputs();

      // Check once on load if reminder time passed today & 0 meals logged
      setTimeout(function () {
        if (!state.reminderOn) return;
        const today = getLocalDateStr(0);
        const log = state.logsByDate[today];
        const hasEntries = log && Array.isArray(log.entries) && log.entries.length > 0;
        let remindedToday = '';
        try { remindedToday = localStorage.getItem('cal_reminded_date') || ''; } catch (e) {}
        if (!hasEntries && remindedToday !== today) {
          const parts = (state.reminderTime || '20:30').split(':').map(Number);
          const now = new Date();
          if (now.getHours() > parts[0] || (now.getHours() === parts[0] && now.getMinutes() >= parts[1])) {
            sendMealReminderNotification(false);
            try { localStorage.setItem('cal_reminded_date', today); } catch (e) {}
          }
        }
      }, 2500);


      /* ======================== PREMIUM UPGRADES (COUNTERS, GAMIFICATION, PHOTO GALLERY, AI COACH) ======================== */
      const _counterCache = {};
      function animateCounterEl(el, targetVal, prefix, suffix) {
        if (!el) return;
        const target = Math.round(Number(targetVal) || 0);
        const id = el.id || ('c_' + Math.random());
        const start = typeof _counterCache[id] === 'number' ? _counterCache[id] : 0;
        _counterCache[id] = target;
        if (start === target) {
          el.textContent = (prefix || '') + target + (suffix || '');
          return;
        }
        const duration = 420;
        const t0 = performance.now();
        function step(now) {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const cur = Math.round(start + (target - start) * eased);
          el.textContent = (prefix || '') + cur + (suffix || '');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }

      function shrinkDataUrlThumb(dataUrl) {
        try {
          const img = new Image();
          img.src = dataUrl;
          if (!img.width || !img.height) return dataUrl.length < 48000 ? dataUrl : '';
          const maxD = 320;
          let w = img.width, h = img.height;
          if (w > maxD || h > maxD) {
            if (w > h) { h = Math.round((h * maxD) / w); w = maxD; }
            else { w = Math.round((w * maxD) / h); h = maxD; }
          }
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          return c.toDataURL('image/jpeg', 0.65);
        } catch (e) {
          return dataUrl.length < 48000 ? dataUrl : '';
        }
      }

      function computeGamificationStats() {
        const streak = computeStreak();
        let totalMeals = 0;
        let totalDays = 0;
        let photoCount = 0;
        Object.keys(state.logsByDate || {}).forEach(function (d) {
          const log = state.logsByDate[d];
          if (log && Array.isArray(log.entries) && log.entries.length > 0) {
            totalDays++;
            totalMeals += log.entries.length;
            log.entries.forEach(function (en) { if (en.photo) photoCount++; });
          }
        });
        const todayWater = (getDayTotals(getLocalDateStr(0)).water) || 0;
        const rawXp = (totalMeals * 15) + (streak * 40) + (todayWater >= 8 ? 30 : 0) + (photoCount * 20);
        const xp = Math.max(0, rawXp - (Number(state.xpSpent) || 0));
        const level = Math.min(20, Math.floor(xp / 150) + 1);
        const pct = Math.min(100, Math.round(((xp % 150) / 150) * 100));
        const ranksBn = ['নতুন শুরু', 'সচেতন', 'নিয়মিত ট্র্যাকার', 'হেলথ চ্যাম্পিয়ন', 'ফিটনেস যোদ্ধা', 'ক্যালরি মাস্টার'];
        const ranksEn = ['Beginner', 'Mindful', 'Steady Tracker', 'Health Champ', 'Fitness Warrior', 'Calorie Master'];
        const rIdx = Math.min(ranksBn.length - 1, Math.floor((level - 1) / 2));
        const rankName = state.lang === 'bn' ? ranksBn[rIdx] : ranksEn[rIdx];
        const badges = [
          { id: 'first', icon: '🌟', bn: 'প্রথম পদক্ষেপ', en: 'First Meal', descBn: '১টি খাবার লগ', descEn: '1+ meal logged', unlocked: totalMeals >= 1 },
          { id: 's3', icon: '🔥', bn: '৩ দিনের স্ট্রিক', en: '3-Day Streak', descBn: 'টানা ৩ দিন', descEn: '3 days in a row', unlocked: streak >= 3 },
          { id: 's7', icon: '🏆', bn: '৭ দিনের স্ট্রিক', en: '7-Day Streak', descBn: 'টানা ৭ দিন', descEn: '7 days in a row', unlocked: streak >= 7 },
          { id: 's30', icon: '👑', bn: 'ক্যালরি মাস্টার', en: 'Calorie Master', descBn: 'টানা ৩০ দিন', descEn: '30-day streak', unlocked: streak >= 30 },
          { id: 'water', icon: '💧', bn: 'হাইড্রেশন হিরো', en: 'Hydration Hero', descBn: '৮ গ্লাস পানি', descEn: '8 glasses water', unlocked: todayWater >= 8 },
          { id: 'snap', icon: '📸', bn: 'ফুড ফটোগ্রাফার', en: 'Food Snapper', descBn: 'ছবিসহ খাবার লগ', descEn: 'Log with photo', unlocked: photoCount >= 1 }
        ];
        return { streak, totalMeals, totalDays, photoCount, xp, level, pct, rankName, badges };
      }

      function updateGamificationPill() {
        const g = computeGamificationStats();
        const pill = document.getElementById('level-pill-today');
        if (pill) pill.textContent = '⭐ Lv.' + g.level;
      }

      function renderBadgesAndLevel() {
        const g = computeGamificationStats();
        const subEl = document.getElementById('level-rank-sub');
        const xpEl = document.getElementById('level-xp-badge');
        const barEl = document.getElementById('level-xp-bar');
        const gridEl = document.getElementById('badges-grid');
        if (subEl) subEl.textContent = (state.lang === 'bn' ? 'লেভেল ' + g.level + ' · ' : 'Level ' + g.level + ' · ') + g.rankName;
        if (xpEl) xpEl.textContent = g.xp + ' XP';
        if (barEl) barEl.style.width = Math.max(8, g.pct) + '%';
        if (gridEl) {
          gridEl.innerHTML = g.badges.map(function (b) {
            return '<div class="relative overflow-hidden rounded-2xl p-3 border text-center transition ' +
              (b.unlocked
                ? 'badge-shine bg-gradient-to-br from-amber-100 via-yellow-50 to-emerald-100 dark:from-amber-500/20 dark:via-emerald-500/15 dark:to-teal-500/20 border-amber-400/80 dark:border-amber-400/50 shadow-md shadow-amber-500/10'
                : 'bg-slate-100/70 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-800 opacity-50 grayscale') + '">' +
              (!b.unlocked ? '<span class="absolute top-1.5 right-1.5 text-[10px]">🔒</span>' : '<span class="absolute top-1.5 right-1.5 text-[10px]">✨</span>') +
              '<div class="text-2xl leading-none mb-1.5">' + b.icon + '</div>' +
              '<p class="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">' + escapeHtml(state.lang === 'bn' ? b.bn : b.en) + '</p>' +
              '<p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">' + escapeHtml(state.lang === 'bn' ? b.descBn : b.descEn) + '</p>' +
            '</div>';
          }).join('');
        }
      }

      function renderMealPhotoGallery() {
        const grid = document.getElementById('meal-photo-gallery');
        const cntEl = document.getElementById('photo-gallery-count');
        if (!grid) return;
        const photos = [];
        Object.keys(state.logsByDate || {}).sort().reverse().forEach(function (d) {
          const log = state.logsByDate[d];
          if (!log || !Array.isArray(log.entries)) return;
          log.entries.forEach(function (e) {
            if (e.photo) photos.push({ date: d, entry: e });
          });
        });
        if (cntEl) cntEl.textContent = state.lang === 'bn' ? (photos.length + 'টি ছবি') : (photos.length + ' photos');
        if (photos.length === 0) {
          grid.className = 'block';
          grid.innerHTML = '<div class="py-5 px-3 text-center space-y-2 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">' +
            '<div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">' +
              '<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
            '</div>' +
            '<p class="text-xs font-bold text-slate-700 dark:text-slate-200">' + (state.lang === 'bn' ? 'এখনো কোনো খাবারের ছবি নেই' : 'No Meal Photos Yet') + '</p>' +
            '<p class="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">' + (state.lang === 'bn' ? 'ক্যামেরা দিয়ে ছবি তুললে বা খাবারের পাশে 📷 ট্যাপ করলে সুন্দর গ্যালারি তৈরি হবে।' : 'Snap a meal photo or tap 📷 on any meal to build your gallery.') + '</p>' +
          '</div>';
          return;
        }
        grid.className = 'columns-2 gap-2.5 space-y-2.5';
        grid.innerHTML = photos.slice(0, 18).map(function (p, idx) {
          const nm = state.lang === 'bn' ? p.entry.nameBn : p.entry.nameEn;
          const aspectCls = idx % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square';
          return '<button type="button" data-gallery-photo="' + p.entry.id + '" data-gallery-date="' + p.date + '" class="break-inside-avoid w-full group relative ' + aspectCls + ' rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm active:scale-95 transition block">' +
            '<img src="' + p.entry.photo + '" loading="lazy" alt="' + escapeHtml(nm) + '" class="w-full h-full object-cover">' +
            '<div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 text-left">' +
              '<p class="text-[11px] font-bold text-white truncate">' + escapeHtml(nm) + '</p>' +
              '<p class="text-[10px] font-semibold text-emerald-300">' + p.entry.calories + ' kcal · ' + p.date.slice(5) + '</p>' +
            '</div>' +
          '</button>';
        }).join('');
      }

      let pendingAttachEntryId = '';
      function openPhotoLightbox(photoUrl, title, sub) {
        const m = document.getElementById('photo-lightbox-modal');
        document.getElementById('lightbox-img').src = photoUrl;
        document.getElementById('lightbox-title').textContent = title || '';
        document.getElementById('lightbox-sub').textContent = sub || '';
        m.classList.remove('hidden');
        m.classList.add('flex');
      }
      document.getElementById('btn-close-lightbox').addEventListener('click', function () {
        const m = document.getElementById('photo-lightbox-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      });
      document.getElementById('photo-lightbox-modal').addEventListener('click', function (e) {
        if (e.target.id === 'photo-lightbox-modal') {
          e.target.classList.add('hidden');
          e.target.classList.remove('flex');
        }
      });

      document.getElementById('meals-container').addEventListener('click', function (e) {
        const emptyCam = e.target.closest('#btn-empty-cam');
        if (emptyCam) {
          const camBtn = document.getElementById('btn-camera-today');
          if (camBtn) camBtn.click();
          return;
        }
        const emptyAdd = e.target.closest('#btn-empty-add');
        if (emptyAdd) { switchTab('add'); return; }

        const viewBtn = e.target.closest('[data-view-photo]');
        if (viewBtn) {
          const id = viewBtn.getAttribute('data-view-photo');
          const day = getDayLog(state.selectedDate);
          const item = (day.entries || []).find(function (x) { return x.id === id; });
          if (item && item.photo) {
            openPhotoLightbox(item.photo, state.lang === 'bn' ? item.nameBn : item.nameEn, item.calories + ' kcal · ' + (item.time || state.selectedDate));
          }
          return;
        }
        const attachBtn = e.target.closest('[data-attach-photo]');
        if (attachBtn) {
          pendingAttachEntryId = attachBtn.getAttribute('data-attach-photo');
          const inp = document.getElementById('meal-photo-attach-input');
          inp.value = '';
          inp.click();
        }
      });

      document.getElementById('meal-photo-attach-input').addEventListener('change', function (e) {
        const file = e.target.files && e.target.files[0];
        if (!file || !pendingAttachEntryId) return;
        compressImageFile(file, function (dataUrl) {
          const img = new Image();
          img.onload = function () {
            const maxD = 340;
            let w = img.width, h = img.height;
            if (w > maxD || h > maxD) {
              if (w > h) { h = Math.round((h * maxD) / w); w = maxD; }
              else { w = Math.round((w * maxD) / h); h = maxD; }
            }
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            c.getContext('2d').drawImage(img, 0, 0, w, h);
            const thumb = c.toDataURL('image/jpeg', 0.68);
            const day = getDayLog(state.selectedDate);
            const item = (day.entries || []).find(function (x) { return x.id === pendingAttachEntryId; });
            if (item) {
              item.photo = thumb;
              saveState();
              renderAll();
              showToast(state.lang === 'bn' ? '📸 খাবারের ছবি সংরক্ষণ হয়েছে!' : '📸 Meal photo saved!');
            }
            pendingAttachEntryId = '';
          };
          img.src = dataUrl;
        });
      });

      document.getElementById('meal-photo-gallery').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-gallery-photo]');
        if (!btn) return;
        const id = btn.getAttribute('data-gallery-photo');
        const dt = btn.getAttribute('data-gallery-date');
        const log = state.logsByDate[dt];
        const item = log && (log.entries || []).find(function (x) { return x.id === id; });
        if (item && item.photo) {
          openPhotoLightbox(item.photo, state.lang === 'bn' ? item.nameBn : item.nameEn, item.calories + ' kcal · ' + dt);
        }
      });

      /* ======================== FLOATING AI NUTRITION COACH ======================== */
      const coachHistory = [];
      function renderCoachMessages() {
        const box = document.getElementById('ai-coach-messages');
        if (!box) return;
        if (coachHistory.length === 0) {
          const totals = getDayTotals(state.selectedDate);
          const rem = Math.max(0, (Number(state.goals.calories) || 2000) - Math.round(totals.calories));
          const greet = state.lang === 'bn'
            ? 'হ্যালো! আমি আপনার AI নিউট্রিশন কোচ 🤖। আজ আপনার খাওয়া হয়েছে ' + Math.round(totals.calories) + ' kcal এবং বাকি আছে ' + rem + ' kcal। ওজন কমানো, প্রোটিন বা আজকের খাবার নিয়ে যেকোনো প্রশ্ন করুন!'
            : 'Hi! I am your AI Nutrition Coach 🤖. Today you have eaten ' + Math.round(totals.calories) + ' kcal with ' + rem + ' kcal remaining. Ask me anything about meals, protein, or weight goals!';
          coachHistory.push({ role: 'ai', text: greet });
        }
        box.innerHTML = coachHistory.map(function (m) {
          const isUser = m.role === 'user';
          return '<div class="flex ' + (isUser ? 'justify-end' : 'justify-start') + '">' +
            '<div class="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ' +
              (isUser
                ? 'bg-emerald-600 text-white rounded-br-sm font-medium'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-sm shadow-sm') + '">' +
              escapeHtml(m.text) +
            '</div>' +
          '</div>';
        }).join('');
        box.scrollTop = box.scrollHeight;
      }

      async function askAiNutritionCoach(question) {
        const totals = getDayTotals(state.selectedDate);
        const goalCal = Number(state.goals.calories) || 2000;
        const goalPro = Number(state.goals.protein) || 100;
        const remCal = Math.round(goalCal - totals.calories);
        const remPro = Math.max(0, Math.round(goalPro - totals.protein));
        const fullPrompt = 'You are a warm, practical Bangladeshi/South Asian nutrition coach. Answer concisely in ' +
          (state.lang === 'bn' ? 'natural Bangla' : 'English') +
          ' (3-5 short lines, plain text without markdown asterisks). User stats today: Eaten ' + Math.round(totals.calories) + '/' + goalCal +
          ' kcal (Remaining ' + remCal + ' kcal), Protein ' + Math.round(totals.protein) + '/' + goalPro +
          'g, Carbs ' + Math.round(totals.carbs) + 'g, Fat ' + Math.round(totals.fat) + 'g, Water ' + (totals.water || 0) + '/8 glasses.' +
          '\n\nUser question: ' + question;

        const rawGroq = (state.groqApiKey || (document.getElementById('input-groq-key') || {}).value || '').trim();
        const groqKey = typeof normalizeGroqKey === 'function' ? normalizeGroqKey(rawGroq) : rawGroq;
        const gemKey = (state.geminiApiKey || (document.getElementById('input-gemini-key') || {}).value || '').trim();
        const hasAnyKey = Boolean(groqKey || gemKey);
        let apiErrNote = '';

        // 1. Use dynamic Groq model discovery (same proven engine as camera & voice)
        if (groqKey && typeof callGroqVision === 'function') {
          try {
            const gRes = await callGroqVision(groqKey, fullPrompt, null);
            if (gRes && gRes.text && gRes.text.trim()) {
              return gRes.text.trim();
            }
          } catch (e) {
            apiErrNote = (e && e.message) ? e.message : 'Groq error';
          }
        }

        // 2. Use dynamic Gemini fallback engine (same proven engine as camera & voice)
        if (gemKey && typeof callGeminiWithFallback === 'function') {
          try {
            const jRes = await callGeminiWithFallback(gemKey, [{ text: fullPrompt }]);
            const txt = jRes && jRes.json && jRes.json.candidates && jRes.json.candidates[0] &&
              jRes.json.candidates[0].content && jRes.json.candidates[0].content.parts &&
              jRes.json.candidates[0].content.parts[0] && jRes.json.candidates[0].content.parts[0].text;
            if (txt && txt.trim()) {
              return txt.trim();
            }
          } catch (e) {
            const m = (e && e.message) ? e.message : 'Gemini error';
            apiErrNote = apiErrNote ? (apiErrNote + ' / ' + m) : m;
          }
        }

        const tailNote = hasAnyKey
          ? (state.lang === 'bn'
              ? ' (বি.দ্র.: এই মুহূর্তে লাইভ AI সার্ভার থেকে উত্তর আসেনি — ' + (apiErrNote ? apiErrNote.slice(0, 60) : 'ইন্টারনেট/কী চেক করুন') + '।)'
              : ' (Note: Live AI unreachable right now — ' + (apiErrNote ? apiErrNote.slice(0, 60) : 'check connection/key') + '.)')
          : (state.lang === 'bn'
              ? ' (আরও বিস্তারিত AI উত্তরের জন্য সেটিংসে ফ্রি Groq বা Gemini কী বসাতে পারেন।)'
              : ' (Add a free Groq or Gemini key in Settings for live AI coaching.)');

        const q = question.toLowerCase();
        if (q.includes('প্রোটিন') || q.includes('protein')) {
          return (state.lang === 'bn'
            ? 'আজ আপনার প্রোটিন এখনো ' + remPro + 'g বাকি আছে। সহজে পূরণ করতে ২টি সেদ্ধ ডিম (১২g), ১ পিস গ্রিল্ড চিকেন বা মাছ (২২-২৫g) অথবা ১ বাটি ঘন মসুর ডাল (৯g) খেতে পারেন।'
            : 'You still need ' + remPro + 'g of protein today. Quick options: 2 boiled eggs (12g), grilled chicken/fish (22-25g), or thick dal (9g).') + tailNote;
        }
        if (q.includes('ওজন') || q.includes('কমা') || q.includes('খাবো') || q.includes('eat') || q.includes('weight')) {
          return (state.lang === 'bn'
            ? 'আপনার আজ ' + Math.max(0, remCal) + ' kcal বাকি আছে। ওজন নিয়ন্ত্রণে রাখতে ভাত একটু কমিয়ে (১ কাপ) সাথে মাছ/মুরগি, শাকসবজি ও শসার সালাদ নিন এবং মিষ্টি পানীয় এড়িয়ে চলুন।'
            : 'You have ' + Math.max(0, remCal) + ' kcal left today. For weight loss, stick to a smaller rice portion with fish/chicken, leafy veggies, cucumber salad, and skip sugary drinks.') + tailNote;
        }
        return (state.lang === 'bn'
          ? 'আজকের স্ট্যাটাস: ' + Math.round(totals.calories) + '/' + goalCal + ' kcal (বাকি ' + remCal + ' kcal), প্রোটিন ' + Math.round(totals.protein) + 'g, পানি ' + (totals.water || 0) + '/8 গ্লাস। ' + (remPro > 20 ? 'পরের মিলে ডিম, মাছ বা ডাল যোগ করলে ব্যালেন্স দারুণ হবে!' : 'আপনার আজকের ব্যালেন্স ভালো যাচ্ছে — পর্যাপ্ত পানি পান করুন!')
          : 'Today: ' + Math.round(totals.calories) + '/' + goalCal + ' kcal (' + remCal + ' kcal left), Protein ' + Math.round(totals.protein) + 'g, Water ' + (totals.water || 0) + '/8. Keep hydrating and prioritize lean protein!') + tailNote;
      }

      function openAiCoachModal() {
        const m = document.getElementById('ai-coach-modal');
        renderCoachMessages();
        m.classList.remove('hidden');
        m.classList.add('flex');
      }
      function closeAiCoachModal() {
        const m = document.getElementById('ai-coach-modal');
        m.classList.add('hidden');
        m.classList.remove('flex');
      }
      document.getElementById('btn-ai-coach-fab').addEventListener('click', function () {
        if (typeof triggerHaptic === 'function') triggerHaptic(25);
        openAiCoachModal();
      });
      document.getElementById('btn-close-ai-coach').addEventListener('click', closeAiCoachModal);
      document.getElementById('ai-coach-modal').addEventListener('click', function (e) {
        if (e.target.id === 'ai-coach-modal') closeAiCoachModal();
      });

      async function handleCoachSend(text) {
        const q = (text || '').trim();
        if (!q) return;
        coachHistory.push({ role: 'user', text: q });
        coachHistory.push({ role: 'ai', text: state.lang === 'bn' ? '⏳ চিন্তা করছি...' : '⏳ Thinking...' });
        renderCoachMessages();
        const reply = await askAiNutritionCoach(q);
        coachHistory[coachHistory.length - 1] = { role: 'ai', text: reply };
        renderCoachMessages();
      }

      document.getElementById('ai-coach-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const inp = document.getElementById('ai-coach-input');
        const val = inp.value;
        inp.value = '';
        handleCoachSend(val);
      });
      document.getElementById('ai-coach-modal').addEventListener('click', function (e) {
        const chip = e.target.closest('[data-coach-prompt]');
        if (!chip) return;
        handleCoachSend(chip.getAttribute('data-coach-prompt'));
      });


      /* ======================== 10 NEXT-LEVEL FEATURES ======================== */
      // 1. App Badging API
      function updateAppBadgeCount(remCal) {
        try {
          if ('setAppBadge' in navigator) {
            if (remCal > 0) navigator.setAppBadge(Math.round(remCal)).catch(function () {});
            else if ('clearAppBadge' in navigator) navigator.clearAppBadge().catch(function () {});
          }
        } catch (e) {}
      }

      // 2. Pure Canvas Confetti Celebration Engine (Zero CDN dependency)
      let _confettiLastDateWater = '';
      function launchConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        canvas.classList.remove('hidden');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        const colors = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];
        const particles = [];
        for (let i = 0; i < 85; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * 140,
            vx: (Math.random() - 0.5) * 4.5,
            vy: 2.5 + Math.random() * 4.5,
            size: 5 + Math.random() * 6,
            rot: Math.random() * 360,
            vrot: (Math.random() - 0.5) * 10,
            color: colors[i % colors.length]
          });
        }
        let frames = 0;
        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          let alive = false;
          particles.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08;
            p.rot += p.vrot;
            if (p.y < canvas.height + 20) alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
            ctx.restore();
          });
          frames++;
          if (alive && frames < 160) requestAnimationFrame(draw);
          else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.classList.add('hidden');
          }
        }
        requestAnimationFrame(draw);
      }

      // Trigger confetti when reaching 8/8 water goal
      document.getElementById('btn-water-plus').addEventListener('click', function () {
        setTimeout(function () {
          const gW = Math.max(1, Number(state.goals.water) || 8);
          const curW = (getDayTotals(state.selectedDate).water) || 0;
          if (curW === gW && _confettiLastDateWater !== state.selectedDate) {
            _confettiLastDateWater = state.selectedDate;
            launchConfetti();
            showToast(state.lang === 'bn' ? '🎉 দারুণ! আজকের পানির লক্ষ্য পূর্ণ হয়েছে!' : '🎉 Awesome! Daily water goal reached!');
          }
        }, 80);
      });

      // 3. Swipe Left to Delete / Swipe Right to Edit on Meals List
      (function initMealSwipe() {
        const container = document.getElementById('meals-container');
        if (!container) return;
        let startX = 0, startY = 0, activeRow = null, dx = 0;
        container.addEventListener('touchstart', function (e) {
          const row = e.target.closest('.meal-swipe-row');
          if (!row || !e.touches || !e.touches[0]) return;
          activeRow = row;
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          dx = 0;
        }, { passive: true });
        container.addEventListener('touchmove', function (e) {
          if (!activeRow || !e.touches || !e.touches[0]) return;
          const curDx = e.touches[0].clientX - startX;
          const curDy = e.touches[0].clientY - startY;
          if (Math.abs(curDy) > Math.abs(curDx) && Math.abs(dx) < 12) return;
          dx = Math.max(-110, Math.min(110, curDx));
          activeRow.style.transform = 'translateX(' + dx + 'px)';
          if (dx < -40) activeRow.style.backgroundColor = 'rgba(244, 63, 94, 0.14)';
          else if (dx > 40) activeRow.style.backgroundColor = 'rgba(16, 185, 129, 0.14)';
          else activeRow.style.backgroundColor = '';
        }, { passive: true });
        container.addEventListener('touchend', function () {
          if (!activeRow) return;
          const row = activeRow;
          const entryId = row.getAttribute('data-swipe-entry');
          row.style.transform = '';
          row.style.backgroundColor = '';
          activeRow = null;
          if (!entryId) return;
          if (dx < -70) {
            if (typeof triggerHaptic === 'function') triggerHaptic(35);
            const delBtn = row.querySelector('[data-del-entry]');
            if (delBtn) delBtn.click();
          } else if (dx > 70) {
            if (typeof triggerHaptic === 'function') triggerHaptic(25);
            const editBtn = row.querySelector('[data-edit-entry]');
            if (editBtn) editBtn.click();
          }
          dx = 0;
        });
      })();

      // 4. Intermittent Fasting Circular Timer (localStorage persistent)
      let fastingState = { active: false, startTime: 0, targetHours: 16 };
      try {
        const savedFast = JSON.parse(localStorage.getItem('cal_fasting_state') || 'null');
        if (savedFast && typeof savedFast === 'object') fastingState = Object.assign(fastingState, savedFast);
      } catch (e) {}

      function saveFastingState() {
        try { localStorage.setItem('cal_fasting_state', JSON.stringify(fastingState)); } catch (e) {}
      }

      function renderFastingUI() {
        const arc = document.getElementById('fasting-ring-arc');
        const tEl = document.getElementById('fasting-timer-text');
        const pEl = document.getElementById('fasting-pct-text');
        const msgEl = document.getElementById('fasting-status-msg');
        const tgtEl = document.getElementById('fasting-target-time');
        const btn = document.getElementById('btn-fasting-toggle');
        if (!arc || !tEl || !btn) return;
        document.querySelectorAll('.fast-plan-btn').forEach(function (b) {
          const hrs = Number(b.getAttribute('data-fast-hrs'));
          const act = hrs === Number(fastingState.targetHours);
          b.className = 'fast-plan-btn px-2 py-1 rounded-lg text-[10px] font-bold transition ' +
            (act ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300');
        });
        const totalMs = (Number(fastingState.targetHours) || 16) * 3600 * 1000;
        const circ = 263.89;
        if (!fastingState.active || !fastingState.startTime) {
          arc.style.strokeDashoffset = circ.toFixed(2);
          tEl.textContent = '00:00:00';
          pEl.textContent = '0%';
          msgEl.textContent = state.lang === 'bn'
            ? fastingState.targetHours + ' ঘণ্টার ফাস্টিং শুরু করতে নিচে ট্যাপ করুন।'
            : 'Tap below to start a ' + fastingState.targetHours + 'h fasting timer.';
          tgtEl.textContent = '';
          btn.textContent = state.lang === 'bn' ? '▶ ফাস্টিং শুরু করুন' : '▶ Start Fasting';
          btn.className = 'w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm active:scale-95 transition';
          return;
        }
        const elapsed = Math.max(0, Date.now() - fastingState.startTime);
        const pct = Math.min(1, elapsed / totalMs);
        arc.style.strokeDashoffset = (circ * (1 - pct)).toFixed(2);
        const totalSec = Math.floor(elapsed / 1000);
        const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
        const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
        const ss = String(totalSec % 60).padStart(2, '0');
        tEl.textContent = hh + ':' + mm + ':' + ss;
        pEl.textContent = Math.round(pct * 100) + '%';
        const endDt = new Date(fastingState.startTime + totalMs);
        const endStr = endDt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (pct >= 1) {
          msgEl.textContent = state.lang === 'bn' ? '🎉 লক্ষ্য পূর্ণ হয়েছে! এখন স্বাস্থ্যকর খাবার খেতে পারেন।' : '🎉 Goal reached! Ready to break your fast.';
        } else {
          msgEl.textContent = state.lang === 'bn' ? '🔥 ফাস্টিং চলছে — ফ্যাট বার্নিং মোড!' : '🔥 Fasting in progress — fat burning mode!';
        }
        tgtEl.textContent = (state.lang === 'bn' ? 'শেষ হবে: ' : 'Ends at: ') + endStr;
        btn.textContent = state.lang === 'bn' ? '⏹ ফাস্টিং শেষ করুন' : '⏹ End Fasting';
        btn.className = 'w-full py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold shadow-sm active:scale-95 transition';
      }

      document.getElementById('fasting-plan-pills').addEventListener('click', function (e) {
        const b = e.target.closest('[data-fast-hrs]');
        if (!b) return;
        fastingState.targetHours = Number(b.getAttribute('data-fast-hrs')) || 16;
        saveFastingState();
        renderFastingUI();
      });

      document.getElementById('btn-fasting-toggle').addEventListener('click', function () {
        if (typeof triggerHaptic === 'function') triggerHaptic(30);
        if (fastingState.active) {
          const elapsedHrs = ((Date.now() - fastingState.startTime) / 3600000);
          if (elapsedHrs >= fastingState.targetHours) launchConfetti();
          fastingState.active = false;
          fastingState.startTime = 0;
          saveFastingState();
          renderFastingUI();
          showToast(state.lang === 'bn' ? 'ফাস্টিং শেষ হয়েছে (' + elapsedHrs.toFixed(1) + ' ঘণ্টা)' : 'Fast ended (' + elapsedHrs.toFixed(1) + 'h)');
        } else {
          fastingState.active = true;
          fastingState.startTime = Date.now();
          saveFastingState();
          renderFastingUI();
          showToast(state.lang === 'bn' ? '⏳ ফাস্টিং টাইমার চালু হয়েছে!' : '⏳ Fasting timer started!');
        }
      });
      setInterval(renderFastingUI, 1000);
      renderFastingUI();

      // 5. Step Counter (DeviceMotionEvent Pedometer + Manual +500 fallback)
      let stepSensorActive = false;
      let lastStepTs = 0;
      function addStepsToToday(deltaSteps) {
        const day = getDayLog(state.selectedDate);
        day.steps = Math.max(0, (Number(day.steps) || 0) + deltaSteps);
        const kcalDelta = Math.round(deltaSteps * 0.04);
        if (kcalDelta > 0) day.burned = Math.max(0, (Number(day.burned) || 0) + kcalDelta);
        saveState();
        renderToday();
      }
      function syncStepAndJournalUI() {
        const day = getDayLog(state.selectedDate);
        const steps = Number(day.steps) || 0;
        const stepEl = document.getElementById('step-count-val');
        const subEl = document.getElementById('step-burn-sub');
        if (stepEl) stepEl.textContent = steps.toLocaleString();
        if (subEl) subEl.textContent = '≈ ' + Math.round(steps * 0.04) + ' kcal ' + (state.lang === 'bn' ? 'বার্ন' : 'burned');

        const jInp = document.getElementById('input-daily-journal');
        if (jInp && document.activeElement !== jInp) jInp.value = day.journal || '';
        document.querySelectorAll('.mood-btn').forEach(function (b) {
          const act = b.getAttribute('data-mood') === (day.mood || '');
          b.className = 'mood-btn w-8 h-8 rounded-xl text-base flex items-center justify-center transition ' +
            (act ? 'bg-emerald-500/20 ring-2 ring-emerald-500 scale-110' : 'bg-slate-100 dark:bg-slate-800 opacity-70');
        });
      }
      function onDeviceMotionStep(ev) {
        const acc = ev.accelerationIncludingGravity;
        if (!acc) return;
        const mag = Math.sqrt((acc.x || 0) * (acc.x || 0) + (acc.y || 0) * (acc.y || 0) + (acc.z || 0) * (acc.z || 0));
        const now = Date.now();
        if (mag > 12.8 && (now - lastStepTs) > 360) {
          lastStepTs = now;
          const day = getDayLog(state.selectedDate);
          day.steps = (Number(day.steps) || 0) + 1;
          if (day.steps % 25 === 0) day.burned = (Number(day.burned) || 0) + 1;
          saveState();
          syncStepAndJournalUI();
        }
      }
      document.getElementById('btn-step-sensor').addEventListener('click', async function () {
        const btn = document.getElementById('btn-step-sensor');
        if (stepSensorActive) {
          window.removeEventListener('devicemotion', onDeviceMotionStep);
          stepSensorActive = false;
          btn.textContent = '▶ সেন্সর';
          showToast(state.lang === 'bn' ? 'স্টেপ সেন্সর বন্ধ করা হয়েছে' : 'Step sensor stopped');
          return;
        }
        if (typeof DeviceMotionEvent === 'undefined') {
          showToast(state.lang === 'bn' ? 'এই ডিভাইসে মোশন সেন্সর নেই — +500 বাটন ব্যবহার করুন' : 'Motion sensor unavailable — use +500 button');
          return;
        }
        try {
          if (typeof DeviceMotionEvent.requestPermission === 'function') {
            const perm = await DeviceMotionEvent.requestPermission();
            if (perm !== 'granted') {
              showToast(state.lang === 'bn' ? 'মোশন সেন্সর পারমিশন পাওয়া যায়নি' : 'Motion sensor permission denied');
              return;
            }
          }
          window.addEventListener('devicemotion', onDeviceMotionStep);
          stepSensorActive = true;
          btn.textContent = '⏹ চালু আছে';
          showToast(state.lang === 'bn' ? '👟 স্টেপ সেন্সর চালু হয়েছে! হাঁটলে কদম গণনা হবে।' : '👟 Step sensor active!');
        } catch (e) {
          showToast(state.lang === 'bn' ? 'এই ডিভাইসে সেন্সর নেই — +500 বাটন ব্যবহার করুন' : 'Sensor unavailable — use +500 button');
        }
      });
      document.getElementById('btn-step-add500').addEventListener('click', function () {
        if (typeof triggerHaptic === 'function') triggerHaptic(20);
        addStepsToToday(500);
        showToast(state.lang === 'bn' ? '👟 +৫০০ কদম (+২০ kcal বার্ন) যোগ হয়েছে!' : '👟 +500 steps (+20 kcal) added!');
      });

      // 6. Daily Journal & Mood handlers
      document.getElementById('journal-mood-pills').addEventListener('click', function (e) {
        const b = e.target.closest('[data-mood]');
        if (!b) return;
        const day = getDayLog(state.selectedDate);
        day.mood = b.getAttribute('data-mood');
        saveState();
        syncStepAndJournalUI();
      });
      document.getElementById('btn-save-journal').addEventListener('click', function () {
        const day = getDayLog(state.selectedDate);
        day.journal = (document.getElementById('input-daily-journal').value || '').trim();
        saveState();
        showToast(state.lang === 'bn' ? '📔 আজকের জার্নাল সেভ হয়েছে!' : '📔 Daily journal saved!');
      });

      // 7. AI Smart Insights in Reports Tab
      document.getElementById('btn-gen-ai-insight').addEventListener('click', async function () {
        const box = document.getElementById('ai-insight-box');
        const btn = document.getElementById('btn-gen-ai-insight');
        if (!box || !btn) return;
        btn.disabled = true;
        box.textContent = state.lang === 'bn' ? '⏳ AI আপনার আজকের ডেটা বিশ্লেষণ করছে...' : '⏳ AI is analyzing your daily nutrition...';
        const totals = getDayTotals(state.selectedDate);
        const goalCal = Number(state.goals.calories) || 2000;
        const prompt = 'My daily calorie goal is ' + goalCal + ' kcal, I ate ' + Math.round(totals.calories) +
          ' kcal, protein ' + Math.round(totals.protein) + 'g, carbs ' + Math.round(totals.carbs) + 'g, fat ' +
          Math.round(totals.fat) + 'g, water ' + (totals.water || 0) + ' glasses. Give me a 2-line short actionable advice in ' +
          (state.lang === 'bn' ? 'Bengali.' : 'English.');
        const reply = await askAiNutritionCoach(prompt);
        box.textContent = '💡 ' + reply;
        btn.disabled = false;
      });

      // 8. Professional PDF Report Export (html2pdf.js Direct Download + Print Fallback)
      document.getElementById('btn-export-pdf-report').addEventListener('click', function () {
        if (typeof triggerHaptic === 'function') triggerHaptic(35);
        const wCanvas = document.getElementById('weeklyChart');
        const mCanvas = document.getElementById('macroChart');
        const wImg = wCanvas ? wCanvas.toDataURL('image/png') : '';
        const mImg = mCanvas ? mCanvas.toDataURL('image/png') : '';
        const goalCal = Number(state.goals.calories) || 2000;
        const rows = [];
        for (let i = 6; i >= 0; i--) {
          const ds = shiftDateStr(state.selectedDate, -i);
          const tot = getDayTotals(ds);
          const wt = state.weightLog && state.weightLog[ds] ? state.weightLog[ds] + ' kg' : '—';
          rows.push('<tr><td style="border:1px solid #cbd5e1;padding:7px;">' + ds + '</td><td style="border:1px solid #cbd5e1;padding:7px;font-weight:700;">' + Math.round(tot.calories) + ' kcal</td><td style="border:1px solid #cbd5e1;padding:7px;">' + Math.round(tot.protein) + 'g</td><td style="border:1px solid #cbd5e1;padding:7px;">' + Math.round(tot.carbs) + 'g</td><td style="border:1px solid #cbd5e1;padding:7px;">' + Math.round(tot.fat) + 'g</td><td style="border:1px solid #cbd5e1;padding:7px;">' + (tot.water || 0) + '</td><td style="border:1px solid #cbd5e1;padding:7px;">' + wt + '</td></tr>');
        }
        const innerReport =
          '<div style="font-family:Inter,Hind Siliguri,sans-serif;padding:20px;color:#0f172a;background:#ffffff;">' +
            '<div style="border-bottom:2px solid #7c3aed;padding-bottom:10px;margin-bottom:14px;">' +
              '<h1 style="margin:0;font-size:20px;color:#4c1d95;font-weight:800;">খাবার ও ক্যালরি হিসাব — ৭ দিনের প্রফেশনাল রিপোর্ট</h1>' +
              '<p style="margin:4px 0 0;font-size:12px;color:#64748b;">তারিখ: ' + state.selectedDate + ' · দৈনিক লক্ষ্য: ' + goalCal + ' kcal · Powered by জাহিদ</p>' +
            '</div>' +
            '<div style="display:flex;gap:12px;margin-bottom:14px;">' +
              (wImg ? '<img src="' + wImg + '" style="width:48%;border:1px solid #e2e8f0;border-radius:10px;padding:6px;">' : '') +
              (mImg ? '<img src="' + mImg + '" style="width:48%;border:1px solid #e2e8f0;border-radius:10px;padding:6px;">' : '') +
            '</div>' +
            '<table style="width:100%;border-collapse:collapse;font-size:11px;text-align:center;">' +
              '<thead><tr style="background:#f5f3ff;color:#4c1d95;"><th style="border:1px solid #cbd5e1;padding:7px;">তারিখ</th><th style="border:1px solid #cbd5e1;padding:7px;">ক্যালরি</th><th style="border:1px solid #cbd5e1;padding:7px;">প্রোটিন</th><th style="border:1px solid #cbd5e1;padding:7px;">কার্ব</th><th style="border:1px solid #cbd5e1;padding:7px;">ফ্যাট</th><th style="border:1px solid #cbd5e1;padding:7px;">পানি</th><th style="border:1px solid #cbd5e1;padding:7px;">ওজন</th></tr></thead>' +
              '<tbody>' + rows.join('') + '</tbody>' +
            '</table>' +
          '</div>';

        if (typeof html2pdf !== 'undefined') {
          showToast(state.lang === 'bn' ? '📄 PDF রিপোর্ট ডাউনলোড হচ্ছে...' : '📄 Generating PDF report...');
          const wrap = document.createElement('div');
          wrap.innerHTML = innerReport;
          html2pdf().set({
            margin: 8,
            filename: 'calorie-report-' + state.selectedDate + '.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          }).from(wrap).save().catch(function () { window.print(); });
        } else {
          window.print();
        }
      });


      /* ======================== UI POLISH: WEIGHT MODAL, DRAGGABLE AI FAB & COACH VOICE MIC ======================== */
      (function initWeightModal() {
        const modal = document.getElementById('weight-details-modal');
        const openBtn = document.getElementById('btn-open-weight-modal');
        const closeBtn = document.getElementById('btn-close-weight-modal');
        if (!modal || !openBtn) return;
        function openM() { modal.classList.remove('hidden'); modal.classList.add('flex'); }
        function closeM() { modal.classList.add('hidden'); modal.classList.remove('flex'); }
        openBtn.addEventListener('click', openM);
        if (closeBtn) closeBtn.addEventListener('click', closeM);
        modal.addEventListener('click', function (e) { if (e.target === modal) closeM(); });
        const form = document.getElementById('weight-log-form');
        if (form) form.addEventListener('submit', function () { setTimeout(closeM, 60); });
      })();

      // Draggable AI Coach FAB (tap to open, drag to reposition anywhere & remember position)
      (function initDraggableCoachFab() {
        const fab = document.getElementById('btn-ai-coach-fab');
        if (!fab) return;
        try {
          const saved = JSON.parse(localStorage.getItem('cal_fab_pos') || 'null');
          if (saved && typeof saved.left === 'number' && typeof saved.top === 'number') {
            fab.style.right = 'auto';
            fab.style.bottom = 'auto';
            fab.style.left = Math.max(8, Math.min(window.innerWidth - 58, saved.left)) + 'px';
            fab.style.top = Math.max(64, Math.min(window.innerHeight - 110, saved.top)) + 'px';
          }
        } catch (e) {}
        let dragging = false, moved = false, startX = 0, startY = 0, origLeft = 0, origTop = 0;
        fab.addEventListener('pointerdown', function (e) {
          dragging = true;
          moved = false;
          const rect = fab.getBoundingClientRect();
          startX = e.clientX;
          startY = e.clientY;
          origLeft = rect.left;
          origTop = rect.top;
          try { fab.setPointerCapture(e.pointerId); } catch (err) {}
        });
        fab.addEventListener('pointermove', function (e) {
          if (!dragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
          if (!moved) return;
          const nx = Math.max(8, Math.min(window.innerWidth - 58, origLeft + dx));
          const ny = Math.max(64, Math.min(window.innerHeight - 105, origTop + dy));
          fab.style.right = 'auto';
          fab.style.bottom = 'auto';
          fab.style.left = nx + 'px';
          fab.style.top = ny + 'px';
        });
        fab.addEventListener('pointerup', function () {
          if (!dragging) return;
          dragging = false;
          if (moved) {
            const rect = fab.getBoundingClientRect();
            try { localStorage.setItem('cal_fab_pos', JSON.stringify({ left: Math.round(rect.left), top: Math.round(rect.top) })); } catch (e) {}
            fab.dataset.justDragged = '1';
            setTimeout(function () { delete fab.dataset.justDragged; }, 120);
          }
        });
        fab.addEventListener('click', function (e) {
          if (fab.dataset.justDragged === '1') {
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        }, true);
      })();

      // AI Coach Voice Mic Assistant (detects meal logging phrases & auto-adds or answers)
      (function initCoachVoiceMic() {
        const micBtn = document.getElementById('btn-coach-mic');
        if (!micBtn) return;
        micBtn.addEventListener('click', function () {
          if (typeof triggerHaptic === 'function') triggerHaptic(25);
          const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SpeechRec) {
            showToast(state.lang === 'bn' ? 'এই ব্রাউজারে ভয়েস ইনপুট সাপোর্ট নেই' : 'Voice input not supported in this browser');
            return;
          }
          const rec = new SpeechRec();
          rec.lang = state.lang === 'bn' ? 'bn-BD' : 'en-US';
          rec.interimResults = false;
          micBtn.classList.add('mic-listening', 'bg-emerald-600', 'text-white');
          rec.onresult = async function (ev) {
            micBtn.classList.remove('mic-listening', 'bg-emerald-600', 'text-white');
            const transcript = (ev.results && ev.results[0] && ev.results[0][0] && ev.results[0][0].transcript) || '';
            if (!transcript) return;
            const low = transcript.toLowerCase();
            const isFoodLog = low.includes('খেয়েছি') || low.includes('খাইছি') || low.includes('খেলাম') || low.includes('ate ') || low.includes('had ');
            if (isFoodLog && typeof parseMultiVoiceMeals === 'function') {
              coachHistory.push({ role: 'user', text: '🎤 ' + transcript });
              coachHistory.push({ role: 'ai', text: state.lang === 'bn' ? '⏳ আপনার বলা সব খাবার আলাদা করে যোগ করছি...' : '⏳ Extracting all food items and logging...' });
              renderCoachMessages();
              try {
                const items = await parseMultiVoiceMeals(transcript);
                if (items && items.length > 0) {
                  const summaryLines = [];
                  items.forEach(function (it) {
                    const mKey = ['breakfast', 'lunch', 'snacks', 'dinner'].includes(it.meal) ? it.meal : getAutoMealByTime();
                    logFoodItem({
                      nameEn: it.name,
                      nameBn: it.name,
                      servingEn: it.serving || '1 serving',
                      servingBn: it.serving || '১ পরিবেশন',
                      calories: Number(it.calories) || 160,
                      protein: Number(it.protein) || 5,
                      carbs: Number(it.carbs) || 22,
                      fat: Number(it.fat) || 4
                    }, mKey, 1);
                    summaryLines.push('• ' + it.name + ' (' + (Number(it.calories) || 160) + ' kcal)');
                  });
                  coachHistory[coachHistory.length - 1] = {
                    role: 'ai',
                    text: (state.lang === 'bn' ? '✅ অটো যোগ করা হয়েছে:\n' : '✅ Auto-logged:\n') + summaryLines.join('\n')
                  };
                  renderCoachMessages();
                  return;
                }
              } catch (e) {}
            }
            handleCoachSend(transcript);
          };
          rec.onerror = function () { micBtn.classList.remove('mic-listening', 'bg-emerald-600', 'text-white'); };
          rec.onend = function () { micBtn.classList.remove('mic-listening', 'bg-emerald-600', 'text-white'); };
          rec.start();
        });
      })();


      /* ======================== 9 POLISH UPGRADES (MEAL PLANNER, STREAK FREEZE, PRIVACY, PWA SHORTCUTS, HAPTICS) ======================== */
      document.getElementById('btn-gen-meal-plan').addEventListener('click', async function () {
        if (typeof triggerHaptic === 'function') triggerHaptic(40);
        const out = document.getElementById('ai-meal-plan-result');
        const btn = document.getElementById('btn-gen-meal-plan');
        if (!out || !btn) return;
        out.classList.remove('hidden');
        btn.disabled = true;
        out.textContent = state.lang === 'bn' ? '⏳ আপনার বাকি ক্যালরি দেখে আজকের মিল প্ল্যান তৈরি হচ্ছে...' : '⏳ Generating your personalized meal plan...';
        const totals = getDayTotals(state.selectedDate);
        const goalCal = Number(state.goals.calories) || 2000;
        const goalPro = Number(state.goals.protein) || 100;
        const remCal = Math.max(150, Math.round(goalCal - totals.calories));
        const proShort = Math.max(0, Math.round(goalPro - totals.protein));
        const prompt = 'I have ' + remCal + ' kcal left today. My protein goal is short by ' + proShort +
          'g. Suggest a simple, realistic Bangladeshi 2-meal plan (with approximate calories & protein per meal) in ' +
          (state.lang === 'bn' ? 'natural Bangla.' : 'English.');
        const reply = await askAiNutritionCoach(prompt);
        out.textContent = '🍱 ' + reply;
        btn.disabled = false;
      });

      document.getElementById('btn-streak-freeze').addEventListener('click', function () {
        if (typeof triggerHaptic === 'function') triggerHaptic(40);
        const g = computeGamificationStats();
        if (g.xp < 50) {
          showToast(state.lang === 'bn' ? 'স্ট্রিক ফ্রিজ করতে কমপক্ষে ৫০ XP প্রয়োজন (আপনার আছে ' + g.xp + ' XP)' : 'Need at least 50 XP to freeze streak (you have ' + g.xp + ' XP)');
          return;
        }
        if (!Array.isArray(state.frozenDates)) state.frozenDates = [];
        const yest = getLocalDateStr(-1);
        const yLog = state.logsByDate[yest];
        const targetDate = (!yLog || !yLog.entries || yLog.entries.length === 0) ? yest : getLocalDateStr(0);
        if (state.frozenDates.indexOf(targetDate) !== -1) {
          showToast(state.lang === 'bn' ? '❄️ এই দিনটি ইতিমধ্যেই ফ্রিজ করা আছে!' : '❄️ This day is already frozen!');
          return;
        }
        state.frozenDates.push(targetDate);
        state.xpSpent = (Number(state.xpSpent) || 0) + 50;
        saveState();
        renderAll();
        launchConfetti();
        showToast(state.lang === 'bn' ? '❄️ স্ট্রিক ফ্রিজ সফল! (' + targetDate + ' সুরক্ষিত, -50 XP)' : '❄️ Streak frozen for ' + targetDate + ' (-50 XP)!');
      });

      (function initPrivacyModal() {
        const m = document.getElementById('privacy-policy-modal');
        const openBtn = document.getElementById('btn-open-privacy');
        const closeBtn = document.getElementById('btn-close-privacy');
        const okBtn = document.getElementById('btn-ok-privacy');
        if (!m || !openBtn) return;
        function openP() { m.classList.remove('hidden'); m.classList.add('flex'); }
        function closeP() { m.classList.add('hidden'); m.classList.remove('flex'); }
        openBtn.addEventListener('click', openP);
        if (closeBtn) closeBtn.addEventListener('click', closeP);
        if (okBtn) okBtn.addEventListener('click', closeP);
        m.addEventListener('click', function (e) { if (e.target === m) closeP(); });
      })();

      document.addEventListener('click', function (e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        try {
          if (navigator.vibrate) {
            const isPrimary = btn.type === 'submit' || /save|add|plus|submit|plan|freeze|confirm/i.test(btn.id || '');
            navigator.vibrate(isPrimary ? 40 : 15);
          }
        } catch (err) {}
      }, true);

      setTimeout(function () {
        try {
          const params = new URLSearchParams(window.location.search);
          const action = params.get('action');
          if (!action) return;
          if (action === 'water') {
            const wp = document.getElementById('btn-water-plus');
            if (wp) wp.click();
          } else if (action === 'scan') {
            const cam = document.getElementById('btn-camera-today');
            if (cam) cam.click();
          } else if (action === 'report') {
            switchTab('reports');
          }
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (e) {}
      }, 450);


      /* ======================== APP-STORE QUALITY: OFFLINE BANNER & PWA UPDATE PROMPT ======================== */
      function syncOfflineBanner() {
        const b = document.getElementById('offline-banner');
        if (!b) return;
        b.classList.toggle('hidden', navigator.onLine !== false);
      }
      window.addEventListener('offline', syncOfflineBanner);
      window.addEventListener('online', function () {
        syncOfflineBanner();
        showToast(state.lang === 'bn' ? '🌐 ইন্টারনেট ফিরে এসেছে! ডেটা সিঙ্ক হচ্ছে...' : '🌐 Back online! Syncing data...');
      });
      syncOfflineBanner();

      if ('serviceWorker' in navigator) {
        let _swRefreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', function () {
          if (_swRefreshing) return;
          _swRefreshing = true;
          window.location.reload();
        });
        navigator.serviceWorker.register('./sw.js').then(function (reg) {
          reg.addEventListener('updatefound', function () {
            const nw = reg.installing;
            if (!nw) return;
            nw.addEventListener('statechange', function () {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                const banner = document.getElementById('pwa-update-banner');
                const btn = document.getElementById('btn-pwa-apply-update');
                if (banner && btn) {
                  banner.classList.remove('hidden');
                  btn.onclick = function () {
                    nw.postMessage({ action: 'skipWaiting' });
                    banner.classList.add('hidden');
                  };
                }
              }
            });
          });
        }).catch(function () {});
      }


      /* ======================== SMART VOICE NLP, MEAL SCORING, FAVORITES, HYDRATION, MICROS, CLOUD BACKUP & ERROR GUARD ======================== */
      // 1. Multi-Item Natural Language Voice Parser (JSON array extraction)
      async function parseMultiVoiceMeals(voiceText) {
        const prompt = 'Extract every food item, quantity/serving, meal type (breakfast, lunch, snacks, or dinner), and realistic calories/protein/carbs/fat from this sentence: "' +
          voiceText + '". Return ONLY a valid JSON array like [{"name":"Boiled Egg","serving":"2 pcs","meal":"breakfast","calories":140,"protein":12,"carbs":1,"fat":10}]. Keep names in the same language as input.';
        let rawText = '';
        const rawGroq = (state.groqApiKey || (document.getElementById('input-groq-key') || {}).value || '').trim();
        const groqKey = typeof normalizeGroqKey === 'function' ? normalizeGroqKey(rawGroq) : rawGroq;
        const gemKey = (state.geminiApiKey || (document.getElementById('input-gemini-key') || {}).value || '').trim();
        if (groqKey && typeof callGroqVision === 'function') {
          try {
            const g = await callGroqVision(groqKey, prompt, null);
            if (g && g.text) rawText = g.text;
          } catch (e) {}
        }
        if (!rawText && gemKey && typeof callGeminiWithFallback === 'function') {
          try {
            const j = await callGeminiWithFallback(gemKey, [{ text: prompt }]);
            rawText = (j && j.json && j.json.candidates && j.json.candidates[0] && j.json.candidates[0].content && j.json.candidates[0].content.parts && j.json.candidates[0].content.parts[0] && j.json.candidates[0].content.parts[0].text) || '';
          } catch (e) {}
        }
        if (rawText) {
          const m = rawText.match(/\[[\s\S]*\]/);
          if (m) {
            try {
              const arr = JSON.parse(m[0]);
              if (Array.isArray(arr) && arr.length > 0) return arr;
            } catch (e) {}
          }
        }
        // Smart local Bangla/English multi-item fallback
        const low = voiceText.toLowerCase();
        let mealGuess = getAutoMealByTime();
        if (/সকাল|নাস্তা|breakfast|morning/.test(low)) mealGuess = 'breakfast';
        else if (/দুপুর|lunch/.test(low)) mealGuess = 'lunch';
        else if (/রাত|dinner|night/.test(low)) mealGuess = 'dinner';
        else if (/বিকাল|সন্ধ্যা|snack/.test(low)) mealGuess = 'snacks';
        const parts = voiceText.split(/\s+(?:আর|এবং|ও|সাথে|and|with)\s+|,/i).map(function (s) { return s.replace(/আমি|সকালে|দুপুরে|রাতে|খেয়েছি|খাইছি|খেলাম|i ate|i had/gi, '').trim(); }).filter(Boolean);
        return (parts.length ? parts : [voiceText]).map(function (p) {
          const pl = p.toLowerCase();
          if (/ডিম|egg/.test(pl)) { const n = (pl.match(/\d+|[১২৩৪৫]/) || ['1'])[0]; const mult = Number(String(n).replace(/[১২৩৪৫]/g, function(d){return '১২৩৪৫'.indexOf(d)+1;})) || 1; return { name: p, serving: mult + ' টি', meal: mealGuess, calories: 75 * mult, protein: 6 * mult, carbs: 1 * mult, fat: 5 * mult }; }
          if (/ভাত|rice/.test(pl)) return { name: p, serving: '১ কাপ', meal: mealGuess, calories: 205, protein: 4, carbs: 45, fat: 0.5 };
          if (/রুটি|roti/.test(pl)) return { name: p, serving: '১টি', meal: mealGuess, calories: 110, protein: 3, carbs: 22, fat: 1 };
          if (/মাছ|fish/.test(pl)) return { name: p, serving: '১ টুকরো', meal: mealGuess, calories: 190, protein: 22, carbs: 2, fat: 10 };
          if (/মুরগি|chicken/.test(pl)) return { name: p, serving: '১ টুকরো', meal: mealGuess, calories: 220, protein: 24, carbs: 3, fat: 12 };
          return { name: p, serving: '১ পরিবেশন', meal: mealGuess, calories: 170, protein: 6, carbs: 22, fat: 5 };
        });
      }

      // 2. Favorite Meal Templates (❤️ One-Click Add)
      function isMealFavorite(name) {
        const key = String(name || '').trim().toLowerCase();
        return Array.isArray(state.favoriteMeals) && state.favoriteMeals.some(function (f) {
          return String(f.nameBn || f.nameEn || '').trim().toLowerCase() === key;
        });
      }
      function toggleFavoriteFromEntry(entry) {
        if (!Array.isArray(state.favoriteMeals)) state.favoriteMeals = [];
        const key = String(entry.nameBn || entry.nameEn || '').trim().toLowerCase();
        const idx = state.favoriteMeals.findIndex(function (f) {
          return String(f.nameBn || f.nameEn || '').trim().toLowerCase() === key;
        });
        if (idx !== -1) {
          state.favoriteMeals.splice(idx, 1);
          showToast(state.lang === 'bn' ? 'ফেভারিট থেকে সরানো হয়েছে' : 'Removed from favorites');
        } else {
          state.favoriteMeals.unshift({
            id: 'fav_' + Date.now(),
            nameEn: entry.nameEn,
            nameBn: entry.nameBn,
            servingEn: entry.servingEn,
            servingBn: entry.servingBn,
            calories: entry.calories,
            protein: entry.protein,
            carbs: entry.carbs,
            fat: entry.fat,
            emoji: entry.emoji || '❤️'
          });
          showToast(state.lang === 'bn' ? '❤️ আমার ফেভারিটে সেভ হয়েছে!' : '❤️ Saved to My Favorites!');
        }
        saveState();
        renderAll();
      }
      function renderFavoritesStrip() {
        const strip = document.getElementById('favorites-strip');
        const cnt = document.getElementById('favorites-count-pill');
        if (!strip) return;
        const favs = Array.isArray(state.favoriteMeals) ? state.favoriteMeals : [];
        if (cnt) cnt.textContent = state.lang === 'bn' ? (favs.length + 'টি') : (favs.length + ' saved');
        if (favs.length === 0) {
          strip.innerHTML = '<p class="text-[11px] text-slate-400 dark:text-slate-400 py-1">' +
            (state.lang === 'bn' ? 'যেকোনো লগ করা খাবারের পাশে 🤍 ট্যাপ করলে সেটি এখানে সেভ হয়ে যাবে।' : 'Tap 🤍 on any logged meal above to save it as a one-tap template.') +
          '</p>';
          return;
        }
        strip.innerHTML = favs.map(function (f, idx) {
          const nm = state.lang === 'bn' ? (f.nameBn || f.nameEn) : (f.nameEn || f.nameBn);
          return '<button type="button" data-add-fav-idx="' + idx + '" class="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50/80 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/70 shadow-sm hover:border-rose-400 transition">' +
            '<span class="text-sm leading-none">' + (f.emoji || '❤️') + '</span>' +
            '<span class="text-xs font-bold text-slate-800 dark:text-slate-100">' + escapeHtml(nm) + '</span>' +
            '<span class="text-[11px] font-extrabold text-rose-600 dark:text-rose-300">+' + f.calories + '</span>' +
          '</button>';
        }).join('');
      }
      document.getElementById('meals-container').addEventListener('click', function (e) {
        const favBtn = e.target.closest('[data-fav-entry]');
        if (!favBtn) return;
        const id = favBtn.getAttribute('data-fav-entry');
        const day = getDayLog(state.selectedDate);
        const item = (day.entries || []).find(function (x) { return x.id === id; });
        if (item) toggleFavoriteFromEntry(item);
      });
      document.getElementById('favorites-strip').addEventListener('click', function (e) {
        const btn = e.target.closest('[data-add-fav-idx]');
        if (!btn) return;
        const idx = Number(btn.getAttribute('data-add-fav-idx'));
        const f = (state.favoriteMeals || [])[idx];
        if (f) logFoodItem(f, getAutoMealByTime(), 1);
      });

      // 3. Daily Meal Rating Score (1-10) & Micronutrient Gaps (Vitamin C, Calcium, Iron)
      function renderMealScoreAndMicros() {
        const tot = getDayTotals(state.selectedDate);
        const goalCal = Math.max(1, Number(state.goals.calories) || 2000);
        const goalPro = Math.max(1, Number(state.goals.protein) || 100);
        const goalFat = Math.max(1, Number(state.goals.fat) || 65);
        const badge = document.getElementById('meal-score-badge');
        const verdict = document.getElementById('meal-score-verdict');
        if (badge && verdict) {
          if (tot.calories <= 0) {
            badge.textContent = '—/10';
            badge.className = 'shrink-0 px-2.5 py-1 rounded-xl text-xs font-black bg-white/25 text-white';
            verdict.textContent = state.lang === 'bn' ? 'খাবার লগ করলে আজকের স্কোর দেখাবে' : 'Log meals to see your daily score';
          } else {
            let score = 10;
            if (tot.calories > goalCal * 1.15) score -= 2.5;
            else if (tot.calories < goalCal * 0.45) score -= 1.5;
            if (tot.protein < goalPro * 0.55) score -= 2;
            if (tot.fat > goalFat * 1.25) score -= 2;
            if ((tot.water || 0) < 4) score -= 1;
            score = Math.max(1, Math.min(10, Math.round(score)));
            badge.textContent = score + '/10';
            if (score >= 8) {
              badge.className = 'shrink-0 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-400 text-slate-950';
              verdict.textContent = state.lang === 'bn' ? 'চমৎকার ব্যালেন্স! এভাবেই চালিয়ে যান।' : 'Great nutritional balance today!';
            } else if (score >= 5) {
              badge.className = 'shrink-0 px-2.5 py-1 rounded-xl text-xs font-black bg-amber-300 text-slate-950';
              verdict.textContent = tot.fat > goalFat ? (state.lang === 'bn' ? 'ফ্যাট একটু বেশি — পরের বেলা হালকা খাবার খান।' : 'Fat is a bit high — go lighter next meal.') : (state.lang === 'bn' ? 'মোটামুটি ভালো — প্রোটিন ও পানি আরেকটু বাড়ান।' : 'Decent — add a bit more protein & water.');
            } else {
              badge.className = 'shrink-0 px-2.5 py-1 rounded-xl text-xs font-black bg-rose-500 text-white';
              verdict.textContent = state.lang === 'bn' ? 'ক্যালরি/ফ্যাট ভারসাম্য কম — সবজি ও প্রোটিন যোগ করুন।' : 'Unbalanced macros — add lean protein & veggies.';
            }
          }
        }

        // Estimate Micronutrients from today's entries
        const day = getDayLog(state.selectedDate);
        let vitC = 0, calcium = 0, iron = 0;
        (day.entries || []).forEach(function (it) {
          const n = ((it.nameEn || '') + ' ' + (it.nameBn || '')).toLowerCase();
          const m = Number(it.qty) || 1;
          if (/fruit|ফল|লেবু|lemon|orange|কমলা|পেয়ারা|guava|আম|mango|শাক|সবজি|salad|সালাদ/.test(n)) vitC += 32 * m;
          else vitC += 6 * m;
          if (/milk|দুধ|দই|yogurt|curd|পনির|cheese|ছোট মাছ|small fish|ডিম|egg/.test(n)) calcium += 240 * m;
          else calcium += 45 * m;
          if (/শাক|spinach|ডাল|dal|মাংস|beef|গরু|খাসি|মুরগি|chicken|মাছ|fish|ডিম|egg|কলিজা/.test(n)) iron += 3.5 * m;
          else iron += 0.9 * m;
        });
        const items = [
          { lbl: state.lang === 'bn' ? '🍊 ভিটামিন সি' : '🍊 Vitamin C', val: Math.round(vitC), target: 90, unit: 'mg', color: 'from-amber-400 to-orange-500', tipBn: 'ভিটামিন সি কম আছে — লেবু, আমলকী বা পেয়ারা যোগ করুন।', tipEn: 'Low Vitamin C — add lemon, orange, or guava.' },
          { lbl: state.lang === 'bn' ? '🦴 ক্যালসিয়াম' : '🦴 Calcium', val: Math.round(calcium), target: 1000, unit: 'mg', color: 'from-sky-400 to-blue-500', tipBn: 'ক্যালসিয়াম কম আছে — দুধ, টক দই বা ছোট মাছ খান।', tipEn: 'Low Calcium — add milk, yogurt, or small fish.' },
          { lbl: state.lang === 'bn' ? '🩸 আয়রন' : '🩸 Iron', val: Math.round(iron * 10) / 10, target: 18, unit: 'mg', color: 'from-rose-400 to-pink-600', tipBn: 'আয়রন কম আছে — লাল শাক, কচু শাক, ডাল বা ডিম যোগ করুন।', tipEn: 'Low Iron — add leafy greens, lentils, or eggs.' }
        ];
        const barsEl = document.getElementById('micronutrient-bars');
        const tipEl = document.getElementById('micro-gap-tip');
        if (barsEl) {
          barsEl.innerHTML = items.map(function (x) {
            const p = Math.min(100, Math.round((x.val / x.target) * 100));
            return '<div class="space-y-1">' +
              '<div class="flex items-center justify-between text-xs"><span class="font-bold text-slate-700 dark:text-slate-200">' + x.lbl + '</span><span class="font-extrabold text-slate-500 dark:text-slate-300">' + x.val + '/' + x.target + x.unit + ' (' + p + '%)</span></div>' +
              '<div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div class="h-full rounded-full bg-gradient-to-r ' + x.color + ' bar-fill" style="width:' + p + '%"></div></div>' +
            '</div>';
          }).join('');
        }
        if (tipEl) {
          const lowest = items.slice().sort(function (a, b) { return (a.val / a.target) - (b.val / b.target); })[0];
          tipEl.textContent = (lowest.val / lowest.target) < 0.7 ? (state.lang === 'bn' ? lowest.tipBn : lowest.tipEn) : (state.lang === 'bn' ? '✅ আজকের মাইক্রোনিউট্রিয়েন্ট ব্যালেন্স দারুণ!' : '✅ Great micronutrient coverage today!');
        }
      }

      // 4. Smart 2-Hour Hydration Reminder
      const waterRemChk = document.getElementById('chk-water-reminder');
      if (waterRemChk) {
        try { waterRemChk.checked = localStorage.getItem('cal_water_rem_on') === '1'; } catch (e) {}
        waterRemChk.addEventListener('change', function (e) {
          const on = Boolean(e.target.checked);
          try { localStorage.setItem('cal_water_rem_on', on ? '1' : '0'); } catch (err) {}
          if (on && 'Notification' in window) {
            Notification.requestPermission().then(function (p) {
              if (p === 'granted') showToast(state.lang === 'bn' ? '💧 ২ ঘণ্টা পর পর পানি রিমাইন্ডার চালু হয়েছে!' : '💧 2-hour hydration reminders enabled!');
            }).catch(function () {});
          }
        });
        setInterval(function () {
          let on = false;
          try { on = localStorage.getItem('cal_water_rem_on') === '1'; } catch (e) {}
          if (!on || !('Notification' in window) || Notification.permission !== 'granted') return;
          const gW = Math.max(1, Number(state.goals.water) || 8);
          const curW = (getDayTotals(getLocalDateStr(0)).water) || 0;
          const rem = gW - curW;
          if (rem > 0) {
            try {
              new Notification('খাবার ও ক্যালরি হিসাব', {
                body: state.lang === 'bn'
                  ? '💧 আপনি কি পানি পান করেছেন? আজ আরও ' + rem + ' গ্লাস বাকি আছে!'
                  : '💧 Time to hydrate! ' + rem + ' glasses left today!',
                icon: './icon-192.png'
              });
            } catch (e) {}
          }
        }, 2 * 60 * 60 * 1000);
      }

      // 5. Explicit Cloud Backup Button in Settings
      const cloudBakBtn = document.getElementById('btn-cloud-backup-now');
      if (cloudBakBtn) {
        cloudBakBtn.addEventListener('click', function () {
          if (typeof syncToFirebaseCloud === 'function' && fbUser) {
            syncToFirebaseCloud();
            showToast(state.lang === 'bn' ? '☁️ আপনার সম্পূর্ণ ডেটা ক্লাউডে নিরাপদে ব্যাকআপ হয়েছে!' : '☁️ Cloud backup saved safely!');
          } else {
            showToast(state.lang === 'bn' ? 'ক্লাউড ব্যাকআপের জন্য লগইন করুন অথবা JSON ব্যাকআপ ডাউনলোড করুন' : 'Sign in for cloud backup or use JSON Backup');
          }
        });
      }

      // 6. Global Non-Crashing Error Guard
      window.addEventListener('error', function () {
        try {
          showToast(state.lang === 'bn' ? 'একটি ছোট সমস্যা হয়েছে — আবার চেষ্টা করুন' : 'Something went wrong — please try again');
        } catch (e) {}
      });

      // Initial render & Firebase init (show Login Screen unless user previously chose Guest or is logged in)
      renderAll();
      initFirebaseIfConfigured();
      try {
        if (localStorage.getItem('cal_tracker_guest_ok') === '1') {
          hideLoginScreen();
        }
      } catch (e) {}
})();
