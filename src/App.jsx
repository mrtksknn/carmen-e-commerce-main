import './App.css';
import { MotionConfig } from "framer-motion";
import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Language
import { LanguageProvider } from "./context/LanguageContext";
import { InquiryProvider } from "./context/InquiryContext";

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
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminRoute = lazy(() => import('./auth/AdminRoute'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false, // Prevent redundant fetches on tab switch
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

// The storefront exists twice: Turkish at the root and English under /en/.
// Only the artwork segment differs (/eser/… and /en/artwork/…).
const storefrontRoutes = (artworkSegment) => (
  <>
    <Route index element={<Landing />} />
    <Route path="products" element={<AllProducts />} />
    <Route path="collections" element={<Collections />} />
    <Route path="collections/:room" element={<Collections />} />
    <Route path="about" element={<AboutMe />} />
    <Route path="contact" element={<ContactMe />} />
    <Route path={`${artworkSegment}/:slug`} element={<Details />} />
    {/* Old addresses (/product/<firestore id>) forward to the readable one */}
    <Route path="product/:slug" element={<Details />} />
    <Route path="verify/:certId" element={<VerifyCertificate />} />
  </>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={import.meta.env.BASE_URL}>
        <LanguageProvider>
          <InquiryProvider>
            <ToastProvider>
              <CustomToaster />
              <HelmetProvider>
                <MotionConfig reducedMotion="user">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Layout />}>{storefrontRoutes('eser')}</Route>
                      <Route path="/en" element={<Layout />}>{storefrontRoutes('artwork')}</Route>
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
                </MotionConfig>
              </HelmetProvider>
            </ToastProvider>
          </InquiryProvider>
        </LanguageProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
