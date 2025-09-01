// 📁 Components/Hook/Lesson/useProposeLesson.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api';

const useProposeLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      api.post(`/lessons/private-lesson-requests/${id}/propose-option/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['private-lessons']);
    },
  });
};

export default useProposeLesson;
