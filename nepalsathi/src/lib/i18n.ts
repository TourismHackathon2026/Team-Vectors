type Lang = 'English' | 'Nepali' | 'Hindi';

const translations: Record<Lang, Record<string, string>> = {
  English: {
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'nav.map': 'Map',
    'nav.passport': 'Passport',
    'nav.quests': 'Quests',
    'nav.story': 'Story',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.leaderboard': 'Leaderboard',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.login': 'Log in',
    'nav.signup': 'Sign up',
    'hero.badge': 'Your Local Friend for Exploring Nepal',
    'hero.title1': 'Discover Kathmandu,',
    'hero.title2': 'Explore As',
    'hero.title3': 'A Local.',
    'hero.subtitle': 'Your digital passport to Nepal\'s UNESCO World Heritage Sites.',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
    'common.search': 'Search',
    'common.noResults': 'No results found',
  },
  Nepali: {
    'nav.home': 'गृहपृष्ठ',
    'nav.explore': 'अन्वेषण',
    'nav.map': 'नक्सा',
    'nav.passport': 'पासपोर्ट',
    'nav.quests': 'खोजहरू',
    'nav.story': 'कथा',
    'nav.about': 'बारेमा',
    'nav.contact': 'सम्पर्क',
    'nav.leaderboard': 'लिडरबोर्ड',
    'nav.dashboard': 'ड्यासबोर्ड',
    'nav.profile': 'प्रोफाइल',
    'nav.login': 'लग इन',
    'nav.signup': 'साइन अप',
    'hero.badge': 'नेपाल घुम्नको लागि तपाईंको स्थानीय साथी',
    'hero.title1': 'काठमाडौं पत्ता लगाउनुहोस्,',
    'hero.title2': 'अन्वेषण गर्नुहोस्',
    'hero.title3': 'स्थानीय जस्तै।',
    'hero.subtitle': 'नेपालको युनेस्को विश्व सम्पदा स्थलहरूमा तपाईंको डिजिटल पासपोर्ट।',
    'common.loading': 'लोड हुँदै...',
    'common.error': 'त्रुटि',
    'common.save': 'सुरक्षित गर्नुहोस्',
    'common.cancel': 'रद्द गर्नुहोस्',
    'common.delete': 'मेटाउनुहोस्',
    'common.edit': 'सम्पादन गर्नुहोस्',
    'common.back': 'पछाडि',
    'common.search': 'खोज्नुहोस्',
    'common.noResults': 'कुनै परिणाम फेला परेन',
  },
  Hindi: {
    'nav.home': 'होम',
    'nav.explore': 'अन्वेषण',
    'nav.map': 'नक्शा',
    'nav.passport': 'पासपोर्ट',
    'nav.quests': 'खोज',
    'nav.story': 'कहानी',
    'nav.about': 'बारे में',
    'nav.contact': 'संपर्क',
    'nav.leaderboard': 'लीडरबोर्ड',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.login': 'लॉग इन',
    'nav.signup': 'साइन अप',
    'hero.badge': 'नेपाल की खोज के लिए आपका स्थानीय मित्र',
    'hero.title1': 'काठमांडू की खोज करें,',
    'hero.title2': 'एक स्थानीय की तरह',
    'hero.title3': 'अन्वेषण करें।',
    'hero.subtitle': 'नेपाल के यूनेस्को विश्व धरोहर स्थलों के लिए आपका डिजिटल पासपोर्ट।',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.back': 'वापस',
    'common.search': 'खोजें',
    'common.noResults': 'कोई परिणाम नहीं मिला',
  },
};

let currentLang: Lang = 'English';

const listeners: Array<() => void> = [];

export function setLanguage(lang: Lang) {
  currentLang = lang;
  listeners.forEach((fn) => fn());
}

export function getLanguage(): Lang {
  return currentLang;
}

export function onLanguageChange(fn: () => void) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export function t(key: string, fallback?: string): string {
  return translations[currentLang]?.[key] || fallback || key;
}

export type { Lang };
