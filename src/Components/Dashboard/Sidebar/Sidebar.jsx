import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Collapse,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext.jsx';
import { navItems } from '../../Api/NavLink';
import { ExpandLess, ExpandMore, Close } from '@mui/icons-material';
import { useSidebar } from '../../Context/SidebarContext.jsx';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';

const MotionListItem = motion.div;

const SideBar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth(); // ✅ جلب loading
  const { sidebarOpen: open, toggleSidebar } = useSidebar();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const drawerWidth = 240;

  const handleMouseEnter = (index) => setActiveItem(index);
  const handleMouseLeave = () => setActiveItem(null);
  const toggleExpand = (label) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  const filteredItems = navItems
    .filter((item) => item.allowedRoles?.includes(user?.user_type))
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          child.allowedRoles?.includes(user?.user_type)
        );
        return { ...item, children: filteredChildren };
      }
      return item;
    })
    .filter((item) => !item.children || item.children.length > 0);

  // ✅ انتظار تحميل user قبل العرض
  

  return (
    <>
      {open && isSmallScreen && (
        <Box
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.4)',
            zIndex: 998,
            top: 0,
            right: 0,
          }}
        />
      )}

      <Drawer
        anchor={isRTL ? 'right' : 'left'}
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        open={open}
        onClose={toggleSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: open ? drawerWidth : 70,
          flexShrink: 0,
          zIndex: 999,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 70,
            boxSizing: 'border-box',
            backgroundColor: '#781414',
            color: 'white',
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        {isSmallScreen && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        )}

        <Box sx={{ p: 2 }}>
          {open && (
            <>
              <SchoolRoundedIcon sx={{ margin: '4px 40px', fontSize: 120 }} />
              <Typography variant="h6" fontWeight="bold" align="center">
                {t('AL HADARA INISTITUT')}
              </Typography>
            </>
          )}
        </Box>

        <List>
          {filteredItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const hasActiveChild =
              item.children?.some((child) => location.pathname === child.path);
            const isExpanded = expandedItem === item.label;

            return (
              <div key={item.label}>
                <MotionListItem
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgb(135 35 35)' }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() =>
                    item.children
                      ? toggleExpand(item.label)
                      : (navigate(item.path), isSmallScreen && toggleSidebar())
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor:
                      isActive || hasActiveChild || activeItem === index
                        ? 'rgb(135 35 35)'
                        : 'transparent',
                    padding: open ? '12px 16px' : '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    margin: '4px 8px',
                    justifyContent: open ? 'flex-start' : 'center',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'white',
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <>
                      <ListItemText primary={t(item.label)} />
                      {item.children &&
                        (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                    </>
                  )}
                </MotionListItem>

                {item.children && (
                  <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 4 }}>
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <ListItem
                            button
                            key={child.label}
                            onClick={() => {
                              navigate(child.path);
                              if (isSmallScreen) toggleSidebar();
                            }}
                            sx={{
                              color: isChildActive ? '#fff' : '#ccc',
                              fontSize: '0.9rem',
                              py: 0.5,
                              pl: 3,
                              backgroundColor: isChildActive
                                ? 'rgb(135 35 35)'
                                : 'transparent',
                              '&:hover': {
                                color: '#fff',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: 'rgb(135 35 35)',
                              },
                            }}
                          >
                            {t(child.label)}
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </div>
            );
          })}
        </List>

        <Box
          sx={{
            mt: 'auto',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: open ? 'flex-start' : 'center',
          }}
        >
          <Avatar src="https://randomuser.me/api/portraits/men/75.jpg" />
          {open && (
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {user
                  ? `${user?.first_name || ''} ${user?.middle_name || ''} ${user?.last_name || ''}`
                  : 'لا يوجد مستخدم'}
              </Typography>
              <Typography variant="caption" color="#eee">
                {user?.user_type || ''}
              </Typography>
              <Typography variant="caption" sx={{ml:1}} color="#eee">
                {user?.phone || ''}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar;
