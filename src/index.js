import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './Components/Context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserTypeProvider } from './Components/Context/UserTypeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SidebarProvider } from './Components/Context/SidebarContext';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import { getTheme, createEmotionCache } from './theme/theme';
import { useSelector } from 'react-redux';
import './i18n/i18n'; // 🟢 استدعاء i18n هنا
import { Provider } from 'react-redux';
import { store } from './store'; // عدّلي المسار
const queryClient = new QueryClient();

const cache = createEmotionCache();
const theme = getTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SidebarProvider>
            <QueryClientProvider client={queryClient}>
              <UserTypeProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </UserTypeProvider>
            </QueryClientProvider>
          </SidebarProvider>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);

