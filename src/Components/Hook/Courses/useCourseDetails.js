import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api.js';

const fetchCourseDetails = async (id) => {
  const response = await api.get(`/courses/courses/${id}/`);
  return response.data;
};

const useCourseDetails = (id) => {
  return useQuery({
    queryKey: ['courseDetails', id],
    queryFn: () => fetchCourseDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,  // 5 دقائق قبل اعتبارها قديمة
    cacheTime: 30 * 60 * 1000, // 30 دقيقة تبقى في الكاش
  });
};

export default useCourseDetails;
