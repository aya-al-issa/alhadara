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
  Notifications,
  Refresh,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../Context/AuthContext';


const Header = ({ toggleSidebar, open }) => {
  const drawerWidth = open ? 240 : 70;
  const { logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={(theme) => ({
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        boxShadow: 'none',
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={toggleSidebar} sx={{ color: '#333' }}>
            <MenuIcon />
          </IconButton>


        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          <IconButton><Notifications /></IconButton>
          <Button onClick={logout}>LogOut</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
