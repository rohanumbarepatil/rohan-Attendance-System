package com.cams.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "academic_years")
@Getter
@Setter
public class AcademicYear extends BaseEntity {
  private String name;
  private LocalDate startDate;
  private LocalDate endDate;

  @Column(name = "is_current")
  private boolean current = false;
}
