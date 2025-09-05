import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api.js';

const fetchCourses = async () => {
  const response = await api.get('/courses/courses/?lang=ar');
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.results) return response.data.results;
  return [];
};

const useCourses = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    onSuccess: (courses) => {
      // Prefetch تفاصيل الكورسات الموجودة في القائمة
      courses.forEach(course => {
        queryClient.prefetchQuery(
          ['courseDetails', course.id],
          () => api.get(`/courses/courses/${course.id}/`).then(res => res.data)
        );
      });
    },
  });
};

export default useCourses;
