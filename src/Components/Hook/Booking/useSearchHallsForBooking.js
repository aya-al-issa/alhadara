import { useMutation } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useSearchHallsForBooking = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const body = {
        ...payload,
        start_time: payload.start_time && payload.start_time.length === 5 ? `${payload.start_time}:00` : payload.start_time,
        end_time: payload.end_time && payload.end_time.length === 5 ? `${payload.end_time}:00` : payload.end_time
      };
      // الرابط الصحيح
      const res = await api.post('/courses/halls/search-for-booking/', body);
      return res.data;
    }
  });
};
