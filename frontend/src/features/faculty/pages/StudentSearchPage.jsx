import { useEffect, useState } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DataTable from '../../../components/common/DataTable';
import PercentageChip from '../../../components/common/PercentageChip';
import { firestoreService, where, orderBy } from '../../../services/firestoreService';
import { COLLECTIONS } from '../../../constants';
import { summarizeRecords } from '../../../utils/attendance';

export default function StudentSearchPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    firestoreService.list(COLLECTIONS.STUDENTS, [orderBy('rollNumber')]).then((d) => {
      setStudents(d);
      setLoading(false);
    });
  }, []);

  const openStudent = async (student) => {
    setViewing(student);
    const records = await firestoreService.list(COLLECTIONS.ATTENDANCE_RECORDS, [
      where('studentId', '==', student.id),
    ]);
    setSummary(summarizeRecords(records));
  };

  const columns = [
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'departmentName', label: 'Department' },
    { key: 'semesterName', label: 'Semester' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Student Search</Typography>
      <DataTable
        columns={columns} rows={students} loading={loading}
        searchKeys={['name', 'rollNumber', 'email', 'departmentName']}
        actions={(row) => (
          <Tooltip title="View attendance summary">
            <IconButton size="small" onClick={() => openStudent(row)}><VisibilityIcon fontSize="small" /></IconButton>
          </Tooltip>
        )}
      />

      <Dialog open={!!viewing} onClose={() => setViewing(null)} fullWidth maxWidth="sm">
        <DialogTitle>{viewing?.name} ({viewing?.rollNumber})</DialogTitle>
        <DialogContent>
          {summary && (
            <Box>
              <Box sx={{ mb: 2 }}>
                Overall: <PercentageChip value={summary.percentage} /> ({summary.present}/{summary.total} lectures)
              </Box>
              {summary.subjects.map((s) => (
                <Box key={s.subjectId} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                  <span>{s.subjectName}</span>
                  <PercentageChip value={s.percentage} />
                </Box>
              ))}
              {summary.subjects.length === 0 && <Typography color="text.secondary">No attendance records yet.</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setViewing(null)}>Close</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
