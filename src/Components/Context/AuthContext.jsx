import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../Api/Api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 إضافة حالة تحميل

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await api.get('/auth/users/me/');
          setUser(response.data);
        } catch (error) {
          console.error("فشل تحميل معلومات المستخدم:", error);
          setUser(null);
        }
      }
      setLoading(false); // 👈 التحقق انتهى
    };

    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    Cookies.remove('token');
    Cookies.remove('user_type');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
