package com.cams.controller;

import com.cams.repository.*;
import com.cams.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

  private final UserRepo userRepo;
  private final DepartmentRepo departmentRepo;
  private final CourseRepo courseRepo;
  private final SubjectRepo subjectRepo;

  @GetMapping("/admin/stats")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> getAdminStats() {
    return ResponseEntity.ok(Map.of(
        "totalUsers", userRepo.count(),
        "totalDepartments", departmentRepo.count(),
        "totalCourses", courseRepo.count(),
        "totalSubjects", subjectRepo.count()
    ));
  }
}

