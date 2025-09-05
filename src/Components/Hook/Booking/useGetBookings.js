import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useGetBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data } = await api.get('/courses/bookings/');
      return data;
    }
  });
};
