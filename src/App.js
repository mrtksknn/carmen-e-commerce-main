import './App.css';
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import AdminRoute from './auth/AdminRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CustomToaster />
        <BrowserRouter>
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
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
