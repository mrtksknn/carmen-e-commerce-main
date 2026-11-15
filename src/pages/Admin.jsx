import React from "react";
import AdminLogin from "../components/admin/AdminLogin";
import SEO from "../components/SEO";
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

  // The panel never appears in search results
  const seo = <SEO title="Atölye paneli" noindex />;

  if (isAuthChecking) {
    return (
      <>{seo}<div className="flex min-h-[100svh] items-center justify-center bg-background" role="status">
        <span className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div></>
    );
  }

  if (!isAuthenticated) {
    return (
      <>{seo}<AdminLogin
        onLogin={(email, password) => login(email, password)}
        loginError={loginError}
        isLoggingIn={isLoggingIn}
      /></>
    );
  }

  return (
    <>{seo}<AdminDashboard
      products={products}
      collections={collections}
      onLogout={logout}
    /></>
  );
};

export default Admin;
