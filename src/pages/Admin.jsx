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
    login,
    logout
  } = useAdminAuth();

  const { products } = useProducts();
  const { collections } = useCollections();

  if (isAuthChecking) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-background" role="status">
        <span className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={(email, password) => login(email, password)}
        loginError={loginError}
        isLoggingIn={isLoggingIn}
      />
    );
  }

  return (
    <AdminDashboard
      products={products}
      collections={collections}
      onLogout={logout}
    />
  );
};

export default Admin;
