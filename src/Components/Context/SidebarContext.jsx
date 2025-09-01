import { createContext, useContext, useState, useEffect } from "react";

// 1. إنشاء الكونتكست
const SidebarContext = createContext();

// 2. مزود الكونتكست
export const SidebarProvider = ({ children }) => {
  // ✅ الحالة الابتدائية تعتمد على حجم الشاشة
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // ✅ التبديل بين الفتح والإغلاق
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // ✅ التعامل مع تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// 3. دالة استخدام الكونتكست
export const useSidebar = () => useContext(SidebarContext);
