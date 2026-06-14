package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "semesters", indexes = @Index(columnList = "academicYearId"))
@Getter
@Setter
public class Semester extends BaseEntity {
  private String name;

  @Column(name = "semester_number")
  private Integer number;

  private Long academicYearId;     // FK -> academic_years.id
  private String academicYearName;
}
