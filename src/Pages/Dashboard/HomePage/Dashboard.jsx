import SideBar from "../../../Components/Dashboard/Sidebar/Sidebar";
import Header from "../../../Components/Dashboard/Header/Header";
import { Box } from '@mui/material';
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../Components/Context/AuthContext";
import Loading from "../../../Components/Loader/Loading"; // مكون التحميل

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const { user, loading } = useAuth(); // ✅ استخدام loading من الكونتكست

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  // ⚡ إذا لسا البيانات عم تحمل → عرض صفحة تحميل كاملة
  if (loading) {
    return <Loading fullscreen text="جارٍ تحميل البيانات..." />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <SideBar open={open} />
      <Box sx={{ flexGrow: 1 }}>
        <Header toggleSidebar={toggleSidebar} open={open} />
        <Box sx={{ mt: 8 }}>
          <Outlet/>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
