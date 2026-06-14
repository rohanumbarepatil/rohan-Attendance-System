package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "subjects", indexes = {
  @Index(columnList = "facultyUserId"),
  @Index(columnList = "departmentId"),
  @Index(columnList = "semesterId")
})
@Getter
@Setter
public class Subject extends BaseEntity {
  private String name;
  private String code;
  private Long departmentId;     // FK -> departments.id
  private String departmentName;
  private Long semesterId;       // FK -> semesters.id
  private String semesterName;
  private Long facultyUserId;    // FK -> users.id (assigned faculty)
  private String facultyName;
  private Integer totalLectures;
}
