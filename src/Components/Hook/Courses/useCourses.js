import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api.js';

const fetchCourses = async () => {
  const response = await api.get('/courses/courses/');
  return response.data.results || response.data; 
};

const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
};

export default useCourses;
