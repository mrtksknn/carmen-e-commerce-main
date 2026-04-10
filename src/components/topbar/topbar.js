import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, FolderOpen, Info, Contact, Menu, X } from 'lucide-react';

const Topbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Collections', path: '/collections', icon: FolderOpen },
    { name: 'All Products', path: '/products', icon: Image },
    { name: 'About Me', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Contact },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false); // Menüden link seçince menüyü kapat
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background-dark border-b border-primary/30 h-[65px] flex items-center justify-center">
      <div className="w-full max-w-7xl px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-white text-3xl text-primary font-bold no-underline font-serif tracking-wider" 
          onClick={handleLinkClick}
        >
          PieceOfOblivion
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-2">
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
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="text-white hover:text-primary transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
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

