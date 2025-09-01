// src/theme/theme.js
import { createTheme } from '@mui/material/styles';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// ⚙️ RTL Cache
export const createEmotionCache = (isRTL) =>
  createCache({
    key: isRTL ? 'mui-rtl' : 'mui',
    stylisPlugins: isRTL ? [prefixer, rtlPlugin] : [],
  });

// 🎨 MUI Theme Factory
export const getTheme = (isRTL) =>
  createTheme({
    direction: isRTL ? 'rtl' : 'ltr',
    typography: {
      fontFamily: isRTL ? 'Cairo, sans-serif' : 'Roboto, sans-serif',
    },
    // بإمكانك تضيف ألوان أو تعديلات ثانية هنا
  });
