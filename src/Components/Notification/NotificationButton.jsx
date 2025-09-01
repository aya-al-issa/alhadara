import React, { useEffect, useState } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  Avatar,
  Stack,
  Fade,
  Collapse,
  Slide,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  toggleMenu,
  markAsReadApi,
  markAllAsReadApi,
} from '../../store/notificationsSlice';

import { useAuth } from '../Context/AuthContext';

const NotificationButton = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const isOpen = useSelector((state) => state.notifications.isOpen);
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  // للتحكم بعدد الإشعارات المعروضة
  const [visibleCount, setVisibleCount] = useState(6);
  // للإشعارات التي يتم إخفاؤها بأنيميشن
  const [hiddenIds, setHiddenIds] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      dispatch(fetchNotifications(user.id));
    }, 15000);

    return () => clearInterval(interval);
  }, [dispatch, user?.id]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(toggleMenu());
    if (user && user.id) {
      dispatch(fetchNotifications(user.id));
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    dispatch(toggleMenu());
  };

  const handleClearAll = () => {
    dispatch(markAllAsReadApi());
  };

  const handleMarkOne = (id) => {
    setHiddenIds((prev) => [...prev, id]);
    setTimeout(() => {
      dispatch(markAsReadApi(id));
      setHiddenIds((prev) => prev.filter((hid) => hid !== id));
    }, 300);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 450,
            maxHeight: 500,
            borderRadius: 3,
            boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
            p: 1,
            bgcolor: 'background.paper',
          },
        }}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* رأس القائمة */}
        <Box px={2} py={1} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold">
            الإشعارات
          </Typography>
          {notifications.length > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={handleClearAll}
              sx={{ textTransform: 'none', fontWeight: 'bold', color: 'primary.main' }}
            >
              تعليم الكل كمقروء
            </Button>
          )}
        </Box>
        <Divider />

        {/* حالة عدم وجود إشعارات */}
        {notifications.length === 0 && (
          <MenuItem disabled sx={{ py: 3, justifyContent: 'center' }}>
            <Typography color="text.secondary">لا توجد إشعارات جديدة</Typography>
          </MenuItem>
        )}

        {/* عرض الإشعارات مع أنيميشن دخول + خروج */}
        {notifications.slice(0, visibleCount).map((n, index) => (
          <Slide
            key={n.id}
            direction="up"
            in={!hiddenIds.includes(n.id)}
            timeout={400 + index * 100} // stagger animation
            mountOnEnter
            unmountOnExit
          >
            <MenuItem
              sx={{
                borderRadius: 2,
                my: 0.5,
                alignItems: 'flex-start',
                bgcolor: !n.is_read ? 'rgba(25,118,210,0.08)' : 'transparent',
                '&:hover': { bgcolor: !n.is_read ? 'rgba(25,118,210,0.15)' : 'rgba(0,0,0,0.05)' },
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: n.is_read ? 'grey.400' : 'primary.main',
                    width: 36,
                    height: 36,
                    fontWeight: 'bold',
                  }}
                >
                  {n.title?.charAt(0) || 'N'}
                </Avatar>
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight={!n.is_read ? 'bold' : 'normal'}
                    noWrap
                  >
                    {n.title || 'إشعار'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      whiteSpace: 'normal',
                      maxHeight: 40,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {n.message}
                  </Typography>
                </Box>
              </Stack>

              {/* زر Mark One as Read */}
              {!n.is_read && (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleMarkOne(n.id)}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              )}
            </MenuItem>
          </Slide>
        ))}

        {/* زر عرض المزيد */}
        {notifications.length > visibleCount && (
          <Box>
            <Divider />
            <Box textAlign="center" py={1}>
              <Button
                size="small"
                endIcon={<ExpandMoreIcon />}
                onClick={handleShowMore}
                sx={{ textTransform: 'none', fontWeight: 'bold', color: 'primary.main' }}
              >
                عرض المزيد
              </Button>
            </Box>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationButton;
