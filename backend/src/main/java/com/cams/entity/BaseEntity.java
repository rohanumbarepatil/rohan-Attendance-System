package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Instant createdAt;
  private Instant updatedAt;

  @PrePersist
  void onCreate() { createdAt = Instant.now(); updatedAt = Instant.now(); }

  @PreUpdate
  void onUpdate() { updatedAt = Instant.now(); }
}
