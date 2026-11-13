import { useState, useEffect } from "react";
import { loginAdmin, logoutAdmin, subscribeToAuth } from "../services/firebaseService";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoginError("");
    setIsLoggingIn(true);

    try {
      await loginAdmin(email, password);
      setIsLoggingIn(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      let message = "loginFailed";
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = "wrongCredentials";
      } else if (error.code === 'auth/too-many-requests') {
        message = "tooManyAttempts";
      }
      
      setLoginError(message);
      setIsLoggingIn(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    isAuthenticated,
    isAuthChecking,
    isLoggingIn,
    loginError,
    user,
    login,
    logout
  };
};
