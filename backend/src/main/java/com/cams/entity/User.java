package com.cams.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Entity
@Table(name = "users", indexes = @Index(columnList = "email", unique = true))
@Getter
@Setter
public class User extends BaseEntity {
  private String displayName;

  @Column(nullable = false, unique = true)
  private String email;

  @JsonIgnore
  @Column(nullable = false)
  private String password;

  @Column(nullable = false)
  private String role; // ADMIN | FACULTY | STUDENT

  private boolean active = true;
  private boolean emailVerified = false;
  private String phone;
  private Instant lastLoginAt;

  @JsonIgnore
  @Lob
  @Column(columnDefinition = "LONGBLOB")
  private byte[] photo;

  @JsonIgnore
  private String photoContentType;

  @JsonIgnore private String resetToken;
  @JsonIgnore private Instant resetTokenExpiry;
  @JsonIgnore private String verificationToken;
}
