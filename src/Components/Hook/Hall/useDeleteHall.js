// src/Components/Hook/Hall/useDeleteHall.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useDeleteHall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/courses/halls/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['halls']);
    },
    onError: (error) => {
      console.error('فشل حذف الصالة:', error);
    }
  });
};
