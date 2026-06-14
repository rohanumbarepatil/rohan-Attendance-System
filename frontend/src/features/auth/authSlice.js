import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './authService';

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const user = await authService.login(email, password);
    const profile = await authService.fetchProfile(user.uid);
    if (!profile) throw new Error('No user profile found. Contact your administrator.');
    if (profile.active === false) throw new Error('Your account has been deactivated.');
    await authService.touchLastLogin(user.uid);
    return {
      user: { uid: user.uid, email: user.email, emailVerified: user.emailVerified },
      profile,
    };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (email, { rejectWithValue }) => {
  try {
    await authService.resetPassword(email);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

/** Restores the session on page load using the Firebase auth observer. */
export const observeAuth = () => (dispatch) =>
  authService.observe(async (user) => {
    if (user) {
      const profile = await authService.fetchProfile(user.uid);
      dispatch(sessionRestored({
        user: { uid: user.uid, email: user.email, emailVerified: user.emailVerified },
        profile,
      }));
    } else {
      dispatch(sessionCleared());
    }
  });

const initialState = {
  user: null,
  profile: null,
  initialized: false,
  loading: false,
  error: null,
  resetSent: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionRestored(state, action) {
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      state.initialized = true;
    },
    sessionCleared(state) {
      state.user = null;
      state.profile = null;
      state.initialized = true;
    },
    clearError(state) {
      state.error = null;
      state.resetSent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
      })
      .addCase(resetPassword.fulfilled, (state) => { state.resetSent = true; })
      .addCase(resetPassword.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { sessionRestored, sessionCleared, clearError } = authSlice.actions;
export default authSlice.reducer;
