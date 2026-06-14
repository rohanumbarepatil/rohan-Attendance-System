import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Card, CardContent, TextField, Button, Stack, Avatar, Chip,
} from '@mui/material';
import { firestoreService } from '../../../services/firestoreService';
import { sessionRestored } from '../../auth/authSlice';
import { authService } from '../../auth/authService';
import { COLLECTIONS } from '../../../constants';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user, profile } = useSelector((s) => s.auth);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  const save = async () => {
    await firestoreService.update(COLLECTIONS.USERS, user.uid, { displayName, phone });
    const fresh = await authService.fetchProfile(user.uid);
    dispatch(sessionRestored({ user, profile: fresh }));
    enqueueSnackbar('Profile updated', { variant: 'success' });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Profile</Typography>
      <Card sx={{ maxWidth: 520 }}>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ width: 96, height: 96, bgcolor: 'secondary.main', fontSize: 36 }}>
              {(profile?.displayName || '?')[0]}
            </Avatar>
            <Chip label={profile?.role} color="primary" />
          </Stack>
          <Stack spacing={2}>
            <TextField label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="Email" value={profile?.email || ''} disabled helperText="Email is managed by the administrator" />
            <Button variant="contained" onClick={save}>Save Changes</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
