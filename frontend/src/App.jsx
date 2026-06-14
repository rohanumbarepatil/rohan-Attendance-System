import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { observeAuth } from './features/auth/authSlice';
import { ROLES } from './constants';
import ProtectedRoute from './components/guards/ProtectedRoute';
import RoleRoute from './components/guards/RoleRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './features/auth/pages/LoginPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import EntityManagerPage from './features/admin/pages/EntityManagerPage';
import AssignmentsPage from './features/admin/pages/AssignmentsPage';
import SettingsPage from './features/admin/pages/SettingsPage';
import AttendanceMonitorPage from './features/admin/pages/AttendanceMonitorPage';
import FacultyDashboard from './features/faculty/pages/FacultyDashboard';
import MarkAttendancePage from './features/faculty/pages/MarkAttendancePage';
import AttendanceHistoryPage from './features/faculty/pages/AttendanceHistoryPage';
import DefaultersPage from './features/faculty/pages/DefaultersPage';
import StudentSearchPage from './features/faculty/pages/StudentSearchPage';
import StudentDashboard from './features/student/pages/StudentDashboard';
import MyAttendancePage from './features/student/pages/MyAttendancePage';
import ProfilePage from './features/student/pages/ProfilePage';
import NotificationsPage from './features/notifications/pages/NotificationsPage';
import ReportsPage from './features/reports/pages/ReportsPage';
import AnalyticsPage from './features/reports/pages/AnalyticsPage';
import { entityConfigs } from './features/admin/entityConfigs';

function HomeRedirect() {
  const { profile } = useSelector((s) => s.auth);
  if (profile?.role === ROLES.ADMIN) return <Navigate to="/admin" replace />;
  if (profile?.role === ROLES.FACULTY) return <Navigate to="/faculty" replace />;
  return <Navigate to="/student" replace />;
}

export default function App() {
  const dispatch = useDispatch();
  const { initialized } = useSelector((s) => s.auth);

  useEffect(() => {
    const unsubscribe = dispatch(observeAuth());
    return unsubscribe;
  }, [dispatch]);

  if (!initialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<RoleRoute roles={[ROLES.ADMIN]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {Object.keys(entityConfigs).map((key) => (
              <Route key={key} path={`/admin/${key}`} element={<EntityManagerPage entityKey={key} />} />
            ))}
            <Route path="/admin/assignments" element={<AssignmentsPage />} />
            <Route path="/admin/attendance" element={<AttendanceMonitorPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          <Route element={<RoleRoute roles={[ROLES.FACULTY, ROLES.ADMIN]} />}>
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/mark-attendance" element={<MarkAttendancePage />} />
            <Route path="/faculty/history" element={<AttendanceHistoryPage />} />
            <Route path="/faculty/defaulters" element={<DefaultersPage />} />
            <Route path="/faculty/students" element={<StudentSearchPage />} />
            <Route path="/faculty/reports" element={<ReportsPage />} />
          </Route>

          <Route element={<RoleRoute roles={[ROLES.STUDENT]} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/attendance" element={<MyAttendancePage />} />
            <Route path="/student/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
