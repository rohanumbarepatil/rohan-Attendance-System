package com.cams.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Entity
@Table(name = "notifications", indexes = @Index(columnList = "userId, createdAt"))
@Getter
@Setter
public class Notification extends BaseEntity {
  private Long userId;       // null for broadcasts
  private String audience;   // ALL | ADMIN | FACULTY | STUDENT | null
  private String type;
  private String title;

  @Column(length = 2000)
  private String message;

  @JsonProperty("read")
  @Column(name = "is_read")
  private boolean read = false;

  private Instant readAt;
}
