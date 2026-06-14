import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    notifications: notificationReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});
