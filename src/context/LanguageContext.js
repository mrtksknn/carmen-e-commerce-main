import React, { createContext, useContext, useState } from 'react';
import en from '../locales/en.json';
import tr from '../locales/tr.json';

const translations = { en, tr };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'tr' : 'en'));
  };

  const t = (section, key) => {
    return translations[language]?.[section]?.[key] || translations['en']?.[section]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
