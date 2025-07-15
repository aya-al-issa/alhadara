import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData) => {
      const response = await api.post('/courses/courses/', courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
    },
  });
};
