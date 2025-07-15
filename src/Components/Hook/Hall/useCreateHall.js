// src/hooks/useCreateHall.js
import { useMutation } from '@tanstack/react-query';
import api from '../../Api/Api.js'; // ✅ استيراد api الموحد

export const useCreateHall = (onSuccessCallback) => {
  return useMutation({
    mutationFn: async (hallData) => {
      // ✅ استخدام instance الموحد بدون إعادة التوكن
      const response = await api.post('/courses/halls/', hallData);
      return response.data;
    },
    onSuccess: (_, __, context) => {
      // ✅ استدعاء الـ callback إذا تم تمريره
      if (typeof onSuccessCallback === 'function') {
        onSuccessCallback(context);
      }
    },
    onError: (error) => {
      console.error('❌ Error creating hall:', error);
    }
  });
};
