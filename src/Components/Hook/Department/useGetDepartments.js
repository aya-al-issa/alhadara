// useGetDepartments.js
import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useGetDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get('courses/departments/');
      return response.data;
    },
  });
};
