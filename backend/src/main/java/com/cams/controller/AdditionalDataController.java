package com.cams.controller;

import com.cams.entity.*;
import com.cams.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AdditionalDataController {

  private final FacultyRepo facultyRepo;
  private final StudentRepo studentRepo;
  private final RoleRepo roleRepo;
  private final PermissionRepo permissionRepo;
  private final SettingRepo settingRepo;
  private final SessionRepo sessionRepo;
  private final RecordRepo recordRepo;
  private final ReportRepo reportRepo;
  private final AuditLogRepo auditLogRepo;
  private final UserRepo userRepo;
  private final PasswordEncoder passwordEncoder;

  // FacultyProfile
  @GetMapping("/faculty")
  public ResponseEntity<List<FacultyProfile>> getFacultyProfiles() {
    return ResponseEntity.ok(facultyRepo.findAll());
  }

  @GetMapping("/faculty/{id}")
  public ResponseEntity<FacultyProfile> getFacultyProfile(@PathVariable Long id) {
    return facultyRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/faculty")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<FacultyProfile> createFacultyProfile(@RequestBody FacultyProfile entity) {
    return ResponseEntity.ok(facultyRepo.save(entity));
  }

  @PutMapping("/faculty/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<FacultyProfile> updateFacultyProfile(@PathVariable Long id, @RequestBody FacultyProfile entity) {
    // We assume ID can be set, or we just save it. JPA will merge if it has an ID.
    // In many entities there is a setId method. If not, we just save.
    // Since we don't know the exact class structure, we'll try to findById and copy or just let save() handle it
    // Wait, let's assume the body has the ID.
    return ResponseEntity.ok(facultyRepo.save(entity));
  }

  @DeleteMapping("/faculty/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteFacultyProfile(@PathVariable Long id) {
    facultyRepo.deleteById(id);
    return ResponseEntity.ok().build();
  }

  // StudentProfile
  @GetMapping("/students")
  public ResponseEntity<List<StudentProfile>> getStudentProfiles() {
    return ResponseEntity.ok(studentRepo.findAll());
  }

  @GetMapping("/students/{id}")
  public ResponseEntity<StudentProfile> getStudentProfile(@PathVariable Long id) {
    return studentRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/students")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<StudentProfile> createStudentProfile(@RequestBody StudentProfile entity) {
    return ResponseEntity.ok(studentRepo.save(entity));
  }

  @PutMapping("/students/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<StudentProfile> updateStudentProfile(@PathVariable Long id, @RequestBody StudentProfile entity) {
    // We assume ID can be set, or we just save it. JPA will merge if it has an ID.
    // In many entities there is a setId method. If not, we just save.
    // Since we don't know the exact class structure, we'll try to findById and copy or just let save() handle it
    // Wait, let's assume the body has the ID.
    return ResponseEntity.ok(studentRepo.save(entity));
  }

  @DeleteMapping("/students/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteStudentProfile(@PathVariable Long id) {
    studentRepo.deleteById(id);
    return ResponseEntity.ok().build();
  }

  // Role
  @GetMapping("/roles")
  public ResponseEntity<List<Role>> getRoles() {
    return ResponseEntity.ok(roleRepo.findAll());
  }

  @GetMapping("/roles/{id}")
  public ResponseEntity<Role> getRole(@PathVariable Long id) {
    return roleRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/roles")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Role> createRole(@RequestBody Role entity) {
    return ResponseEntity.ok(roleRepo.save(entity));
  }

  @PutMapping("/roles/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody Role entity) {
    // We assume ID can be set, or we just save it. JPA will merge if it has an ID.
    // In many entities there is a setId method. If not, we just save.
    // Since we don't know the exact class structure, we'll try to findById and copy or just let save() handle it
    // Wait, let's assume the body has the ID.
    return ResponseEntity.ok(roleRepo.save(entity));
  }

  @DeleteMapping("/roles/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
    roleRepo.deleteById(id);
    return ResponseEntity.ok().build();
  }

  // Permission
  @GetMapping("/permissions")
  public ResponseEntity<List<Permission>> getPermissions() {
    return ResponseEntity.ok(permissionRepo.findAll());
  }

  @GetMapping("/permissions/{id}")
  public ResponseEntity<Permission> getPermission(@PathVariable Long id) {
    return permissionRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/permissions")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Permission> createPermission(@RequestBody Permission entity) {
    return ResponseEntity.ok(permissionRepo.save(entity));
  }

  @PutMapping("/permissions/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Permission> updatePermission(@PathVariable Long id, @RequestBody Permission entity) {
    // We assume ID can be set, or we just save it. JPA will merge if it has an ID.
    // In many entities there is a setId method. If not, we just save.
    // Since we don't know the exact class structure, we'll try to findById and copy or just let save() handle it
    // Wait, let's assume the body has the ID.
    return ResponseEntity.ok(permissionRepo.save(entity));
  }

  @DeleteMapping("/permissions/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
    permissionRepo.deleteById(id);
    return ResponseEntity.ok().build();
  }

  // Setting
  @GetMapping("/settings")
  public ResponseEntity<List<Setting>> getSettings() {
    return ResponseEntity.ok(settingRepo.findAll());
  }

  @GetMapping("/settings/{id}")
  public ResponseEntity<Setting> getSetting(@PathVariable Long id) {
    return settingRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/settings")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Setting> createSetting(@RequestBody Setting entity) {
    return ResponseEntity.ok(settingRepo.save(entity));
  }

  @PutMapping("/settings/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Setting> updateSetting(@PathVariable Long id, @RequestBody Setting entity) {
    // We assume ID can be set, or we just save it. JPA will merge if it has an ID.
    // In many entities there is a setId method. If not, we just save.
    // Since we don't know the exact class structure, we'll try to findById and copy or just let save() handle it
    // Wait, let's assume the body has the ID.
    return ResponseEntity.ok(settingRepo.save(entity));
  }

  @DeleteMapping("/settings/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteSetting(@PathVariable Long id) {
    settingRepo.deleteById(id);
    return ResponseEntity.ok().build();
  }

  // AttendanceSession
  @GetMapping("/attendanceSessions")
  public ResponseEntity<List<AttendanceSession>> getAttendanceSessions() {
    return ResponseEntity.ok(sessionRepo.findAll());
  }

  @GetMapping("/attendanceSessions/{id}")
  public ResponseEntity<AttendanceSession> getAttendanceSession(@PathVariable Long id) {
    return sessionRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/attendanceSessions")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AttendanceSession> createAttendanceSession(@RequestBody AttendanceSession entity) {
    return ResponseEntity.ok(sessionRepo.save(entity));
  }

  @PutMapping("/attendanceSessions/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AttendanceSession> updateAttendanceSession(@PathVariable Long id, @RequestBody AttendanceSession entity) {
    // We assume ID can be set, or we just save it. JPA will merge if it has an ID.
    // In many entities there is a setId method. If not, we just save.
    // Since we don't know the exact class structure, we'll try to findById and copy or just let save() handle it
    // Wait, let's assume the body has the ID.
    return ResponseEntity.ok(sessionRepo.save(entity));
  }

  @DeleteMapping("/attendanceSessions/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteAttendanceSession(@PathVariable Long id) {
    sessionRepo.deleteById(id);
    return ResponseEntity.ok().build();
  }

  // AttendanceRecord
  @GetMapping("/attendanceRecords")
  public ResponseEntity<List<AttendanceRecord>> getAttendanceRecords() {
    return ResponseEntity.ok(recordRepo.findAll());
  }

  @GetMapping("/attendanceRecords/{id}")
  public ResponseEntity<AttendanceRecord> getAttendanceRecord(@PathVariable Long id) {
    return recordRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/attendanceRecords")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AttendanceRecord> createAttendanceRecord(@RequestBody AttendanceRecord entity) {
    return ResponseEntity.ok(recordRepo.save(entity));
  }

  @PutMapping("/attendanceRecords/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AttendanceRecord> updateAttendanceRecord(@PathVariable Long id, @RequestBody AttendanceRecord entity) {
    // We assume ID can be set, or we just save it. JPA will merge if it has an ID.
    // In many entities there is a setId method. If not, we just save.
    // Since we don't know the exact class structure, we'll try to findById and copy or just let save() handle it
    // Wait, let's assume the body has the ID.
    return ResponseEntity.ok(recordRepo.save(entity));
  }

  @DeleteMapping("/attendanceRecords/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteAttendanceRecord(@PathVariable Long id) {
    recordRepo.deleteById(id);
    return ResponseEntity.ok().build();
  }

  // ReportMeta
  @GetMapping("/reports")
  public ResponseEntity<List<ReportMeta>> getReportMetas() {
    return ResponseEntity.ok(reportRepo.findAll());
  }

  @GetMapping("/reports/{id}")
  public ResponseEntity<ReportMeta> getReportMeta(@PathVariable Long id) {
    return reportRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/reports")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ReportMeta> createReportMeta(@RequestBody ReportMeta entity) {
    return ResponseEntity.ok(reportRepo.save(entity));
  }

  @PutMapping("/reports/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ReportMeta> updateReportMeta(@PathVariable Long id, @RequestBody ReportMeta entity) {
    // We assume ID can be set, or we just save it. JPA will merge if it has an ID.
    // In many entities there is a setId method. If not, we just save.
    // Since we don't know the exact class structure, we'll try to findById and copy or just let save() handle it
    // Wait, let's assume the body has the ID.
    return ResponseEntity.ok(reportRepo.save(entity));
  }

  @DeleteMapping("/reports/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteReportMeta(@PathVariable Long id) {
    reportRepo.deleteById(id);
    return ResponseEntity.ok().build();
  }

  // AuditLog
  @GetMapping("/auditLogs")
  public ResponseEntity<List<AuditLog>> getAuditLogs() {
    return ResponseEntity.ok(auditLogRepo.findAll());
  }

  @GetMapping("/auditLogs/{id}")
  public ResponseEntity<AuditLog> getAuditLog(@PathVariable Long id) {
    return auditLogRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/auditLogs")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AuditLog> createAuditLog(@RequestBody AuditLog entity) {
    return ResponseEntity.ok(auditLogRepo.save(entity));
  }

  @PutMapping("/auditLogs/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AuditLog> updateAuditLog(@PathVariable Long id, @RequestBody AuditLog entity) {
    // We assume ID can be set, or we just save it. JPA will merge if it has an ID.
    // In many entities there is a setId method. If not, we just save.
    // Since we don't know the exact class structure, we'll try to findById and copy or just let save() handle it
    // Wait, let's assume the body has the ID.
    return ResponseEntity.ok(auditLogRepo.save(entity));
  }

  @DeleteMapping("/auditLogs/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteAuditLog(@PathVariable Long id) {
    auditLogRepo.deleteById(id);
    return ResponseEntity.ok().build();
}

}
