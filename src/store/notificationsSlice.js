// src/store/notificationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../Components/Api/Api';

// جلب الإشعارات
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await api.get(`/core/notifications/`);
    return response.data;
  }
);

export const markAsReadApi = createAsyncThunk(
  'notifications/markAsReadApi',
  async (id) => {
    await api.post(`/core/notifications/${id}/mark_read/`);
    return id;
  }
);

// جعل كل الإشعارات مقروءة
export const markAllAsReadApi = createAsyncThunk(
  'notifications/markAllAsReadApi',
  async () => {
    await api.post(`/core/notifications/mark_all_read/`);
    return true;
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  isOpen: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    toggleMenu(state) {
      state.isOpen = !state.isOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.is_read).length;
      })
      .addCase(markAsReadApi.fulfilled, (state, action) => {
        const id = action.payload;
        const index = state.notifications.findIndex(n => n.id === id);
        if (index !== -1 && !state.notifications[index].is_read) {
          state.notifications[index].is_read = true;
          state.unreadCount -= 1;
        }
      })
      .addCase(markAllAsReadApi.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({
          ...n,
          is_read: true,
        }));
        state.unreadCount = 0;
      });
  },
});

export const { toggleMenu } = notificationsSlice.actions;
export default notificationsSlice.reducer;