// src/hooks/Enrollment/useEnrollments.js
import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api'; 

const useEnrollments = () => {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const response = await api.get('/courses/enrollments/');
      return response.data;
    },
  });
};

export default useEnrollments;
