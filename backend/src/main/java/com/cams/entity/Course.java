package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "courses", indexes = @Index(columnList = "departmentId"))
@Getter
@Setter
public class Course extends BaseEntity {
  private String name;
  private String code;
  private Long departmentId;       // FK -> departments.id
  private String departmentName;   // denormalized for list rendering
  private Integer durationYears;
}
