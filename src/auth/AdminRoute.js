import { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAllowed(true);
        setLoading(false);
      } else {
        const email = prompt("Giriş için e-posta adresinizi girin:");
        const password = prompt("Şifrenizi girin:");

        if (email && password) {
          signInWithEmailAndPassword(auth, email, password)
            .then(() => {
              setAllowed(true);
              setLoading(false);
            })
            .catch(() => {
              alert("Giriş başarısız. Ana sayfaya yönlendiriliyorsunuz.");
              setAllowed(false);
              setLoading(false);
            });
        } else {
          alert("Giriş bilgileri gerekli.");
          setAllowed(false);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // veya <div>Yükleniyor...</div>

  return allowed ? children : <Navigate to="/" />;
};

export default AdminRoute;
