// src/hooks/useLogin.js
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import api from '../Api/Api'; // ✅ استخدم instance الجاهزة

export function useLogin(onSuccessCallback, onErrorCallback) {
  return useMutation({
    mutationFn: (data) =>
      api.post('/auth/jwt/create/', data).then(res => res.data), // ✅ api بدل axios

    onSuccess: (data) => {
      Cookies.set('token', data.access, { secure: true, sameSite: 'Strict' });
      Cookies.set('refresh', data.refresh, { secure: true, sameSite: 'Strict' }); // ✅ توحيد الاسم
      Cookies.set('user_type', data.user_type, { secure: true, sameSite: 'Strict' });

      if (onSuccessCallback) onSuccessCallback(data);
    },

    onError: (error) => {
      if (onErrorCallback) {
        const msg = error.response?.data?.detail || 'فشل تسجيل الدخول: تحقق من البيانات';
        onErrorCallback(msg);
      }
    }
  });
}
