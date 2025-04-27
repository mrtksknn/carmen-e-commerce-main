import React, { useState, useEffect } from 'react';
import '../../../assets/styles/topbar/topMenu.css';

const TopMenu = () => {
    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        // Sayfa yüklendiğinde ve activeLink değiştiğinde çalışacak kod bloğu
        const updateActiveLink = () => {
            const pathname = window.location.pathname;
            setActiveLink(pathname);
        };

        updateActiveLink(); // İlk render'da çalıştır
        window.addEventListener('popstate', updateActiveLink); // Tarayıcı geçmişi değiştiğinde çalıştır

        return () => {
            window.removeEventListener('popstate', updateActiveLink); // Clean-up fonksiyonu, listener'ı kaldır
        };
    }, []);

    const menuItems = [
        {
            text: "Home",
            link: "/"
        },
        {
            text: "Originals",
            link: "/products"
        },
        {
            text: "Products",
            link: "/urunler"
        },
        {
            text: "Collections",
            link: "/koleksiyonlar"
        },
        {
            text: "About Me",
            link: "/hakkimda"
        },
        {
            text: "Contact",
            link: "/contact"
        }
    ]

    return (
        <nav className='menu-container'>
            <ul className='topbar-menu'>
                {menuItems.map((item) => (
                    <li key={item.link}>
                        <a href={item.link} className={activeLink === item.link ? 'active' : ''}>
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TopMenu;
