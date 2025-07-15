// src/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ طلب يحمل التوكن
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

// ✅ التعامل مع انتهاء التوكن
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      Cookies.get('refresh_token')
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'JWT ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;
      const refreshToken = Cookies.get('refresh_token');

      try {
        const res = await axios.post('http://127.0.0.1:8000/api/auth/jwt/refresh/', {
          refresh: refreshToken,
        });

        const newAccess = res.data.access;
        Cookies.set('token', newAccess, { secure: true, sameSite: 'strict' });
        api.defaults.headers.common['Authorization'] = 'JWT ' + newAccess;
        processQueue(null, newAccess);
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        // إزالة الكوكيز وتسجيل الخروج
        Cookies.remove('token');
        Cookies.remove('refresh_token');
        Cookies.remove('user_type');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
