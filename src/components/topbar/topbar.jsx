import React, { useState, useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Link } from '../ui/LocaleLink';
import { Home, Image, FolderOpen, Info, Contact, Menu, X } from 'lucide-react';
import { useLanguage, rememberLanguage } from '../../context/LanguageContext';
import { LANGS, localizePath, stripLang } from '../../lib/i18n-paths.mjs';
import Logo from '../ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TR · EN: the same page in the other language. Choosing one is remembered,
 * so the device language never overrides it afterwards.
 */
const LanguageSwitch = ({ className = '', compact = false }) => {
  const location = useLocation();
  const { language } = useLanguage();
  return (
    <div className={`flex items-center text-[12px] font-semibold tracking-[0.16em] ${className}`} role="group" aria-label="Dil / Language">
      {LANGS.filter((lang) => !compact || lang !== language).map((lang, i) => {
        const active = lang === language;
        return (
          <React.Fragment key={lang}>
            {i > 0 && <span aria-hidden="true" className="text-white/25">·</span>}
            {active ? (
              <span aria-current="true" className="inline-flex items-center justify-center h-11 min-w-[36px] px-1.5 text-white">{lang.toUpperCase()}</span>
            ) : (
              <RouterLink
                to={localizePath(location.pathname + location.search, lang)}
                onClick={() => rememberLanguage(lang)}
                hrefLang={lang}
                lang={lang}
                aria-label={lang === 'en' ? 'English' : 'Türkçe'}
                className="inline-flex items-center justify-center h-11 min-w-[36px] px-1.5 rounded-full text-white/45 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:text-white focus-visible:underline underline-offset-4"
              >
                {lang.toUpperCase()}
              </RouterLink>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Topbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // While the menu is open: Escape closes it and the page behind does not scroll.
  // It also closes itself when the screen grows past the mobile breakpoint
  // (e.g. a tablet rotated to landscape).
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = (e) => { if (e.matches) setMobileMenuOpen(false); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [mobileMenuOpen]);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const navItems = [
    { name: t('nav', 'home'), path: '/', icon: Home },
    { name: t('nav', 'collections'), path: '/collections', icon: FolderOpen },
    { name: t('nav', 'allProducts'), path: '/products', icon: Image },
    { name: t('nav', 'about'), path: '/about', icon: Info },
    { name: t('nav', 'contact'), path: '/contact', icon: Contact },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 h-[75px] flex items-center justify-center ${
        scrolled ? 'bg-surface/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-7xl px-4 [@media(min-width:380px)]:px-6 lg:px-8 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center no-underline relative group"
          onClick={handleLinkClick}
          aria-label="Piece Of Oblivion — Home"
        >
          <Logo className="text-gray-200 group-hover:text-white transition-colors duration-500 relative z-10 [@media(max-width:379px)]:[&_svg]:w-9 [@media(max-width:379px)]:[&_svg]:h-9 [@media(max-width:379px)]:[&_.satisfy-regular]:text-[23px]" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const here = stripLang(location.pathname);
            const isActive = item.path === '/' ? here === '/' : here === item.path || here.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center h-11 px-3 xl:px-4 rounded-full whitespace-nowrap text-[13px] font-medium tracking-wide transition-colors duration-500 group ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className={`transition-all duration-500 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                  <span>{item.name}</span>
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <span aria-hidden="true" className="ml-2 xl:ml-3 h-5 w-px bg-white/15" />
          <LanguageSwitch className="ml-1 xl:ml-2" />
        </div>

        {/* Mobile: language switch and menu button */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Phones show only the other language, so the header fits 320px */}
          <LanguageSwitch compact />
          <button
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="relative z-50 -mr-2.5 w-11 h-11 flex items-center justify-center rounded-full text-gray-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          >
            <motion.div
             animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
             transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
            className="lg:hidden fixed top-[75px] left-0 w-full h-[calc(100dvh-75px)] bg-surface/95 border-t border-white/5 shadow-2xl z-40 overflow-y-auto"
          >
            <div className="flex flex-col max-w-2xl mx-auto px-6 py-10 short:py-4 space-y-3 short:space-y-1">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const here = stripLang(location.pathname);
            const isActive = item.path === '/' ? here === '/' : here === item.path || here.startsWith(`${item.path}/`);

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`relative flex items-center justify-between px-5 py-4 short:py-2.5 rounded-2xl text-[15px] font-light tracking-wide transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'text-white border border-primary/30 bg-primary/5'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="relative z-10 flex items-center space-x-4">
                        <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className={`transition-colors duration-300 ${isActive ? 'text-primary' : ''}`} />
                        <span>{item.name}</span>
                      </div>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="mobileActiveDot"
                          className="w-1.5 h-1.5 rounded-full bg-primary relative z-10 shadow-[0_0_8px_rgba(168,50,41,0.8)]" 
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Aesthetic bottom flourish for mobile menu */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 pb-12 flex justify-center short:hidden"
            >
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Topbar;
