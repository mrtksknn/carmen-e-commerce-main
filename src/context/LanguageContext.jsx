import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import en from '../locales/en.json';
import tr from '../locales/tr.json';
import { HTML_LANG, langFromPath, localizePath } from '../lib/i18n-paths.mjs';

const translations = { en, tr };

// Remembers that this browser has already been sent to (or chose) a language,
// so it is redirected at most once and a chosen language sticks.
export const LANG_CHOICE_KEY = 'poo:lang';

const BOT_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|twitterbot|linkedin|embedly|preview|lighthouse|headless/i;

const deviceLanguage = () => {
  if (typeof navigator === 'undefined') return 'tr';
  const primary = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  return primary.toLowerCase().startsWith('tr') ? 'tr' : 'en';
};

export const rememberLanguage = (lang) => {
  try { localStorage.setItem(LANG_CHOICE_KEY, lang); } catch { /* storage unavailable */ }
};

const LanguageContext = createContext();

/**
 * The language comes from the address: Turkish at the root, English under
 * /en/. On a person's very first visit the device language decides once
 * (a Turkish phone opening an /en/ link lands on the Turkish page and vice
 * versa); search engines and link previews are never redirected.
 * Must be rendered inside the Router.
 */
export const LanguageProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const language = langFromPath(location.pathname);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language];
  }, [language]);

  // First visit only: follow the device language
  useEffect(() => {
    if (typeof navigator !== 'undefined' && BOT_RE.test(navigator.userAgent || '')) return;
    if (/^\/admin(?=\/|$)/.test(location.pathname)) return;
    let chosen = null;
    try { chosen = localStorage.getItem(LANG_CHOICE_KEY); } catch { /* storage unavailable */ }
    if (chosen) return;
    const device = deviceLanguage();
    rememberLanguage(device);
    if (device !== language) {
      navigate(localizePath(location.pathname + location.search + location.hash, device), { replace: true });
    }
    // runs once, on the first page of the visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    language,
    t: (section, key) => translations[language]?.[section]?.[key] || translations.tr?.[section]?.[key] || key,
    /** An address in the current language ("/products" → "/en/products"). */
    lp: (path) => localizePath(path, language),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
