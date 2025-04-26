// React
import { Outlet } from "react-router-dom";
import React from 'react';
// Components
import Topbar from '../components/topbar/topbar';
import Footer from '../components/footer/footer';
import TopMenu from '../components/topbar/topMenu/topMenu';
// Css
import '../assets/styles/layout.css';

const Layout = () => {

  return (
    <div style={{height: '100%'}}>
      <div className="layout-container">
        <Topbar />
        <TopMenu />

        <main>
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
    
  )
};

export default Layout;