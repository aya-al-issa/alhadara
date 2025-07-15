import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useCreateCourseType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseTypeData) => {
      const response = await api.post('/courses/course-types/', courseTypeData);
      console.log(response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['course-types']);
    },
  });
};
