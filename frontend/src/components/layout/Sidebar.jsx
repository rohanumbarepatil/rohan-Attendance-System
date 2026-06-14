import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import WarningIcon from '@mui/icons-material/Warning';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { ROLES } from '../../constants';

const MENUS = {
  [ROLES.ADMIN]: [
    { to: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/admin/departments', label: 'Departments', icon: <AccountTreeIcon /> },
    { to: '/admin/courses', label: 'Courses', icon: <ClassIcon /> },
    { to: '/admin/programs', label: 'Programs', icon: <SchoolIcon /> },
    { to: '/admin/academicYears', label: 'Academic Years', icon: <CalendarMonthIcon /> },
    { to: '/admin/semesters', label: 'Semesters', icon: <CalendarMonthIcon /> },
    { to: '/admin/subjects', label: 'Subjects', icon: <MenuBookIcon /> },
    { to: '/admin/faculty', label: 'Faculty', icon: <BadgeIcon /> },
    { to: '/admin/students', label: 'Students', icon: <GroupsIcon /> },
    { to: '/admin/users', label: 'Users', icon: <PersonIcon /> },
    { to: '/admin/roles', label: 'Roles', icon: <AdminPanelSettingsIcon /> },
    { to: '/admin/assignments', label: 'Assignments', icon: <FactCheckIcon /> },
    { to: '/admin/attendance', label: 'Attendance Monitor', icon: <FactCheckIcon /> },
    { to: '/admin/reports', label: 'Reports', icon: <AssessmentIcon /> },
    { to: '/admin/analytics', label: 'Analytics', icon: <InsightsIcon /> },
    { to: '/admin/settings', label: 'Settings', icon: <SettingsIcon /> },
  ],
  [ROLES.FACULTY]: [
    { to: '/faculty', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/faculty/mark-attendance', label: 'Mark Attendance', icon: <FactCheckIcon /> },
    { to: '/faculty/history', label: 'History', icon: <HistoryIcon /> },
    { to: '/faculty/defaulters', label: 'Defaulters', icon: <WarningIcon /> },
    { to: '/faculty/students', label: 'Students', icon: <SearchIcon /> },
    { to: '/faculty/reports', label: 'Reports', icon: <AssessmentIcon /> },
    { to: '/notifications', label: 'Notifications', icon: <NotificationsIcon /> },
  ],
  [ROLES.STUDENT]: [
    { to: '/student', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/student/attendance', label: 'My Attendance', icon: <FactCheckIcon /> },
    { to: '/student/reports', label: 'Reports', icon: <AssessmentIcon /> },
    { to: '/notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { to: '/profile', label: 'Profile', icon: <PersonIcon /> },
  ],
};

export default function Sidebar({ drawerWidth, mobileOpen, onClose }) {
  const { profile } = useSelector((s) => s.auth);
  const location = useLocation();
  const items = MENUS[profile?.role] || [];

  const content = (
    <Box>
      <Toolbar>
        <Typography variant="h6" color="primary" fontWeight={700}>CAMS</Typography>
      </Toolbar>
      <Divider />
      <List dense>
        {items.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={onClose}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer variant="temporary" open={mobileOpen} onClose={onClose} ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        {content}
      </Drawer>
      <Drawer variant="permanent" open
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        {content}
      </Drawer>
    </Box>
  );
}
