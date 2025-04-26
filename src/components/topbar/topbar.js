import React from 'react';
import '../../assets/styles/topbar/topbar.css';

const Topbar = () => {
    return (
        <header className="topbar-container">
            <div className="topbar-content">
                <span className="material-icons">menu</span>

                <a href="/"><div className="logo">CARMEN</div></a>

                <div className="button-container">
                    <span className="material-icons-outlined">account_circle</span>
                    <span className="material-icons-outlined">shopping_cart</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
