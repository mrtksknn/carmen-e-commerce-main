import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, FolderOpen, Info, Contact, Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../ui/Logo';

const Topbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

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
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background-dark border-b border-primary/30 h-[65px] flex items-center justify-center">
      <div className="w-full max-w-7xl px-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center no-underline transition-transform duration-300 hover:scale-105"
          onClick={handleLinkClick}
          aria-label="Carmen Art Home"
        >
          <Logo className="text-gray-200 hover:text-white transition-colors duration-300" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-gray-300 hover:text-white hover:bg-primary/20'
                }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="ml-3 flex items-center gap-1 px-3 py-[6px] rounded-lg border border-primary/40 text-sm font-bold tracking-wider text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <span className={language === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
            <span className="text-white/30 font-light">/</span>
            <span className={language === 'tr' ? 'opacity-100' : 'opacity-40'}>TR</span>
          </button>
        </div>

        {/* Mobile Right Side: Lang Toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {/* Language Toggle - Mobile */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-primary/40 text-xs font-bold tracking-wider text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <span className={language === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
            <span className="text-white/30 font-light">/</span>
            <span className={language === 'tr' ? 'opacity-100' : 'opacity-40'}>TR</span>
          </button>

          {/* Hamburger */}
          <button
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="text-white hover:text-primary transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[65px] left-0 w-full bg-background-dark border-b border-primary/30 shadow-xl z-50 animate-fade-in">
          <div className="flex flex-col px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-primary/20 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Topbar;
