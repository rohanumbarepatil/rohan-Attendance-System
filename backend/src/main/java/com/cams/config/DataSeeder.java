package com.cams.config;

import com.cams.entity.*;
import com.cams.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;

/**
 * Seeds the database with realistic test data on startup.
 * Idempotent: only runs if the users table has 1 or fewer rows (the auto-seeded admin).
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

  private final UserRepo userRepo;
  private final DepartmentRepo departmentRepo;
  private final CourseRepo courseRepo;
  private final ProgramRepo programRepo;
  private final AcademicYearRepo academicYearRepo;
  private final SemesterRepo semesterRepo;
  private final SubjectRepo subjectRepo;
  private final FacultyRepo facultyRepo;
  private final StudentRepo studentRepo;
  private final SessionRepo sessionRepo;
  private final RecordRepo recordRepo;
  private final NotificationRepo notificationRepo;
  private final ReportRepo reportRepo;
  private final AuditLogRepo auditLogRepo;
  private final RoleRepo roleRepo;
  private final PermissionRepo permissionRepo;
  private final SettingRepo settingRepo;
  private final PasswordEncoder passwordEncoder;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (userRepo.count() > 1) {
      System.out.println("[DataSeeder] Database already seeded (" + userRepo.count() + " users). Skipping.");
      return;
    }
    System.out.println("[DataSeeder] Seeding database with test data...");
    seed();
    System.out.println("[DataSeeder] Seeding complete!");
  }

  private void seed() {
    String encodedPassword = passwordEncoder.encode("Password@123");

    // ===== USERS =====
    // Admin already exists (id=1). Update to ensure consistency.
    User admin = userRepo.findByEmail("admin@college.edu").orElse(null);
    if (admin == null) {
      admin = new User();
      admin.setEmail("admin@college.edu");
      admin.setPassword(passwordEncoder.encode("Admin@123"));
      admin.setDisplayName("Dr. Rajesh Kumar");
      admin.setRole("ADMIN");
      admin.setActive(true);
      admin.setEmailVerified(true);
      admin = userRepo.save(admin);
    } else {
      admin.setDisplayName("Dr. Rajesh Kumar");
      admin.setPassword(passwordEncoder.encode("Admin@123"));
      admin.setActive(true);
      admin.setEmailVerified(true);
      admin = userRepo.save(admin);
    }

    User faculty1 = createUser("Prof. Anita Sharma", "anita.sharma@college.edu", encodedPassword, "FACULTY");
    User faculty2 = createUser("Prof. Vikram Patel", "vikram.patel@college.edu", encodedPassword, "FACULTY");

    User student1 = createUser("Rahul Deshmukh", "rahul.deshmukh@college.edu", encodedPassword, "STUDENT");
    User student2 = createUser("Priya Kulkarni", "priya.kulkarni@college.edu", encodedPassword, "STUDENT");
    User student3 = createUser("Amit Joshi", "amit.joshi@college.edu", encodedPassword, "STUDENT");
    User student4 = createUser("Sneha Patil", "sneha.patil@college.edu", encodedPassword, "STUDENT");
    User student5 = createUser("Rohan Mehta", "rohan.mehta@college.edu", encodedPassword, "STUDENT");

    // ===== DEPARTMENTS =====
    Department csDept = createDepartment("Computer Science & Engineering", "CSE", "Prof. Anita Sharma");
    Department eceDept = createDepartment("Electronics & Communication", "ECE", "Prof. Vikram Patel");

    // ===== COURSES =====
    Course btechCS = createCourse("B.Tech Computer Science", "BTCS", csDept.getId(), csDept.getName(), 4);
    Course btechECE = createCourse("B.Tech Electronics", "BTECE", eceDept.getId(), eceDept.getName(), 4);

    // ===== PROGRAMS =====
    Program progCS = createProgram("B.Tech CS 2025", btechCS.getId(), btechCS.getName(), "UG");
    Program progECE = createProgram("B.Tech ECE 2025", btechECE.getId(), btechECE.getName(), "UG");

    // ===== ACADEMIC YEAR =====
    AcademicYear ay = new AcademicYear();
    ay.setName("2025-26");
    ay.setStartDate(LocalDate.of(2025, 7, 1));
    ay.setEndDate(LocalDate.of(2026, 6, 30));
    ay.setCurrent(true);
    ay = academicYearRepo.save(ay);

    // ===== SEMESTERS =====
    Semester sem3 = createSemester("Semester 3", 3, ay.getId(), ay.getName());
    Semester sem4 = createSemester("Semester 4", 4, ay.getId(), ay.getName());

    // ===== SUBJECTS (assigned to faculty) =====
    Subject dsaSub = createSubject("Data Structures & Algorithms", "CS301", csDept, sem3, faculty1, 45);
    Subject dbmsSub = createSubject("Database Management Systems", "CS302", csDept, sem3, faculty1, 40);
    Subject osSub = createSubject("Operating Systems", "CS303", csDept, sem3, faculty2, 42);
    Subject cnSub = createSubject("Computer Networks", "CS304", csDept, sem4, faculty2, 38);
    Subject signalsSub = createSubject("Signals & Systems", "EC301", eceDept, sem3, faculty2, 40);
    Subject vlsiSub = createSubject("VLSI Design", "EC302", eceDept, sem4, faculty1, 35);

    // ===== FACULTY PROFILES =====
    createFacultyProfile(faculty1, csDept, "Associate Professor");
    createFacultyProfile(faculty2, eceDept, "Assistant Professor");

    // ===== STUDENT PROFILES =====
    StudentProfile sp1 = createStudentProfile("CS2025001", student1, csDept, sem3, progCS);
    StudentProfile sp2 = createStudentProfile("CS2025002", student2, csDept, sem3, progCS);
    StudentProfile sp3 = createStudentProfile("CS2025003", student3, csDept, sem3, progCS);
    StudentProfile sp4 = createStudentProfile("EC2025001", student4, eceDept, sem3, progECE);
    StudentProfile sp5 = createStudentProfile("EC2025002", student5, eceDept, sem3, progECE);

    // ===== ATTENDANCE DATA =====
    // We create sessions for the last 20 class days across multiple subjects
    List<Subject> csSubjects = List.of(dsaSub, dbmsSub, osSub);
    List<StudentProfile> csStudents = List.of(sp1, sp2, sp3);
    List<Subject> eceSubjects = List.of(signalsSub);
    List<StudentProfile> eceStudents = List.of(sp4, sp5);
    // Mixed: student 4 & 5 also attend CS303 (OS) as an elective
    String[] statuses = {"PRESENT", "ABSENT", "LATE", "MEDICAL_LEAVE", "AUTHORIZED_LEAVE"};
    Random rng = new Random(42); // deterministic for reproducible data

    LocalDate today = LocalDate.now();
    // Generate 20 class days going backwards, skipping weekends
    List<LocalDate> classDays = new ArrayList<>();
    LocalDate d = today.minusDays(1);
    while (classDays.size() < 20) {
      if (d.getDayOfWeek() != DayOfWeek.SATURDAY && d.getDayOfWeek() != DayOfWeek.SUNDAY) {
        classDays.add(d);
      }
      d = d.minusDays(1);
    }
    Collections.reverse(classDays); // oldest first

    // CS subjects — 3 students
    for (Subject sub : csSubjects) {
      User fac = sub.getFacultyUserId().equals(faculty1.getId()) ? faculty1 : faculty2;
      int lectureNum = 1;
      for (LocalDate date : classDays) {
        AttendanceSession session = createSession(sub, date, lectureNum, fac, csStudents.size());
        int presentCount = 0;
        for (StudentProfile sp : csStudents) {
          String status = weightedStatus(rng, statuses);
          if ("PRESENT".equals(status) || "LATE".equals(status)) presentCount++;
          createRecord(session, sub, sp, date, lectureNum, status, fac);
        }
        session.setPresentCount(presentCount);
        sessionRepo.save(session);
        lectureNum++;
      }
    }

    // ECE subjects — 2 students
    for (Subject sub : eceSubjects) {
      User fac = faculty2;
      int lectureNum = 1;
      for (LocalDate date : classDays) {
        AttendanceSession session = createSession(sub, date, lectureNum, fac, eceStudents.size());
        int presentCount = 0;
        for (StudentProfile sp : eceStudents) {
          String status = weightedStatus(rng, statuses);
          if ("PRESENT".equals(status) || "LATE".equals(status)) presentCount++;
          createRecord(session, sub, sp, date, lectureNum, status, fac);
        }
        session.setPresentCount(presentCount);
        sessionRepo.save(session);
        lectureNum++;
      }
    }

    // Update student attendance stats
    updateStudentStats(sp1, csSubjects);
    updateStudentStats(sp2, csSubjects);
    updateStudentStats(sp3, csSubjects);
    updateStudentStats(sp4, eceSubjects);
    updateStudentStats(sp5, eceSubjects);

    // ===== NOTIFICATIONS =====
    createNotification(null, "ALL", "ANNOUNCEMENT", "Welcome to CAMS",
        "The College Attendance Management System is now live. Please check your dashboards for attendance updates.");
    createNotification(null, "STUDENT", "WARNING", "Attendance Alert",
        "Students below 75% attendance are marked as defaulters. Please maintain regular attendance.");
    createNotification(null, "FACULTY", "INFO", "Attendance Submission Reminder",
        "Please ensure all attendance records are submitted by end of day. Late submissions require admin approval.");
    createNotification(student1.getId(), null, "ALERT", "Low Attendance Warning",
        "Your attendance in CS301 (Data Structures) has dropped below 75%. Please attend all upcoming lectures.");
    createNotification(faculty1.getId(), null, "INFO", "Schedule Update",
        "Your CS302 lecture on Friday has been rescheduled to Room 204.");
    createNotification(admin.getId(), null, "SYSTEM", "System Health Check",
        "All modules operational. Database backup completed successfully at 2:00 AM.");

    // ===== REPORTS =====
    createReport("June 2026 - Week 1", admin.getId(), null, 150, "PDF");
    createReport("June 2026 - Week 2", admin.getId(), null, 180, "EXCEL");
    createReport("Student Report - Rahul Deshmukh", faculty1.getId(), student1.getId(), 45, "PDF");
    createReport("Department Summary - CSE", admin.getId(), null, 200, "API");

    // ===== AUDIT LOGS =====
    createAuditLog("LOGIN", "User", admin.getId().toString(), admin.getId(), admin.getEmail());
    createAuditLog("CREATE", "AttendanceSession", "1", faculty1.getId(), faculty1.getEmail());
    createAuditLog("UPDATE", "StudentProfile", sp1.getId().toString(), admin.getId(), admin.getEmail());
    createAuditLog("CREATE", "Subject", dsaSub.getId().toString(), admin.getId(), admin.getEmail());
    createAuditLog("EXPORT", "Report", "1", admin.getId(), admin.getEmail());

    // ===== ROLES =====
    createRole("ADMIN", "Full system access", List.of("MANAGE_USERS", "MANAGE_DEPARTMENTS", "MANAGE_COURSES", "MANAGE_SUBJECTS", "MANAGE_ATTENDANCE", "VIEW_REPORTS", "MANAGE_SETTINGS", "VIEW_AUDIT_LOGS"));
    createRole("FACULTY", "Faculty access", List.of("TAKE_ATTENDANCE", "VIEW_OWN_SUBJECTS", "VIEW_STUDENT_ATTENDANCE", "GENERATE_REPORTS"));
    createRole("STUDENT", "Student access", List.of("VIEW_OWN_ATTENDANCE", "VIEW_TIMETABLE", "VIEW_NOTIFICATIONS"));

    // ===== PERMISSIONS =====
    String[] permNames = {
      "MANAGE_USERS", "MANAGE_DEPARTMENTS", "MANAGE_COURSES", "MANAGE_SUBJECTS",
      "MANAGE_ATTENDANCE", "VIEW_REPORTS", "MANAGE_SETTINGS", "VIEW_AUDIT_LOGS",
      "TAKE_ATTENDANCE", "VIEW_OWN_SUBJECTS", "VIEW_STUDENT_ATTENDANCE", "GENERATE_REPORTS",
      "VIEW_OWN_ATTENDANCE", "VIEW_TIMETABLE", "VIEW_NOTIFICATIONS"
    };
    for (String pn : permNames) {
      Permission p = new Permission();
      p.setName(pn);
      p.setDescription(pn.replace("_", " ").toLowerCase());
      permissionRepo.save(p);
    }

    // ===== SETTINGS =====
    Setting setting = new Setting();
    setting.setInstitutionName("Maharaja Institute of Technology");
    setting.setDefaulterThreshold(75);
    setting.setCriticalThreshold(60);
    setting.setLecturesPerDay(6);
    setting.setAcademicYear("2025-26");
    settingRepo.save(setting);
  }

  // ===== HELPER METHODS =====

  private User createUser(String name, String email, String encodedPassword, String role) {
    User u = new User();
    u.setDisplayName(name);
    u.setEmail(email);
    u.setPassword(encodedPassword);
    u.setRole(role);
    u.setActive(true);
    u.setEmailVerified(true);
    return userRepo.save(u);
  }

  private Department createDepartment(String name, String code, String head) {
    Department d = new Department();
    d.setName(name);
    d.setCode(code);
    d.setHeadName(head);
    return departmentRepo.save(d);
  }

  private Course createCourse(String name, String code, Long deptId, String deptName, int years) {
    Course c = new Course();
    c.setName(name);
    c.setCode(code);
    c.setDepartmentId(deptId);
    c.setDepartmentName(deptName);
    c.setDurationYears(years);
    return courseRepo.save(c);
  }

  private Program createProgram(String name, Long courseId, String courseName, String level) {
    Program p = new Program();
    p.setName(name);
    p.setCourseId(courseId);
    p.setCourseName(courseName);
    p.setLevel(level);
    return programRepo.save(p);
  }

  private Semester createSemester(String name, int number, Long ayId, String ayName) {
    Semester s = new Semester();
    s.setName(name);
    s.setNumber(number);
    s.setAcademicYearId(ayId);
    s.setAcademicYearName(ayName);
    return semesterRepo.save(s);
  }

  private Subject createSubject(String name, String code, Department dept, Semester sem, User faculty, int lectures) {
    Subject s = new Subject();
    s.setName(name);
    s.setCode(code);
    s.setDepartmentId(dept.getId());
    s.setDepartmentName(dept.getName());
    s.setSemesterId(sem.getId());
    s.setSemesterName(sem.getName());
    s.setFacultyUserId(faculty.getId());
    s.setFacultyName(faculty.getDisplayName());
    s.setTotalLectures(lectures);
    return subjectRepo.save(s);
  }

  private void createFacultyProfile(User user, Department dept, String designation) {
    FacultyProfile fp = new FacultyProfile();
    fp.setName(user.getDisplayName());
    fp.setEmail(user.getEmail());
    fp.setUserId(user.getId());
    fp.setDepartmentId(dept.getId());
    fp.setDepartmentName(dept.getName());
    fp.setDesignation(designation);
    facultyRepo.save(fp);
  }

  private StudentProfile createStudentProfile(String rollNo, User user, Department dept, Semester sem, Program prog) {
    StudentProfile sp = new StudentProfile();
    sp.setRollNumber(rollNo);
    sp.setName(user.getDisplayName());
    sp.setEmail(user.getEmail());
    sp.setUserId(user.getId());
    sp.setDepartmentId(dept.getId());
    sp.setDepartmentName(dept.getName());
    sp.setSemesterId(sem.getId());
    sp.setSemesterName(sem.getName());
    sp.setProgramId(prog.getId());
    sp.setProgramName(prog.getName());
    sp.setAttendancePercentage(0.0);
    sp.setAttendedLectures(0);
    sp.setTotalLectures(0);
    sp.setDefaulter(false);
    return studentRepo.save(sp);
  }

  private AttendanceSession createSession(Subject sub, LocalDate date, int lectureNum, User faculty, int totalStudents) {
    AttendanceSession s = new AttendanceSession();
    s.setSubjectId(sub.getId());
    s.setSubjectName(sub.getName());
    s.setDepartmentId(sub.getDepartmentId());
    s.setSemesterId(sub.getSemesterId());
    s.setDate(date);
    s.setLectureNumber(lectureNum);
    s.setFacultyUserId(faculty.getId());
    s.setFacultyName(faculty.getDisplayName());
    s.setTotalStudents(totalStudents);
    s.setPresentCount(0);
    s.setLocked(true);
    return sessionRepo.save(s);
  }

  private void createRecord(AttendanceSession session, Subject sub, StudentProfile sp,
                             LocalDate date, int lectureNum, String status, User faculty) {
    AttendanceRecord r = new AttendanceRecord();
    r.setSessionId(session.getId());
    r.setSubjectId(sub.getId());
    r.setSubjectName(sub.getName());
    r.setStudentId(sp.getId());
    r.setStudentUserId(sp.getUserId());
    r.setStudentName(sp.getName());
    r.setRollNumber(sp.getRollNumber());
    r.setDate(date);
    r.setLectureNumber(lectureNum);
    r.setStatus(status);
    r.setMarkedBy(faculty.getId());
    r.setMarkedAt(date.atTime(9, 0).toInstant(ZoneOffset.ofHoursMinutes(5, 30)));
    r.setModificationHistory("[]");
    recordRepo.save(r);
  }

  /**
   * Weighted random status: ~60% Present, ~10% Late, ~15% Absent, ~8% Medical, ~7% Authorized
   */
  private String weightedStatus(Random rng, String[] statuses) {
    int roll = rng.nextInt(100);
    if (roll < 60) return "PRESENT";
    if (roll < 70) return "LATE";
    if (roll < 85) return "ABSENT";
    if (roll < 93) return "MEDICAL_LEAVE";
    return "AUTHORIZED_LEAVE";
  }

  private void updateStudentStats(StudentProfile sp, List<Subject> subjects) {
    List<AttendanceRecord> records = recordRepo.findByStudentId(sp.getId());
    int total = records.size();
    int attended = 0;
    for (AttendanceRecord r : records) {
      if ("PRESENT".equals(r.getStatus()) || "LATE".equals(r.getStatus())) {
        attended++;
      }
    }
    double pct = total > 0 ? (attended * 100.0 / total) : 0.0;
    sp.setTotalLectures(total);
    sp.setAttendedLectures(attended);
    sp.setAttendancePercentage(Math.round(pct * 100.0) / 100.0);
    sp.setDefaulter(pct < 75.0);
    studentRepo.save(sp);
  }

  private void createNotification(Long userId, String audience, String type, String title, String message) {
    Notification n = new Notification();
    n.setUserId(userId);
    n.setAudience(audience);
    n.setType(type);
    n.setTitle(title);
    n.setMessage(message);
    n.setRead(false);
    notificationRepo.save(n);
  }

  private void createReport(String period, Long generatedBy, Long studentUserId, int rowCount, String format) {
    ReportMeta r = new ReportMeta();
    r.setPeriod(period);
    r.setGeneratedBy(generatedBy);
    r.setStudentUserId(studentUserId);
    r.setRowCount(rowCount);
    r.setFormat(format);
    r.setGeneratedAt(Instant.now().minusSeconds(3600 * (long)(Math.random() * 72)));
    reportRepo.save(r);
  }

  private void createAuditLog(String action, String entity, String entityId, Long performedBy, String email) {
    AuditLog a = new AuditLog();
    a.setAction(action);
    a.setEntity(entity);
    a.setEntityId(entityId);
    a.setPerformedBy(performedBy);
    a.setPerformedByEmail(email);
    a.setTimestamp(Instant.now().minusSeconds((long)(Math.random() * 86400)));
    auditLogRepo.save(a);
  }

  private Role createRole(String name, String description, List<String> permissions) {
    Role r = new Role();
    r.setName(name);
    r.setDescription(description);
    r.setPermissions(new ArrayList<>(permissions));
    return roleRepo.save(r);
  }
}
