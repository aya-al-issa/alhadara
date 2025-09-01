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
    enabled: !!id, // لا يجلب البيانات إلا إذا كان الـ id موجود
  });
};

export default useCourseDetails;
