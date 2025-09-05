// useGetHallServices.jsx
import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useGetHallServices = () => {
  return useQuery({
    queryKey: ['hallServices'],
    queryFn: async () => {
      const res = await api.get('/courses/hall-services');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
