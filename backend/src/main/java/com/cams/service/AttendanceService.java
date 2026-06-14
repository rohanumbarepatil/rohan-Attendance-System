package com.cams.service;

import com.cams.entity.*;
import com.cams.repository.*;
import com.cams.web.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {
  private final SessionRepo sessionRepo;
  private final RecordRepo recordRepo;
  private final SubjectRepo subjectRepo;
  private final StudentRepo studentRepo;
  private final FacultyRepo facultyRepo;

  public AttendanceSession createSession(AttendanceSession session) {
    if (sessionRepo.existsBySubjectIdAndDateAndLectureNumber(session.getSubjectId(), session.getDate(), session.getLectureNumber())) {
      throw new ApiException(400, "SESSION_EXISTS", "A session for this subject, date, and lecture number already exists");
    }
    return sessionRepo.save(session);
  }

  public List<AttendanceSession> getFacultySessions(Long facultyUserId) {
    return sessionRepo.findByFacultyUserIdOrderByDateDesc(facultyUserId);
  }

  public List<AttendanceRecord> getSessionRecords(Long sessionId) {
    return recordRepo.findBySessionId(sessionId);
  }

  public List<AttendanceRecord> saveRecords(List<AttendanceRecord> records) {
    return recordRepo.saveAll(records);
  }

  public List<AttendanceRecord> getStudentAttendance(Long studentUserId) {
    return recordRepo.findByStudentUserIdOrderByDateDesc(studentUserId);
  }
}

