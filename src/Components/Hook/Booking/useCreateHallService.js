// useCreateHallService.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useCreateHallService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/courses/hall-services/', payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries(['hallServices'])
  });
};
