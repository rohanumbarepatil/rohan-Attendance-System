import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: { students: 0, faculty: 0, subjects: 0, departments: 0, sessionsToday: 0, defaulters: 0 },
    trend: [],
  },
  reducers: {
    statsUpdated(state, action) {
      state.stats = { ...state.stats, ...action.payload };
    },
    trendUpdated(state, action) {
      state.trend = action.payload;
    },
  },
});

export const { statsUpdated, trendUpdated } = dashboardSlice.actions;
export default dashboardSlice.reducer;
