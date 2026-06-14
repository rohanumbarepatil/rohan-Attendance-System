package com.cams.repository;

import com.cams.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RecordRepo extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByStudentUserIdOrderByDateDesc(Long studentUserId);
    List<AttendanceRecord> findBySessionId(Long sessionId);
    List<AttendanceRecord> findByStudentId(Long studentId);
    List<AttendanceRecord> findByDateBetween(LocalDate start, LocalDate end);
    List<AttendanceRecord> findByStudentUserIdAndDateBetween(Long studentUserId, LocalDate start, LocalDate end);
  }
