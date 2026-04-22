import { useState, useEffect } from "react";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const isAuth = sessionStorage.getItem("adminAuth") === "true";
    setIsAuthenticated(isAuth);
    setIsAuthChecking(false);
  }, []);

  const login = async (password) => {
    setLoginError("");
    setIsLoggingIn(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
          setIsAuthenticated(true);
          sessionStorage.setItem("adminAuth", "true");
          resolve(true);
        } else {
          setLoginError("Hatalı şifre.");
          resolve(false);
        }
        setIsLoggingIn(false);
      }, 500);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
  };

  return {
    isAuthenticated,
    isAuthChecking,
    isLoggingIn,
    loginError,
    login,
    logout
  };
};
