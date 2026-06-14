import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import BadgeIcon from '@mui/icons-material/Badge';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import WarningIcon from '@mui/icons-material/Warning';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';
import StatCard from '../../../components/common/StatCard';
import { firestoreService } from '../../../services/firestoreService';
import { statsUpdated, trendUpdated } from '../../dashboard/dashboardSlice';
import { COLLECTIONS, DEFAULTER_THRESHOLD } from '../../../constants';
import { summarizeRecords, isCountedPresent, calculatePercentage } from '../../../utils/attendance';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, trend } = useSelector((s) => s.dashboard);

  useEffect(() => {
    // Live dashboard statistics via realtime listeners
    const unsubs = [
      firestoreService.listen(COLLECTIONS.STUDENTS, [], (d) => dispatch(statsUpdated({ students: d.length }))),
      firestoreService.listen(COLLECTIONS.FACULTY, [], (d) => dispatch(statsUpdated({ faculty: d.length }))),
      firestoreService.listen(COLLECTIONS.SUBJECTS, [], (d) => dispatch(statsUpdated({ subjects: d.length }))),
      firestoreService.listen(COLLECTIONS.DEPARTMENTS, [], (d) => dispatch(statsUpdated({ departments: d.length }))),
      firestoreService.listen(COLLECTIONS.ATTENDANCE_SESSIONS, [], (sessions) => {
        const today = dayjs().format('YYYY-MM-DD');
        dispatch(statsUpdated({ sessionsToday: sessions.filter((s) => s.date === today).length }));
      }),
      firestoreService.listen(COLLECTIONS.ATTENDANCE_RECORDS, [], (records) => {
        // Live defaulter tracking
        const byStudent = {};
        for (const r of records) {
          byStudent[r.studentId] = byStudent[r.studentId] || { total: 0, present: 0 };
          byStudent[r.studentId].total += 1;
          if (isCountedPresent(r.status)) byStudent[r.studentId].present += 1;
        }
        const defaulters = Object.values(byStudent).filter(
          (s) => calculatePercentage(s.present, s.total) < DEFAULTER_THRESHOLD
        ).length;
        dispatch(statsUpdated({ defaulters }));

        // 14-day attendance trend
        const days = {};
        for (const r of records) {
          if (!r.date) continue;
          days[r.date] = days[r.date] || { date: r.date, total: 0, present: 0 };
          days[r.date].total += 1;
          if (isCountedPresent(r.status)) days[r.date].present += 1;
        }
        const trendData = Object.values(days)
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-14)
          .map((d) => ({ date: d.date.slice(5), percentage: calculatePercentage(d.present, d.total) }));
        dispatch(trendUpdated(trendData));
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [dispatch]);

  const cards = useMemo(() => [
    { title: 'Students', value: stats.students, icon: <GroupsIcon />, color: '#1a237e' },
    { title: 'Faculty', value: stats.faculty, icon: <BadgeIcon />, color: '#00897b' },
    { title: 'Subjects', value: stats.subjects, icon: <MenuBookIcon />, color: '#5e35b1' },
    { title: 'Departments', value: stats.departments, icon: <AccountTreeIcon />, color: '#00838f' },
    { title: 'Sessions Today', value: stats.sessionsToday, icon: <FactCheckIcon />, color: '#2e7d32' },
    { title: 'Defaulters', value: stats.defaulters, icon: <WarningIcon />, color: '#d32f2f' },
  ], [stats]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={c.title}>
            <StatCard {...c} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Attendance Trend (last 14 days)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} unit="%" />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="percentage" stroke="#1a237e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
