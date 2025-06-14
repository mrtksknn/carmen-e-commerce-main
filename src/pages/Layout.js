// React
import { Outlet } from "react-router-dom";
import React from 'react';
// Components
import Topbar from '../components/topbar/topbar';
// Css
import '../assets/styles/layout.css';

const Layout = () => {

  return (
    <div className="min-h-screen bg-background">
      <Topbar />

      <main>
        <Outlet />
      </main>

    </div>
  )
};

export default Layout;