import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Card, CardContent, Button, List, ListItem, ListItemText, Chip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import TodayIcon from '@mui/icons-material/Today';
import dayjs from 'dayjs';
import StatCard from '../../../components/common/StatCard';
import { firestoreService, where } from '../../../services/firestoreService';
import { COLLECTIONS } from '../../../constants';

export default function FacultyDashboard() {
  const { user, profile } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!user) return undefined;
    const unsubSubjects = firestoreService.listen(
      COLLECTIONS.SUBJECTS, [where('facultyUserId', '==', user.uid)], setSubjects
    );
    const unsubSessions = firestoreService.listen(
      COLLECTIONS.ATTENDANCE_SESSIONS, [where('facultyUserId', '==', user.uid)], setSessions
    );
    return () => { unsubSubjects(); unsubSessions(); };
  }, [user]);

  const today = dayjs().format('YYYY-MM-DD');
  const todaySessions = sessions.filter((s) => s.date === today);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Welcome, {profile?.displayName}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Assigned Subjects" value={subjects.length} icon={<MenuBookIcon />} color="#1a237e" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Sessions" value={sessions.length} icon={<FactCheckIcon />} color="#00897b" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Sessions Today" value={todaySessions.length} icon={<TodayIcon />} color="#2e7d32" />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>My Subjects</Typography>
              <List dense>
                {subjects.map((s) => (
                  <ListItem key={s.id} divider
                    secondaryAction={
                      <Button size="small" variant="outlined"
                        onClick={() => navigate('/faculty/mark-attendance', { state: { subjectId: s.id } })}>
                        Mark
                      </Button>
                    }>
                    <ListItemText primary={s.name} secondary={`${s.code} · ${s.departmentName || ''} ${s.semesterName || ''}`} />
                  </ListItem>
                ))}
                {subjects.length === 0 && <ListItem><ListItemText primary="No subjects assigned yet" /></ListItem>}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Sessions</Typography>
              <List dense>
                {sessions.slice(0, 8).map((s) => (
                  <ListItem key={s.id} divider>
                    <ListItemText
                      primary={`${s.subjectName} · Lecture ${s.lectureNumber}`}
                      secondary={s.date}
                    />
                    <Chip size="small" label={`${s.presentCount}/${s.totalStudents} present`} />
                  </ListItem>
                ))}
                {sessions.length === 0 && <ListItem><ListItemText primary="No sessions yet" /></ListItem>}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
