import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import tr from '../locales/tr.json';

const translations = { en, tr };

/**
 * The site speaks the visitor's device language: Turkish when the device's
 * primary language is Turkish, English for everything else.
 */
const detectLanguage = () => {
  if (typeof navigator === 'undefined') return 'en';
  const primary = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  return primary.toLowerCase().startsWith('tr') ? 'tr' : 'en';
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(detectLanguage);

  // Sync <html lang="..."> with current language
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Follow the device if its language changes while the page is open
  useEffect(() => {
    const onChange = () => setLanguage(detectLanguage());
    window.addEventListener('languagechange', onChange);
    return () => window.removeEventListener('languagechange', onChange);
  }, []);

  const t = (section, key) => {
    return translations[language]?.[section]?.[key] || translations['en']?.[section]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
