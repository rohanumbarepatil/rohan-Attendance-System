import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Box, Typography, Button } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DataTable from '../../../components/common/DataTable';
import PercentageChip from '../../../components/common/PercentageChip';
import { firestoreService } from '../../../services/firestoreService';
import { notificationService } from '../../notifications/notificationService';
import { COLLECTIONS, DEFAULTER_THRESHOLD, NOTIFICATION_TYPES } from '../../../constants';
import { calculatePercentage, isCountedPresent } from '../../../utils/attendance';

/** Live defaulter tracking computed from the realtime records stream. */
export default function DefaultersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.listen(COLLECTIONS.ATTENDANCE_RECORDS, [], (records) => {
      const byStudent = {};
      for (const r of records) {
        if (!byStudent[r.studentId]) {
          byStudent[r.studentId] = {
            id: r.studentId, studentUserId: r.studentUserId,
            name: r.studentName, rollNumber: r.rollNumber, total: 0, present: 0,
          };
        }
        byStudent[r.studentId].total += 1;
        if (isCountedPresent(r.status)) byStudent[r.studentId].present += 1;
      }
      const list = Object.values(byStudent)
        .map((s) => ({ ...s, percentage: calculatePercentage(s.present, s.total) }))
        .filter((s) => s.percentage < DEFAULTER_THRESHOLD)
        .sort((a, b) => a.percentage - b.percentage);
      setDefaulters(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const alertStudent = async (row) => {
    if (!row.studentUserId) {
      enqueueSnackbar('Student has no linked user account', { variant: 'warning' });
      return;
    }
    await notificationService.send({
      userId: row.studentUserId,
      type: NOTIFICATION_TYPES.DEFAULTER_ALERT,
      title: 'Low Attendance Warning',
      message: `Your overall attendance is ${row.percentage}%, below the required ${DEFAULTER_THRESHOLD}%. Please improve your attendance immediately.`,
    });
    enqueueSnackbar(`Warning sent to ${row.name}`, { variant: 'success' });
  };

  const columns = [
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'name', label: 'Name' },
    { key: 'present', label: 'Attended', render: (r) => `${r.present}/${r.total}` },
    { key: 'percentage', label: 'Percentage', render: (r) => <PercentageChip value={r.percentage} /> },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Defaulters (below {DEFAULTER_THRESHOLD}%)</Typography>
      <DataTable
        columns={columns} rows={defaulters} loading={loading}
        searchKeys={['name', 'rollNumber']}
        emptyMessage="No defaulters - great attendance!"
        actions={(row) => (
          <Button size="small" startIcon={<NotificationsActiveIcon />} onClick={() => alertStudent(row)}>
            Send Warning
          </Button>
        )}
      />
    </Box>
  );
}
