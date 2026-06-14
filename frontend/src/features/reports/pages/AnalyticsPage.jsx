import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid, Legend,
} from 'recharts';
import { firestoreService } from '../../../services/firestoreService';
import { COLLECTIONS } from '../../../constants';
import { calculatePercentage, isCountedPresent, categorize } from '../../../utils/attendance';

const CATEGORY_COLORS = { Excellent: '#2e7d32', Good: '#0288d1', Warning: '#ed6c02', Critical: '#d32f2f' };

/** Live analytics computed from the realtime attendance record stream. */
export default function AnalyticsPage() {
  const [records, setRecords] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const unsubRecords = firestoreService.listen(COLLECTIONS.ATTENDANCE_RECORDS, [], setRecords);
    const unsubSessions = firestoreService.listen(COLLECTIONS.ATTENDANCE_SESSIONS, [], setSessions);
    return () => { unsubRecords(); unsubSessions(); };
  }, []);

  const analytics = useMemo(() => {
    // Trend by date
    const byDate = {};
    for (const r of records) {
      byDate[r.date] = byDate[r.date] || { date: r.date, total: 0, present: 0 };
      byDate[r.date].total += 1;
      if (isCountedPresent(r.status)) byDate[r.date].present += 1;
    }
    const trend = Object.values(byDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({ date: String(d.date).slice(5), percentage: calculatePercentage(d.present, d.total) }));

    // Subject analysis
    const bySubject = {};
    for (const r of records) {
      bySubject[r.subjectId] = bySubject[r.subjectId] || { subject: r.subjectName, total: 0, present: 0 };
      bySubject[r.subjectId].total += 1;
      if (isCountedPresent(r.status)) bySubject[r.subjectId].present += 1;
    }
    const subjectAnalysis = Object.values(bySubject)
      .map((s) => ({ subject: s.subject, percentage: calculatePercentage(s.present, s.total) }));

    // Faculty analysis (sessions conducted)
    const byFaculty = {};
    for (const s of sessions) {
      byFaculty[s.facultyUserId] = byFaculty[s.facultyUserId] || { faculty: s.facultyName, sessions: 0 };
      byFaculty[s.facultyUserId].sessions += 1;
    }
    const facultyAnalysis = Object.values(byFaculty);

    // Student category distribution (defaulter analysis)
    const byStudent = {};
    for (const r of records) {
      byStudent[r.studentId] = byStudent[r.studentId] || { total: 0, present: 0 };
      byStudent[r.studentId].total += 1;
      if (isCountedPresent(r.status)) byStudent[r.studentId].present += 1;
    }
    const distribution = { Excellent: 0, Good: 0, Warning: 0, Critical: 0 };
    for (const s of Object.values(byStudent)) {
      distribution[categorize(calculatePercentage(s.present, s.total)).label] += 1;
    }
    const categoryData = Object.entries(distribution).map(([name, value]) => ({ name, value }));

    return { trend, subjectAnalysis, facultyAnalysis, categoryData };
  }, [records, sessions]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Analytics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Attendance Trend</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={analytics.trend}>
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
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Student Categories</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={analytics.categoryData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {analytics.categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Legend />
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Subject Analysis</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.subjectAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} unit="%" />
                  <ChartTooltip />
                  <Bar dataKey="percentage" fill="#00897b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Faculty Analysis (Sessions Conducted)</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.facultyAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="faculty" />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip />
                  <Bar dataKey="sessions" fill="#5e35b1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
