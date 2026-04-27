import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, FolderOpen, Info, Contact, Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center no-underline relative group"
          onClick={handleLinkClick}
          aria-label="Carmen Art Home"
        >
          <Logo className="text-gray-200 group-hover:text-white transition-colors duration-500 relative z-10" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-colors duration-500 group ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className={`transition-all duration-500 ${isActive ? 'text-[#a83229]' : 'group-hover:text-[#a83229]'}`} />
                  <span>{item.name}</span>
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[#a83229]/10 border border-[#a83229]/30 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <div className="w-[1px] h-5 bg-white/10 mx-3 hidden lg:block"></div>

          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold tracking-widest text-gray-300 hover:text-white hover:border-[#a83229]/50 hover:bg-[#a83229]/10 transition-all duration-500"
          >
            <span className={language === 'en' ? 'text-white' : 'text-gray-500'}>EN</span>
            <span className="text-white/20 font-light">|</span>
            <span className={language === 'tr' ? 'text-white' : 'text-gray-500'}>TR</span>
          </button>
        </div>

        {/* Mobile Right Side: Lang Toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex items-center gap-1 px-2 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest text-gray-300 hover:text-white transition-all duration-300"
          >
            <span className={language === 'en' ? 'text-white' : 'text-gray-500'}>EN</span>
            <span className="text-white/20">|</span>
            <span className={language === 'tr' ? 'text-white' : 'text-gray-500'}>TR</span>
          </button>

          <button
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="relative z-50 text-gray-300 hover:text-white transition-colors focus:outline-none"
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
            className="md:hidden fixed top-[75px] left-0 w-full h-[calc(100vh-75px)] bg-[#0a0a0a]/95 border-t border-white/5 shadow-2xl z-40 overflow-y-auto"
          >
            <div className="flex flex-col px-6 py-10 space-y-3">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

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
                      className={`relative flex items-center justify-between px-5 py-4 rounded-2xl text-[15px] font-light tracking-wide transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'text-white border border-[#a83229]/30 bg-[#a83229]/5'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="relative z-10 flex items-center space-x-4">
                        <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className={`transition-colors duration-300 ${isActive ? 'text-[#a83229]' : ''}`} />
                        <span>{item.name}</span>
                      </div>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="mobileActiveDot"
                          className="w-1.5 h-1.5 rounded-full bg-[#a83229] relative z-10 shadow-[0_0_8px_rgba(168,50,41,0.8)]" 
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
              className="mt-8 pb-12 flex justify-center"
            >
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#a83229]/40 to-transparent"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Topbar;
