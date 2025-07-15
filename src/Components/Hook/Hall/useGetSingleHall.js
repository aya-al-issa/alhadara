import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api';

export const useGetSingleHall = (id) => {
  return useQuery({
    queryKey: ['hall', id],
    queryFn: async () => {
      const response = await api.get(`/courses/halls/${id}/`);
      return response.data;
    },
    enabled: !!id, // حتى لا ينفذ الطلب بدون ID
  });
};
