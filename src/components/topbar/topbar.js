import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, FolderOpen, Info, Contact } from 'lucide-react';
import '../../assets/styles/topbar/topbar.css';

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
    <nav className="topbar-container">
      <div className="topbar">
        <div className="menu-container px-4 md:px-0 flex items-center justify-between">
          <Link to="/" className="logo" onClick={handleLinkClick}>
            PieceOfOblivion
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`menu-item flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'active-link' : 'inActive-link'
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
              className="text-white hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                // Kapatma ikonu (X)
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger ikonu
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-90 absolute top-full left-0 w-full z-50">
            <div className="flex flex-col px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-md text-white font-medium hover:bg-red-600 transition-colors ${
                      location.pathname === item.path ? 'bg-red-700' : ''
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
      </div>
    </nav>
  );
};

export default Topbar;
