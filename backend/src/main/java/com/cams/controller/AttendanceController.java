package com.cams.controller;

import com.cams.entity.AttendanceSession;
import com.cams.entity.AttendanceRecord;
import com.cams.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
  private final AttendanceService attendanceService;

  @PostMapping("/sessions")
  @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
  public ResponseEntity<AttendanceSession> createSession(@RequestBody AttendanceSession session) {
    return ResponseEntity.ok(attendanceService.createSession(session));
  }

  @GetMapping("/sessions/faculty/{facultyUserId}")
  @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
  public ResponseEntity<List<AttendanceSession>> getFacultySessions(@PathVariable Long facultyUserId) {
    return ResponseEntity.ok(attendanceService.getFacultySessions(facultyUserId));
  }

  @GetMapping("/sessions/{sessionId}/records")
  @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
  public ResponseEntity<List<AttendanceRecord>> getSessionRecords(@PathVariable Long sessionId) {
    return ResponseEntity.ok(attendanceService.getSessionRecords(sessionId));
  }

  @PostMapping("/records")
  @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
  public ResponseEntity<List<AttendanceRecord>> saveRecords(@RequestBody List<AttendanceRecord> records) {
    return ResponseEntity.ok(attendanceService.saveRecords(records));
  }

  @GetMapping("/student/{studentUserId}")
  @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
  public ResponseEntity<List<AttendanceRecord>> getStudentAttendance(@PathVariable Long studentUserId) {
    return ResponseEntity.ok(attendanceService.getStudentAttendance(studentUserId));
  }
}
