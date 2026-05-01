import React from "react";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useProducts } from "../hooks/useProducts";
import { useCollections } from "../hooks/useCollections";

import "../assets/styles/upload.css";

const Admin = () => {
  const { 
    isAuthenticated, 
    isAuthChecking, 
    isLoggingIn, 
    loginError, 
    login 
  } = useAdminAuth();

  const { products } = useProducts();
  const { collections } = useCollections();

  // Loading state
  if (isAuthChecking) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-background-dark">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pre-login state
  if (!isAuthenticated) {
    return (
      <AdminLogin 
        onLogin={login} 
        loginError={loginError} 
        isLoggingIn={isLoggingIn} 
      />
    );
  }

  // Dashboard state
  return (
    <AdminDashboard 
      products={products} 
      collections={collections} 
    />
  );
};

export default Admin;
