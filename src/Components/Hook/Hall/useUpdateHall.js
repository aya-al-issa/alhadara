import { useMutation } from '@tanstack/react-query';
import api from '../../Api/Api';

export const useUpdateHall = () => {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/courses/halls/${id}/`, data);
      return response.data;
    },
    onError: (error) => {
      console.error('❌ Error updating hall:', error);
    }
  });
};
