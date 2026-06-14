package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "attendance_records",
  uniqueConstraints = @UniqueConstraint(columnNames = {"sessionId", "studentId"}),
  indexes = {
    @Index(columnList = "studentUserId, date"),
    @Index(columnList = "sessionId"),
    @Index(columnList = "studentId, subjectId, date")
  })
@Getter
@Setter
public class AttendanceRecord extends BaseEntity {
  private Long sessionId;        // FK -> attendance_sessions.id
  private Long subjectId;
  private String subjectName;
  private Long studentId;        // FK -> students.id
  private Long studentUserId;    // FK -> users.id (ownership checks)
  private String studentName;
  private String rollNumber;
  private LocalDate date;
  private Integer lectureNumber;

  @Column(nullable = false)
  private String status;         // PRESENT | ABSENT | LATE | MEDICAL_LEAVE | AUTHORIZED_LEAVE

  private Long markedBy;         // users.id of the faculty
  private Instant markedAt;
  private Long lastModifiedBy;

  /** JSON array of {previousStatus,newStatus,modifiedBy,reason,modifiedAt} */
  @Lob
  @Column(columnDefinition = "TEXT")
  private String modificationHistory = "[]";
}
