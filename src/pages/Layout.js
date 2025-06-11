// React
import { Outlet } from "react-router-dom";
import React from 'react';
// Components
import Topbar from '../components/topbar/topbar';
import Footer from '../components/footer/footer';
// Css
import '../assets/styles/layout.css';

const Layout = () => {

  return (
    <div className="min-h-screen bg-background">
      <Topbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
};

export default Layout;