// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locale/en.json';
import de from './locale/de.json';

// 1️⃣ localStorage se language lo
const savedLanguage = localStorage.getItem('lang');

// 2️⃣ Agar saved nahi hai to browser se detect karo
const browserLanguage = navigator.language.startsWith('de') ? 'de' : 'en';

// 3️⃣ Final language
const defaultLanguage = savedLanguage || browserLanguage;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    lng: defaultLanguage, // ✅ fixed
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
