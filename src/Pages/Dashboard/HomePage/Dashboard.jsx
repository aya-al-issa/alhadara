import SideBar from "../../../Components/Dashboard/Sidebar/Sidebar";
import Header from "../../../Components/Dashboard/Header/Header";
import { Box } from '@mui/material';
import HomePage from "../../../Components/Dashboard/HomePaage/HomePage";
import { useState } from "react";
import { Outlet } from "react-router-dom";
const Dashboard = () => {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: "#f3f4f6",
      minHeight: "100vh",}}>
      <SideBar open={open} />
      <Box sx={{ flexGrow: 1 }}>
        <Header toggleSidebar={toggleSidebar} open={open} />
        <Box sx={{ mt: 8 }}>
          {/* <HomePage /> */}
          <Outlet/>
        </Box>
        
      </Box>
    </Box>
  );
};
export default Dashboard;

