import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceService } from './attendanceService';

export const submitAttendance = createAsyncThunk(
  'attendance/submit',
  async (payload, { rejectWithValue }) => {
    try {
      return await attendanceService.createSession(payload);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const loadFacultySessions = createAsyncThunk(
  'attendance/loadFacultySessions',
  async (facultyUserId, { rejectWithValue }) => {
    try {
      return await attendanceService.getSessionsByFaculty(facultyUserId);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { sessions: [], records: [], loading: false, submitting: false, error: null, lastSessionId: null },
  reducers: {
    recordsUpdated(state, action) { state.records = action.payload; },
    clearAttendanceError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAttendance.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(submitAttendance.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastSessionId = action.payload;
      })
      .addCase(submitAttendance.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(loadFacultySessions.pending, (state) => { state.loading = true; })
      .addCase(loadFacultySessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(loadFacultySessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { recordsUpdated, clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
