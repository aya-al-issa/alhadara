import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useLogin(onSuccessCallback, onErrorCallback) {
  return useMutation({
    mutationFn: (data) =>
      axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', data)
        .then(res => res.data),

    onSuccess: (data) => {
      Cookies.set('token', data.access, { secure: true, sameSite: 'Strict' });
      Cookies.set('user_type', data.user_type, { secure: true, sameSite: 'Strict' });
      Cookies.set('refresh', data.refresh, { secure: true, sameSite: 'Strict' });


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
