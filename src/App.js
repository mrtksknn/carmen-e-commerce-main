import './App.css';
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Pages
import Layout from './pages/Layout';
import Landing from './pages/Landing';
import Originals from './pages/Originals';
import Prints from './pages/Prints';
import AboutMe from './pages/AboutMe';
import Details from './pages/ProductDetails';
import Upload from './pages/Upload';
import AllProducts from './pages/AllProducts';
import Collections from './pages/Collections';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="tum-urunler" element={<AllProducts />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="baski" element={<Prints />} />
            <Route path="collections" element={<Collections />} />
            <Route path="about" element={<AboutMe />} />
            <Route path="/details/:productName" element={<Details />} />
          </Route>
          <Route path="upload" element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
