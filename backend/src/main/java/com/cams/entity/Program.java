package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "programs", indexes = @Index(columnList = "courseId"))
@Getter
@Setter
public class Program extends BaseEntity {
  private String name;
  private Long courseId;        // FK -> courses.id
  private String courseName;
  private String level;         // UG | PG | Diploma | PhD
}
