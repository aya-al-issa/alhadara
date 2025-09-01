// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../Api/Api";
import { useUserType } from "./UserTypeContext";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userType, setUserType } = useUserType();

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/users/me/");
      let userData = response.data;

      // إذا الـ API ما رجع user_type → نستخدم اللي موجود بالكونتكست (كوكيز)
      if (!userData.user_type && userType) {
        userData = { ...userData, user_type: userType };
      }

      // إذا رجع user_type من API → نخزنه بالكونتكست (كوكيز كمان)
      if (userData.user_type) {
        setUserType(userData.user_type);
      }

      setUser(userData);
    } catch (error) {
      // fallback → نستخدم اللي مخزن بالكوكيز
      if (userType) {
        setUser({ user_type: userType });
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };
   // 🔥 وظيفة تسجيل الخروج
  const logout = () => {
    setUser(null);
    setUserType(null); // تنظيف الكونتكست
    Cookies.remove("token");
    Cookies.remove("refresh");
    Cookies.remove("user_type");
    window.location.href = "/login"; // تحويل لصفحة تسجيل الدخول
  };


  useEffect(() => {
    fetchUser();
    // ما نضيف setUserType هون لأنه راح يسبب loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading,logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

