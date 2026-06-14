package com.cams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role extends BaseEntity {
  @Column(nullable = false)
  private String name;
  private String description;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"))
  @Column(name = "permission")
  private List<String> permissions = new ArrayList<>();
}
