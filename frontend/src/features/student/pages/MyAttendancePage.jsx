import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Card, CardContent, Chip } from '@mui/material';
import DataTable from '../../../components/common/DataTable';
import PercentageChip from '../../../components/common/PercentageChip';
import { attendanceService } from '../../attendance/attendanceService';
import { summarizeRecords, groupByMonth } from '../../../utils/attendance';

export default function MyAttendancePage() {
  const { user } = useSelector((s) => s.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!user) return undefined;
    const unsubscribe = attendanceService.listenToStudentRecords(user.uid, (data) => {
      setRecords([...data].sort((a, b) => String(b.date).localeCompare(String(a.date))));
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const summary = useMemo(() => summarizeRecords(records), [records]);
  const monthly = useMemo(() => groupByMonth(records), [records]);

  const dailyColumns = [
    { key: 'date', label: 'Date' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'lectureNumber', label: 'Lecture' },
    { key: 'status', label: 'Status', render: (r) => <Chip size="small" label={r.status} /> },
  ];

  const subjectColumns = [
    { key: 'subjectName', label: 'Subject' },
    { key: 'present', label: 'Attended', render: (r) => `${r.present}/${r.total}` },
    { key: 'percentage', label: 'Percentage', render: (r) => <PercentageChip value={r.percentage} /> },
  ];

  const monthlyColumns = [
    { key: 'month', label: 'Month' },
    { key: 'present', label: 'Attended', render: (r) => `${r.present}/${r.total}` },
    { key: 'percentage', label: 'Percentage', render: (r) => <PercentageChip value={r.percentage} /> },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Attendance</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6">Semester Overall:</Typography>
          <PercentageChip value={summary.percentage} />
          <Typography color="text.secondary">({summary.present} of {summary.total} lectures attended)</Typography>
        </CardContent>
      </Card>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }} variant="scrollable">
        <Tab label="Date-wise" />
        <Tab label="Subject-wise" />
        <Tab label="Monthly" />
      </Tabs>

      {tab === 0 && <DataTable columns={dailyColumns} rows={records.map((r, i) => ({ ...r, id: r.id || i }))} loading={loading} searchKeys={['date', 'subjectName', 'status']} />}
      {tab === 1 && <DataTable columns={subjectColumns} rows={summary.subjects.map((s) => ({ ...s, id: s.subjectId }))} loading={loading} searchKeys={['subjectName']} />}
      {tab === 2 && <DataTable columns={monthlyColumns} rows={monthly.map((m) => ({ ...m, id: m.month }))} loading={loading} searchKeys={['month']} />}
    </Box>
  );
}
