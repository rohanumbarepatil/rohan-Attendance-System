package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "faculty", indexes = @Index(columnList = "userId"))
@Getter
@Setter
public class FacultyProfile extends BaseEntity {
  private String name;
  private String email;
  private Long userId;           // FK -> users.id
  private Long departmentId;     // FK -> departments.id
  private String departmentName;
  private String designation;
}
