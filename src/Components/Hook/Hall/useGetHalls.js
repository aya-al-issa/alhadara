// src/Components/Hook/Hall/useGetHalls.js
import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useGetHalls = () => {
  return useQuery({
    queryKey: ['halls'],
    queryFn: async () => {
      const response = await api.get('/courses/halls/');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // البيانات تظل "طازجة" لمدة 5 دقائق
    cacheTime: 1000 * 60 * 30, // تبقى في الكاش لمدة 30 دقيقة
    refetchOnWindowFocus: false, // لا تعيد الجلب عند ترك/العودة للنافذة
  });
};
