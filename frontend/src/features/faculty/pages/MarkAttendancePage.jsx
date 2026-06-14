import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Card, CardContent, TextField, MenuItem, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, ToggleButtonGroup, ToggleButton, Alert,
} from '@mui/material';
import dayjs from 'dayjs';
import { firestoreService, where } from '../../../services/firestoreService';
import { submitAttendance, clearAttendanceError } from '../../attendance/attendanceSlice';
import { notificationService } from '../../notifications/notificationService';
import { COLLECTIONS, ATTENDANCE_STATUS, NOTIFICATION_TYPES } from '../../../constants';

const STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'P',
  [ATTENDANCE_STATUS.ABSENT]: 'A',
  [ATTENDANCE_STATUS.LATE]: 'L',
  [ATTENDANCE_STATUS.MEDICAL_LEAVE]: 'ML',
  [ATTENDANCE_STATUS.AUTHORIZED_LEAVE]: 'AL',
};

export default function MarkAttendancePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { user, profile } = useSelector((s) => s.auth);
  const { submitting, error } = useSelector((s) => s.attendance);

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjectId, setSubjectId] = useState(location.state?.subjectId || '');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [lectureNumber, setLectureNumber] = useState(1);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    if (!user) return;
    firestoreService.list(COLLECTIONS.SUBJECTS, [where('facultyUserId', '==', user.uid)]).then(setSubjects);
  }, [user]);

  const subject = useMemo(() => subjects.find((s) => s.id === subjectId), [subjects, subjectId]);

  useEffect(() => {
    if (!subject) { setStudents([]); return; }
    // Students of the subject's semester + department form the class roster
    firestoreService.list(COLLECTIONS.STUDENTS, [where('semesterId', '==', subject.semesterId)]).then((list) => {
      const roster = list
        .filter((st) => !subject.departmentId || st.departmentId === subject.departmentId)
        .sort((a, b) => String(a.rollNumber).localeCompare(String(b.rollNumber)));
      setStudents(roster);
      setStatuses(Object.fromEntries(roster.map((st) => [st.id, ATTENDANCE_STATUS.PRESENT])));
    });
  }, [subject]);

  const markAll = (status) =>
    setStatuses(Object.fromEntries(students.map((st) => [st.id, status])));

  const handleSubmit = async () => {
    if (!subject || students.length === 0) return;
    const result = await dispatch(submitAttendance({
      subject, date, lectureNumber: Number(lectureNumber),
      facultyUserId: user.uid, facultyName: profile.displayName,
      students: students.map((s) => ({ id: s.id, userId: s.userId, name: s.name, rollNumber: s.rollNumber })),
      statuses,
    }));
    if (submitAttendance.fulfilled.match(result)) {
      enqueueSnackbar('Attendance submitted and locked', { variant: 'success' });
      // Notify each student that attendance was marked
      await Promise.all(students.filter((s) => s.userId).map((s) =>
        notificationService.send({
          userId: s.userId,
          type: NOTIFICATION_TYPES.ATTENDANCE_MARKED,
          title: 'Attendance marked',
          message: `${subject.name} · ${date} · Lecture ${lectureNumber}: ${statuses[s.id]}`,
        })
      ));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Mark Attendance</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearAttendanceError())}>{error}</Alert>}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField select fullWidth label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((s) => <MenuItem key={s.id} value={s.id}>{s.name} ({s.code})</MenuItem>)}
            </TextField>
            <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }}
              value={date} onChange={(e) => setDate(e.target.value)} />
            <TextField fullWidth select label="Lecture" value={lectureNumber} onChange={(e) => setLectureNumber(e.target.value)}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <MenuItem key={n} value={n}>Lecture {n}</MenuItem>)}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Button size="small" onClick={() => markAll(ATTENDANCE_STATUS.PRESENT)}>All Present</Button>
              <Button size="small" onClick={() => markAll(ATTENDANCE_STATUS.ABSENT)}>All Absent</Button>
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Roll No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((st) => (
                  <TableRow key={st.id} hover>
                    <TableCell>{st.rollNumber}</TableCell>
                    <TableCell>{st.name}</TableCell>
                    <TableCell>
                      <ToggleButtonGroup
                        exclusive size="small" value={statuses[st.id]}
                        onChange={(_, v) => v && setStatuses({ ...statuses, [st.id]: v })}
                      >
                        {Object.entries(STATUS_LABELS).map(([status, label]) => (
                          <ToggleButton key={status} value={status} aria-label={status}>{label}</ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button variant="contained" size="large" disabled={submitting} onClick={handleSubmit}>
                Submit & Lock Attendance
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      {subjectId && students.length === 0 && (
        <Alert severity="info">No students found for this subject's semester and department.</Alert>
      )}
    </Box>
  );
}
