// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import notificationReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    notifications: notificationReducer,  // مفتاح 'notifications' بالضبط
  },
});
