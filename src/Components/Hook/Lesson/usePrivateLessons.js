// src/hooks/usePrivateLessons.js
import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api'; 

const fetchPrivateLessons = async () => {
  const response = await api.get('/lessons/private-lesson-requests/');
  return response.data;
};

const usePrivateLessons = () => {
  return useQuery({
    queryKey: ['private-lessons'],
    queryFn: fetchPrivateLessons,
    staleTime: 1000 * 60 * 5, // البيانات تظل "طازجة" لمدة 5 دقائق
    cacheTime: 1000 * 60 * 30, // تبقى في الكاش لمدة 30 دقيقة
    refetchOnWindowFocus: false, // لا تعيد الجلب عند ترك/العودة للنافذة
  });
};

export default usePrivateLessons;
