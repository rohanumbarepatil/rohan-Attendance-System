# Admin Manual

## Dashboard
Live cards (students, faculty, subjects, departments, sessions today, defaulters) and a 14-day attendance trend chart. All values update in real time.

## Master Data
Each sidebar entry (Departments, Courses, Programs, Academic Years, Semesters, Subjects, Faculty, Students, Users, Roles) offers **Add / Edit / Delete / Search / Pagination / Excel export**. Lookup fields auto-fill related names.

### Creating user accounts
1. Firebase Console → Authentication → Add user.
2. App → Users → Add: paste the UID, set name, email, role, active.
3. For faculty/students, also create the matching Faculty/Student record with the same UID in *User UID*.

## Assignments
Assign faculty to subjects and students to semesters; both write audit logs.

## Attendance Monitor
Live table of every session institution-wide with date filter and present/total counts. Admins can unlock locked sessions from Faculty → History when corrections are needed.

## Reports & Analytics
Reports: choose period (daily/weekly/monthly/semester/yearly) and reference date → Generate → PDF/Excel. Analytics: live trend, category pie, subject and faculty charts.

## Settings
Institution name, defaulter/critical thresholds, lectures per day, academic year. **Send System Announcement** broadcasts to everyone or one role (in-app + push).
