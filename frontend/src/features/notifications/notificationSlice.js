import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unread: 0 },
  reducers: {
    notificationsUpdated(state, action) {
      state.items = action.payload;
      state.unread = action.payload.filter((n) => !n.read).length;
    },
  },
});

export const { notificationsUpdated } = notificationSlice.actions;
export default notificationSlice.reducer;
