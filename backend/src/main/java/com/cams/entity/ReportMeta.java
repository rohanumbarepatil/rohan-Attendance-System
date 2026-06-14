package com.cams.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Entity
@Table(name = "reports")
@Getter
@Setter
public class ReportMeta extends BaseEntity {
  private String period;
  private Long generatedBy;      // users.id
  private Long studentUserId;    // for student-scoped reports
  private Integer rowCount;
  private String format;         // PDF | EXCEL | API
  private Instant generatedAt;
}
