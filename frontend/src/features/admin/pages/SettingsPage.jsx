import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Card, CardContent, TextField, Button, Stack, Divider, MenuItem,
} from '@mui/material';
import { firestoreService } from '../../../services/firestoreService';
import { logAudit } from '../../../services/auditService';
import { notificationService } from '../../notifications/notificationService';
import { COLLECTIONS, NOTIFICATION_TYPES, ROLES } from '../../../constants';

const SETTINGS_DOC = 'system';

export default function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState({
    institutionName: '',
    defaulterThreshold: 75,
    criticalThreshold: 60,
    lecturesPerDay: 6,
    academicYear: '',
  });
  const [announcement, setAnnouncement] = useState({ title: '', message: '', audience: 'ALL' });

  useEffect(() => {
    firestoreService.get(COLLECTIONS.SETTINGS, SETTINGS_DOC).then((data) => {
      if (data) setSettings((s) => ({ ...s, ...data }));
    });
  }, []);

  const saveSettings = async () => {
    await firestoreService.set(COLLECTIONS.SETTINGS, SETTINGS_DOC, {
      ...settings,
      defaulterThreshold: Number(settings.defaulterThreshold),
      criticalThreshold: Number(settings.criticalThreshold),
      lecturesPerDay: Number(settings.lecturesPerDay),
    });
    await logAudit({ action: 'SETTINGS_UPDATED', entity: COLLECTIONS.SETTINGS, entityId: SETTINGS_DOC, after: settings });
    enqueueSnackbar('Settings saved', { variant: 'success' });
  };

  const sendAnnouncement = async () => {
    if (!announcement.title || !announcement.message) {
      enqueueSnackbar('Title and message are required', { variant: 'warning' });
      return;
    }
    await notificationService.send({
      audience: announcement.audience,
      type: NOTIFICATION_TYPES.ANNOUNCEMENT,
      title: announcement.title,
      message: announcement.message,
    });
    setAnnouncement({ title: '', message: '', audience: 'ALL' });
    enqueueSnackbar('Announcement sent', { variant: 'success' });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>System Settings</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Configuration</Typography>
          <Stack spacing={2} sx={{ maxWidth: 480 }}>
            <TextField label="Institution Name" value={settings.institutionName}
              onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })} />
            <TextField label="Defaulter Threshold (%)" type="number" value={settings.defaulterThreshold}
              onChange={(e) => setSettings({ ...settings, defaulterThreshold: e.target.value })} />
            <TextField label="Critical Threshold (%)" type="number" value={settings.criticalThreshold}
              onChange={(e) => setSettings({ ...settings, criticalThreshold: e.target.value })} />
            <TextField label="Lectures Per Day" type="number" value={settings.lecturesPerDay}
              onChange={(e) => setSettings({ ...settings, lecturesPerDay: e.target.value })} />
            <TextField label="Current Academic Year" value={settings.academicYear}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })} />
            <Button variant="contained" onClick={saveSettings}>Save Settings</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Send System Announcement</Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2} sx={{ maxWidth: 480 }}>
            <TextField label="Title" value={announcement.title}
              onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })} />
            <TextField label="Message" multiline rows={3} value={announcement.message}
              onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })} />
            <TextField select label="Audience" value={announcement.audience}
              onChange={(e) => setAnnouncement({ ...announcement, audience: e.target.value })}>
              <MenuItem value="ALL">Everyone</MenuItem>
              {Object.values(ROLES).map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
            <Button variant="contained" color="secondary" onClick={sendAnnouncement}>Send Announcement</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
