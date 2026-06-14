package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "attendance_sessions",
  uniqueConstraints = @UniqueConstraint(columnNames = {"subjectId", "date", "lectureNumber"}),
  indexes = {
    @Index(columnList = "facultyUserId, date"),
    @Index(columnList = "subjectId, date")
  })
@Getter
@Setter
public class AttendanceSession extends BaseEntity {
  private Long subjectId;        // FK -> subjects.id
  private String subjectName;
  private Long departmentId;
  private Long semesterId;
  private LocalDate date;
  private Integer lectureNumber;
  private Long facultyUserId;    // FK -> users.id
  private String facultyName;
  private Integer totalStudents;
  private Integer presentCount;
  private boolean locked = true; // lock-on-submit business rule
}
