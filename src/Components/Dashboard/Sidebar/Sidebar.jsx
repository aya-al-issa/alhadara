import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Collapse
} from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext.jsx';
import { navItems } from '../../Api/NavLink';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const MotionListItem = motion.div;

const SideBar = ({ open }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  console.log(user);

  const handleMouseEnter = (index) => setActiveItem(index);
  const handleMouseLeave = () => setActiveItem(null);
  const toggleExpand = (label) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  // 🔒 Filter nav items based on user role
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
console.log(user?.first_name);
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 70,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 70,
          boxSizing: 'border-box',
          backgroundColor: '#781414',
          color: 'white',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {open && (
          <Typography variant="h6" fontWeight="bold">
            AL HADARA INISTITUT
          </Typography>
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
                    : navigate(item.path)
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
                    <ListItemText primary={item.label} />
                    {item.children &&
                      (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                  </>
                )}
              </MotionListItem>

              {/* Sub-items (children) */}
              {item.children && (
                <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 4 }}>
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <ListItem
                          button
                          key={child.label}
                          onClick={() => navigate(child.path)}
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
                             
                              backgroundColor: 'rgb(135 35 35)',
                            },
                          }}
                        >
                          {child.label}
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
                ? `${user?.first_name} ${user?.middle_name} ${user?.last_name}`
                : 'N'}
            </Typography>
            <Typography variant="caption" color="#eee">
              {user?.user_type} 
            </Typography>
            
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default SideBar;
