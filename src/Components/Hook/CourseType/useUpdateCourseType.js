// src/Components/Hook/CourseType/useUpdateCourseType.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api';

export const useUpdateCourseType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/courses/course-types/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['course-types']);
    },
  });
};
