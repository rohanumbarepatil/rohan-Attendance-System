import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Box, Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import { logout } from '../../features/auth/authSlice';
import NotificationBell from '../../features/notifications/NotificationBell';

export default function Navbar({ drawerWidth, onMenuClick }) {
  const { profile } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  return (
    <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` } }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { md: 'none' } }} aria-label="open menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Attendance Management
        </Typography>
        <NotificationBell />
        <Tooltip title={profile?.displayName || ''}>
          <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ ml: 1 }} aria-label="account menu">
            <Avatar src={profile?.photoURL || undefined} sx={{ width: 34, height: 34, bgcolor: 'secondary.main' }}>
              {(profile?.displayName || '?')[0]}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{profile?.displayName}</Typography>
            <Typography variant="caption" color="text.secondary">{profile?.role}</Typography>
          </Box>
          <MenuItem onClick={() => { setAnchor(null); navigate('/profile'); }}>
            <PersonIcon fontSize="small" sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => dispatch(logout())}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
