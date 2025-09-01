// navItems.js (مع ترجمة العناوين)
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
    label: 'sidebar.home',
    icon: <HomeIcon />,
    path: '/dashboard/home',
    allowedRoles: ['admin', 'reception'],
  },
  {
    label: 'sidebar.course',
    icon: <SchoolRoundedIcon />,
    allowedRoles: ['admin', 'reception'],
    children: [
      {
        label: 'sidebar.courses',
        path: '/dashboard/courses',
        allowedRoles: ['admin', 'reception'],
      },
      {
        label: 'sidebar.courseType',
        path: '/dashboard/course-type',
        allowedRoles: ['admin', 'reception'],
      },
       {
        label: 'sidebar.schedualslots',
        path: '/dashboard/courses/schedual',
        allowedRoles: ['admin', 'reception'],
      },
       {
        label: 'sidebar.Lessons',
        path: '/dashboard/privite-lesson',
        allowedRoles: ['admin', 'reception'],
      },
    ],
  },
  {
    label: 'sidebar.department',
    icon: <LibraryAddRoundedIcon />,
    path: '/dashboard/department',
    allowedRoles: ['admin', 'reception'],
  },
  {
    label: 'sidebar.hall',
    icon: <SensorDoorIcon />,
    path: '/dashboard/halls',
    allowedRoles: ['admin', 'reception'],
  },
  {
    label: 'sidebar.profile',
    icon: <AccountCircleIcon />,
    path: '/dashboard/profile',
    allowedRoles: ['admin'],
  },
  {
    label: 'sidebar.ewallet',
    icon: <WalletIcon />,
    allowedRoles: ['admin', 'reception'],
    children: [
      {
        label: 'sidebar.usersManager',
        path: '/dashboard/ewallet',
        allowedRoles: ['admin', 'reception'],
      },
      {
        label: 'sidebar.deposits',
        path: '/dashboard/deposit-request',
        allowedRoles: ['admin', 'reception'],
      },
      {
        label: 'sidebar.transactions',
        path: '/dashboard/transactions',
        allowedRoles: ['admin', 'reception'],
      },
    ],
  },
  {
    label: 'sidebar.Complaint',
    icon: <AccountCircleIcon />,
    path: '/dashboard/complaint',
    allowedRoles: ['admin'],
  },  {
    label: 'sidebar.EntranceExam',
    icon: <AccountCircleIcon />,
    path: '/dashboard/EntranceExam',
    allowedRoles: ['admin'],
  }
];
