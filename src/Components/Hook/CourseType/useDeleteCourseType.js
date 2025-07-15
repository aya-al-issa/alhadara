// useDeleteCourseType.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api';

export const useDeleteCourseType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/courses/course-types/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['course-types']);
    },
  });
};
