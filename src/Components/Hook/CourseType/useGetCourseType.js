// useGetCourseTypes.js
import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useGetCourseTypes = () => {
  return useQuery({
    queryKey: ['course-types'],
    queryFn: async () => {
      const response = await api.get('/courses/course-types/');
      return response.data;
    },
  });
};
