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
  });
};
