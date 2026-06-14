package com.cams.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "settings")
@Getter
@Setter
public class Setting extends BaseEntity {
  private String institutionName = "";
  private Integer defaulterThreshold = 75;
  private Integer criticalThreshold = 60;
  private Integer lecturesPerDay = 6;
  private String academicYear = "";
}
