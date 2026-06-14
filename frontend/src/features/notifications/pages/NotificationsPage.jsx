import { useSelector } from 'react-redux';
import { Typography, List, ListItem, ListItemText, Paper, Chip, Box, IconButton, Tooltip } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { notificationService } from '../notificationService';
import { NOTIFICATION_TYPES } from '../../../constants';

const TYPE_COLORS = {
  [NOTIFICATION_TYPES.LOW_ATTENDANCE]: 'warning',
  [NOTIFICATION_TYPES.DEFAULTER_ALERT]: 'error',
  [NOTIFICATION_TYPES.ATTENDANCE_MARKED]: 'info',
  [NOTIFICATION_TYPES.ANNOUNCEMENT]: 'primary',
  [NOTIFICATION_TYPES.SYSTEM]: 'default',
};

export default function NotificationsPage() {
  const { items } = useSelector((s) => s.notifications);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Notifications</Typography>
      <Paper>
        <List>
          {items.map((n) => (
            <ListItem
              key={n.id}
              divider
              secondaryAction={!n.read && (
                <Tooltip title="Mark as read">
                  <IconButton onClick={() => notificationService.markRead(n.id)} aria-label="mark read">
                    <DoneAllIcon />
                  </IconButton>
                </Tooltip>
              )}
              sx={{ opacity: n.read ? 0.65 : 1 }}
            >
              <ListItemText
                primary={<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {n.title}
                  <Chip size="small" label={n.type} color={TYPE_COLORS[n.type] || 'default'} />
                </Box>}
                secondary={n.message}
              />
            </ListItem>
          ))}
          {items.length === 0 && (
            <ListItem><ListItemText primary="No notifications yet" /></ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}
