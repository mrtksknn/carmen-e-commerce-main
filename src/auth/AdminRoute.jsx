import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    // SessionStorage'dan kontrol et
    const authStatus = sessionStorage.getItem("adminAuth") === "true";
    setIsAuthorized(authStatus);
  }, []);

  // Yükleniyor durumu (isteğe bağlı)
  if (isAuthorized === null) return null;

  // Eğer yetkili değilse, Admin sayfasının kendi içindeki login ekranını göstermesi için 
  // children'ı (Admin bileşenini) render etmeye devam edebiliriz ya da 
  // Admin bileşeni zaten kendi içinde bu kontrolü yaptığı için AdminRoute'u basitleştirebiliriz.
  // Ancak kullanıcı "yönlendirileyim" dediği için burada children render edilmeli, 
  // Admin bileşeni içindeki state ile login işlemi yapılacak.
  return children;
};

export default AdminRoute;
