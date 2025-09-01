import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
  MenuItem,
  Select,
  Button
} from '@mui/material';
import {
  Search,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../Context/AuthContext';
import { useSidebar } from '../../Context/SidebarContext'; // تأكدي من المسار
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../../store/languageSlice'; // ع
import NotificationButton from '../../Notification/NotificationButton'; // عدّل المسار صح

const Header = () => {
  const { toggleSidebar, sidebarOpen: open } = useSidebar();
  const drawerWidth = open ? 240 : 70;
  const { logout } = useAuth();

  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language); // جلب اللغة من Redux
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  // هذا الـ effect رح يتابع تغير اللغة في Redux ويحدث i18n
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const toggleLanguage = () => {
    // إذا اللغة حالياً 'en' غيّرها لـ 'ar' والعكس
    dispatch(setLanguage(language === 'en' ? 'ar' : 'en'));
  };

  return (
    <AppBar
      anchor={isRTL ? 'right' : 'left'}
      position="fixed"
      color="default"
      elevation={1}
      sx={(theme) => ({
        width: `calc(100% - ${drawerWidth}px)`,
        ...(isRTL ? { mr: `${drawerWidth}px` } : { ml: `${drawerWidth}px` }),
        boxShadow: 'none',
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={toggleSidebar} sx={{ color: '#333' }}>
            <MenuIcon />
          </IconButton>


        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              backgroundColor: '#f1f1f1',
              px: 2,
              py: 0.5,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Search fontSize="small" />
            <InputBase placeholder="Search" />
          </Box>
          <Button onClick={toggleLanguage} sx={{ backgroundColor: "#781414", color: "#fff" }}>
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
          <Box sx={{ mr: 1 }}>
            <NotificationButton />
          </Box>
          <Button onClick={logout} sx={{ backgroundColor: "#781414", color: "#fff" }}>LogOut</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
