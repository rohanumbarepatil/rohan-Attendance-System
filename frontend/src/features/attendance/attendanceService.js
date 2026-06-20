import api from '../../services/api';
import { COLLECTIONS, ATTENDANCE_STATUS } from '../../constants';

export const attendanceService = {
  async createSession({ subject, date, lectureNumber, facultyUserId, facultyName, students, statuses }) {
    const sessionData = {
      subjectId: subject.id,
      subjectName: subject.name,
      departmentId: subject.departmentId || '',
      semesterId: subject.semesterId || '',
      date,
      lectureNumber,
      facultyUserId,
      facultyName,
      totalStudents: students.length,
      presentCount: students.filter((s) => statuses[s.id] === ATTENDANCE_STATUS.PRESENT).length,
      locked: true,
    };
    
    // Create session via REST API
    const sessionRes = await api.post('/api/attendance/sessions', sessionData);
    const sessionKey = sessionRes.data.id || sessionRes.data;
    
    // Create records
    const records = students.map(student => ({
      sessionId: sessionKey,
      subjectId: subject.id,
      subjectName: subject.name,
      studentId: student.id,
      studentUserId: student.userId || '',
      studentName: student.name,
      rollNumber: student.rollNumber || '',
      date,
      lectureNumber,
      status: statuses[student.id] || ATTENDANCE_STATUS.ABSENT,
      markedBy: facultyUserId,
      modificationHistory: [],
    }));
    await api.post('/api/attendance/records', records);
    return sessionKey;
  },

  async editRecord(record, newStatus, editorUid, reason) {
    const historyEntry = {
      previousStatus: record.status,
      newStatus,
      modifiedBy: editorUid,
      reason: reason || '',
      modifiedAt: new Date().toISOString(),
    };
    const updatedRecord = {
      ...record,
      status: newStatus,
      lastModifiedBy: editorUid,
      modificationHistory: [...(record.modificationHistory || []), historyEntry],
    };
    await api.put(`/attendance/records/${record.id}`, updatedRecord);
  },

  async unlockSession(sessionId) {
    await api.put(`/attendance/sessions/${sessionId}/unlock`);
  },

  async getSessionsByFaculty(facultyUserId) {
    const res = await api.get(`/attendance/sessions/faculty/${facultyUserId}`);
    return res.data;
  },

  async getRecordsBySession(sessionId) {
    const res = await api.get(`/attendance/sessions/${sessionId}/records`);
    return res.data;
  },

  async getRecordsByStudentUser(studentUserId) {
    const res = await api.get(`/attendance/student/${studentUserId}`);
    return res.data;
  },

  async getAllRecords() {
    const res = await api.get(`/attendance/records`);
    return res.data;
  },

  listenToStudentRecords(studentUserId, callback) {
    this.getRecordsByStudentUser(studentUserId).then(callback);
    const interval = setInterval(() => {
      this.getRecordsByStudentUser(studentUserId).then(callback);
    }, 5000);
    return () => clearInterval(interval);
  },
};

