import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Table, TableHead, TableRow, TableCell, TableBody, TextField, MenuItem, Stack, IconButton, Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DataTable from '../../../components/common/DataTable';
import { loadFacultySessions } from '../../attendance/attendanceSlice';
import { attendanceService } from '../../attendance/attendanceService';
import { ATTENDANCE_STATUS, ROLES } from '../../../constants';

export default function AttendanceHistoryPage() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user, profile } = useSelector((s) => s.auth);
  const { sessions, loading } = useSelector((s) => s.attendance);
  const [viewing, setViewing] = useState(null);
  const [records, setRecords] = useState([]);
  const [edit, setEdit] = useState(null); // { record, status, reason }

  useEffect(() => {
    if (user) dispatch(loadFacultySessions(user.uid));
  }, [user, dispatch]);

  const openSession = async (session) => {
    setViewing(session);
    setRecords(await attendanceService.getRecordsBySession(session.id));
  };

  const saveEdit = async () => {
    try {
      await attendanceService.editRecord(edit.record, edit.status, user.uid, edit.reason);
      enqueueSnackbar('Record updated with audit trail', { variant: 'success' });
      setEdit(null);
      setRecords(await attendanceService.getRecordsBySession(viewing.id));
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  };

  const unlock = async (session) => {
    await attendanceService.unlockSession(session.id);
    enqueueSnackbar('Session unlocked for editing', { variant: 'success' });
    dispatch(loadFacultySessions(user.uid));
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'lectureNumber', label: 'Lecture' },
    { key: 'presentCount', label: 'Present', render: (r) => `${r.presentCount}/${r.totalStudents}` },
    { key: 'locked', label: 'Status', render: (r) => <Chip size="small" label={r.locked ? 'Locked' : 'Open'} color={r.locked ? 'default' : 'success'} /> },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Attendance History</Typography>
      <DataTable
        columns={columns} rows={sessions} loading={loading}
        searchKeys={['subjectName', 'date']}
        actions={(row) => (
          <>
            <Tooltip title="View records">
              <IconButton size="small" onClick={() => openSession(row)}><VisibilityIcon fontSize="small" /></IconButton>
            </Tooltip>
            {profile?.role === ROLES.ADMIN && row.locked && (
              <Tooltip title="Unlock session">
                <IconButton size="small" onClick={() => unlock(row)}><LockOpenIcon fontSize="small" /></IconButton>
              </Tooltip>
            )}
          </>
        )}
      />

      <Dialog open={!!viewing} onClose={() => setViewing(null)} fullWidth maxWidth="md">
        <DialogTitle>
          {viewing?.subjectName} · {viewing?.date} · Lecture {viewing?.lectureNumber}
        </DialogTitle>
        <DialogContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Roll No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Edits</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.rollNumber}</TableCell>
                  <TableCell>{r.studentName}</TableCell>
                  <TableCell><Chip size="small" label={r.status} /></TableCell>
                  <TableCell>{(r.modificationHistory || []).length}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => setEdit({ record: r, status: r.status, reason: '' })}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions><Button onClick={() => setViewing(null)}>Close</Button></DialogActions>
      </Dialog>

      <Dialog open={!!edit} onClose={() => setEdit(null)} fullWidth maxWidth="xs">
        <DialogTitle>Edit Attendance Record</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField select label="Status" value={edit?.status || ''}
              onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
              {Object.values(ATTENDANCE_STATUS).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField label="Reason for change" multiline rows={2} value={edit?.reason || ''}
              onChange={(e) => setEdit({ ...edit, reason: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEdit(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
