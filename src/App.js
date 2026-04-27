import './App.css';
import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Language
import { LanguageProvider } from "./context/LanguageContext";

// Toast System
import { ToastProvider } from "./components/ui/toast-context";
import CustomToaster from "./components/ui/CustomToaster";
import LoadingFallback from "./components/ui/LoadingFallback";

// Pages
import Layout from './pages/Layout';
import Landing from './pages/Landing'; // Loaded immediately for LCP

// Lazy Pages
const AboutMe = lazy(() => import('./pages/AboutMe'));
const Details = lazy(() => import('./pages/ProductDetails'));
const Admin = lazy(() => import('./pages/Admin'));
const AllProducts = lazy(() => import('./pages/AllProducts'));
const Collections = lazy(() => import('./pages/Collections'));
const ContactMe = lazy(() => import('./pages/ContactMe'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminRoute = lazy(() => import('./auth/AdminRoute'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ToastProvider>
          <CustomToaster />
          <HelmetProvider>
            <Router basename={process.env.PUBLIC_URL}>
              <Suspense fallback={<LoadingFallback />}>
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
              </Suspense>
            </Router>
          </HelmetProvider>
        </ToastProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
