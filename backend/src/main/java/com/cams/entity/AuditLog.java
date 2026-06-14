package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Entity
@Table(name = "audit_logs", indexes = @Index(columnList = "entity, timestamp"))
@Getter
@Setter
public class AuditLog extends BaseEntity {
  private String action;
  private String entity;
  private String entityId;

  @Lob @Column(columnDefinition = "TEXT", name = "before_data")
  private String before;

  @Lob @Column(columnDefinition = "TEXT", name = "after_data")
  private String after;

  private Long performedBy;
  private String performedByEmail;
  private Instant timestamp;
}
