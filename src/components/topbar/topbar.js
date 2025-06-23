import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, FolderOpen, Info, Contact } from 'lucide-react';
import '../../assets/styles/topbar/topbar.css';

const Topbar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Collections', path: '/collections', icon: FolderOpen },
        { name: 'All Products', path: '/products', icon: Image },
        { name: 'About Me', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: Contact },
    ];

    return (
        <nav className="topbar-container">
            <div className="topbar">
                <div className="menu-container">
                    <Link to="/" className='logo'>
                        PieceOfOblivion
                    </Link>

                    <div className="menu">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`menu-item flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                                        ? 'active-link'
                                        : 'inActive-link'
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile menu button }
                    <div className="md:hidden">
                        <button className="text-muted-foreground hover:text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    */}
                </div>
            </div>
        </nav>
    );
};

export default Topbar;
