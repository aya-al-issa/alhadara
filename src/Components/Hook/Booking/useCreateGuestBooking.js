import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Adjust this import to match your project's api instance path
import api from '../../Api/Api.js';
export const useCreateGuestBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      // ensure times include seconds
      const body = {
        ...payload,
        start_time: payload.start_time && payload.start_time.length === 5 ? `${payload.start_time}:00` : payload.start_time,
        end_time: payload.end_time && payload.end_time.length === 5 ? `${payload.end_time}:00` : payload.end_time
      };
      const res = await api.post('/courses/bookings/create_guest/', body);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries(['halls']);
      qc.invalidateQueries(['bookings']);
    }
  });
};
