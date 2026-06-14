import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { notificationService } from './notificationService';
import { notificationsUpdated } from './notificationSlice';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile } = useSelector((s) => s.auth);
  const { items, unread } = useSelector((s) => s.notifications);
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    if (!user) return undefined;
    const unsubscribe = notificationService.listen(user.uid, profile?.role, (list) =>
      dispatch(notificationsUpdated(list))
    );
    return unsubscribe;
  }, [user, profile, dispatch]);

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchor(e.currentTarget)} aria-label="notifications">
        <Badge badgeContent={unread} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {items.slice(0, 5).map((n) => (
          <MenuItem
            key={n.id}
            onClick={() => { notificationService.markRead(n.id); setAnchor(null); }}
            sx={{ whiteSpace: 'normal', maxWidth: 360, opacity: n.read ? 0.6 : 1 }}
          >
            <Box>
              <Typography variant="subtitle2">{n.title}</Typography>
              <Typography variant="body2" color="text.secondary">{n.message}</Typography>
            </Box>
          </MenuItem>
        ))}
        {items.length === 0 && <MenuItem disabled>No notifications</MenuItem>}
        <Box sx={{ textAlign: 'center', p: 1 }}>
          <Button size="small" onClick={() => { setAnchor(null); navigate('/notifications'); }}>View all</Button>
        </Box>
      </Menu>
    </>
  );
}
