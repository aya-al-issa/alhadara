
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api'; 

const useCancelLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      api.post(`/lessons/private-lesson-requests/${id}/cancel/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['private-lessons']);
    },
  });
};

export default useCancelLesson;

