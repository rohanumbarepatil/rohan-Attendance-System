import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Card, CardContent, Alert } from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import PercentIcon from '@mui/icons-material/Percent';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid } from 'recharts';
import StatCard from '../../../components/common/StatCard';
import PercentageChip from '../../../components/common/PercentageChip';
import { attendanceService } from '../../attendance/attendanceService';
import { recordsUpdated } from '../../attendance/attendanceSlice';
import { summarizeRecords } from '../../../utils/attendance';
import { DEFAULTER_THRESHOLD } from '../../../constants';

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((s) => s.auth);
  const { records } = useSelector((s) => s.attendance);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!user) return undefined;
    // Realtime listener gives live percentage updates
    const unsubscribe = attendanceService.listenToStudentRecords(user.uid, (data) => {
      dispatch(recordsUpdated(data));
      setSummary(summarizeRecords(data));
    });
    return unsubscribe;
  }, [user, dispatch]);

  const absent = records.length - (summary?.present || 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Welcome, {profile?.displayName}</Typography>

      {summary && summary.total > 0 && summary.percentage < DEFAULTER_THRESHOLD && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Defaulter warning: your attendance is {summary.percentage}%, below the required {DEFAULTER_THRESHOLD}%.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Lectures Attended" value={summary?.present ?? 0} icon={<FactCheckIcon />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Lectures Missed" value={absent} icon={<EventBusyIcon />} color="#d32f2f" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Overall Percentage" value={`${summary?.percentage ?? 0}%`} icon={<PercentIcon />} color="#1a237e" />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Subject-wise Attendance</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary?.subjects || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subjectName" />
                  <YAxis domain={[0, 100]} unit="%" />
                  <ChartTooltip />
                  <Bar dataKey="percentage" fill="#1a237e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {(summary?.subjects || []).map((s) => (
                  <Box key={s.subjectId} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2">{s.subjectName}:</Typography>
                    <PercentageChip value={s.percentage} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
