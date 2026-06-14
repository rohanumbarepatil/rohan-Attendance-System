package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "students", indexes = {
  @Index(columnList = "userId"),
  @Index(columnList = "departmentId, rollNumber"),
  @Index(columnList = "semesterId")
})
@Getter
@Setter
public class StudentProfile extends BaseEntity {
  private String rollNumber;
  private String name;
  private String email;
  private Long userId;            // FK -> users.id
  private Long departmentId;      // FK -> departments.id
  private String departmentName;
  private Long semesterId;        // FK -> semesters.id
  private String semesterName;
  private Long programId;         // FK -> programs.id
  private String programName;

  // Caches maintained by the attendance service (parity with Cloud Function caching)
  private Double attendancePercentage = 0.0;
  private Integer attendedLectures = 0;
  private Integer totalLectures = 0;
  private boolean isDefaulter = false;
}
