import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem, Button, Stack, Chip,
} from '@mui/material';
import { firestoreService, where } from '../../../services/firestoreService';
import { logAudit } from '../../../services/auditService';
import { COLLECTIONS } from '../../../constants';

/** Assign faculty to subjects and students to semesters/programs. */
export default function AssignmentsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [students, setStudents] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [facultyUserId, setFacultyUserId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [semesterId, setSemesterId] = useState('');

  const load = async () => {
    const [subs, fac, studs, sems] = await Promise.all([
      firestoreService.list(COLLECTIONS.SUBJECTS),
      firestoreService.list(COLLECTIONS.FACULTY),
      firestoreService.list(COLLECTIONS.STUDENTS),
      firestoreService.list(COLLECTIONS.SEMESTERS),
    ]);
    setSubjects(subs); setFacultyList(fac); setStudents(studs); setSemesters(sems);
  };

  useEffect(() => { load(); }, []);

  const assignFaculty = async () => {
    if (!subjectId || !facultyUserId) return;
    const fac = facultyList.find((f) => f.userId === facultyUserId);
    await firestoreService.update(COLLECTIONS.SUBJECTS, subjectId, {
      facultyUserId,
      facultyName: fac?.name || '',
    });
    await logAudit({ action: 'ASSIGN_FACULTY', entity: COLLECTIONS.SUBJECTS, entityId: subjectId, after: { facultyUserId } });
    enqueueSnackbar('Faculty assigned to subject', { variant: 'success' });
    load();
  };

  const assignStudent = async () => {
    if (!studentId || !semesterId) return;
    const sem = semesters.find((s) => s.id === semesterId);
    await firestoreService.update(COLLECTIONS.STUDENTS, studentId, {
      semesterId,
      semesterName: sem?.name || '',
    });
    await logAudit({ action: 'ASSIGN_STUDENT', entity: COLLECTIONS.STUDENTS, entityId: studentId, after: { semesterId } });
    enqueueSnackbar('Student assigned to semester', { variant: 'success' });
    load();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Assignments</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Assign Faculty to Subject</Typography>
              <Stack spacing={2}>
                <TextField select label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                  {subjects.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name} {s.facultyName && <Chip size="small" label={s.facultyName} sx={{ ml: 1 }} />}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField select label="Faculty" value={facultyUserId} onChange={(e) => setFacultyUserId(e.target.value)}>
                  {facultyList.map((f) => <MenuItem key={f.id} value={f.userId}>{f.name}</MenuItem>)}
                </TextField>
                <Button variant="contained" onClick={assignFaculty}>Assign</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Assign Student to Semester</Typography>
              <Stack spacing={2}>
                <TextField select label="Student" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                  {students.map((s) => <MenuItem key={s.id} value={s.id}>{s.rollNumber} - {s.name}</MenuItem>)}
                </TextField>
                <TextField select label="Semester" value={semesterId} onChange={(e) => setSemesterId(e.target.value)}>
                  {semesters.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </TextField>
                <Button variant="contained" onClick={assignStudent}>Assign</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
