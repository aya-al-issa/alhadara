// src/hooks/useConfirmLesson.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api'; 

const useConfirmLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      api.post(`/lessons/private-lesson-requests/${id}/confirm/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['private-lessons']);
    },
  });
};

export default useConfirmLesson;
