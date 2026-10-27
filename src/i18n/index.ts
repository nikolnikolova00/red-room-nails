import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import bg from './locales/bg.json';
import en from './locales/en.json';

export type Language = 'bg' | 'en';

const deviceLanguage = getLocales()[0]?.languageCode;
const initialLanguage: Language = deviceLanguage === 'en' ? 'en' : 'bg';

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: {
    bg: { translation: bg },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: 'bg',
  supportedLngs: ['bg', 'en'],
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
