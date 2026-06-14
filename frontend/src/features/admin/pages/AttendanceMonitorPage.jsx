import { useEffect, useState } from 'react';
import { Box, Typography, Chip, TextField, Stack } from '@mui/material';
import DataTable from '../../../components/common/DataTable';
import { firestoreService, orderBy } from '../../../services/firestoreService';
import { COLLECTIONS } from '../../../constants';

/** Live admin view of every attendance session across the institution. */
export default function AttendanceMonitorPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const unsubscribe = firestoreService.listen(
      COLLECTIONS.ATTENDANCE_SESSIONS,
      [orderBy('date', 'desc')],
      (data) => { setSessions(data); setLoading(false); }
    );
    return unsubscribe;
  }, []);

  const filtered = dateFilter ? sessions.filter((s) => s.date === dateFilter) : sessions;

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'lectureNumber', label: 'Lecture' },
    { key: 'facultyName', label: 'Faculty' },
    {
      key: 'presentCount', label: 'Present',
      render: (r) => `${r.presentCount} / ${r.totalStudents}`,
    },
    {
      key: 'locked', label: 'Status',
      render: (r) => <Chip size="small" label={r.locked ? 'Locked' : 'Open'} color={r.locked ? 'default' : 'success'} />,
    },
  ];

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" sx={{ mb: 2 }} spacing={1}>
        <Typography variant="h4">Attendance Monitor</Typography>
        <TextField type="date" size="small" label="Filter by date" InputLabelProps={{ shrink: true }}
          value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </Stack>
      <DataTable columns={columns} rows={filtered} loading={loading}
        searchKeys={['subjectName', 'facultyName', 'date']} />
    </Box>
  );
}
