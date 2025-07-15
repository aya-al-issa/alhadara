import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';
import SettingsIcon from '@mui/icons-material/Settings';

import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SensorDoorIcon from '@mui/icons-material/SensorDoor';
import WalletIcon from '@mui/icons-material/Wallet';
export const navItems = [
  {
    label: 'Home',
    icon: <HomeIcon />,
    path: '/dashboard/home',
    allowedRoles: ['admin', 'reception'],

  },
  {
    label: 'Course',
    icon: <SchoolRoundedIcon />,
    allowedRoles: ['admin', 'reception'],

    children: [
      {
        label: 'Courses',
        path: '/dashboard/courses',
        allowedRoles: ['admin', 'reception'],

      },

      {
        label: 'Course Type',
        path: '/dashboard/course-type',
        allowedRoles: ['admin', 'reception'],

      },

    ],

  },
  {
    label: 'Department',
    icon: <LibraryAddRoundedIcon />,
    path: '/dashboard/department',
    allowedRoles: ['admin', 'reception'],

  },
  {
    label: 'Hall',
    icon: <SensorDoorIcon />,
    path: '/dashboard/halls',
    allowedRoles: ['admin', 'reception'],

  },
  {
    label: 'Users Profile',
    icon: <AccountCircleIcon />,
    path: '/dashboard/profile',
    allowedRoles: ['admin'],

  },
  {
    label: 'E-Wallet',
    icon: <WalletIcon />,
    allowedRoles: ['admin', 'reception'],


    children: [
      {
        label: 'Users manager',
        path: '/dashboard/ewallet',
        allowedRoles: ['admin', 'reception'],

      },
      {
        label: 'Deposits',
        path: '/dashboard/deposit-request',
        allowedRoles: ['admin', 'reception'],

      },
      {
        label: 'Transactions',
        path: '/dashboard/transactions',
        allowedRoles: ['admin', 'reception'],

      },
    ],
  },

];
