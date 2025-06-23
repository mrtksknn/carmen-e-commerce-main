import { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const authenticate = async () => {
      const email = prompt("Giriş için e-posta adresinizi girin:");
      const password = prompt("Şifrenizi girin:");

      if (!email || !password) {
        alert("E-posta ve şifre gerekli.");
        return setIsAuthorized(false);
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        setIsAuthorized(true);
      } catch {
        alert("Giriş başarısız. Ana sayfaya yönlendiriliyorsunuz.");
        setIsAuthorized(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthorized(true);
      } else {
        authenticate();
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthorized === null) return null; // Optionally show a loader

  return isAuthorized ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
