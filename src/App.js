import './App.css';
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Language
import { LanguageProvider } from "./context/LanguageContext";

// Toast System
import { ToastProvider } from "./components/ui/toast-context";
import CustomToaster from "./components/ui/CustomToaster";

// Pages
import Layout from './pages/Layout';
import Landing from './pages/Landing';
import AboutMe from './pages/AboutMe';
import Details from './pages/ProductDetails';
import Admin from './pages/Admin';
import AllProducts from './pages/AllProducts';
import Collections from './pages/Collections';
import ContactMe from './pages/ContactMe';
import NotFound from './pages/NotFound';
import AdminRoute from './auth/AdminRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ToastProvider>
          <CustomToaster />
          <HelmetProvider>
            <Router basename={process.env.PUBLIC_URL}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Landing />} />
                  <Route path="products" element={<AllProducts />} />
                  <Route path="collections" element={<Collections />} />
                  <Route path="about" element={<AboutMe />} />
                  <Route path="contact" element={<ContactMe />} />
                  <Route path="product/:id" element={<Details />} />
                </Route>
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
                
                {/* 404 Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </HelmetProvider>
        </ToastProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
