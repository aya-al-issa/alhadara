import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api';

export default function useResolveComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, resolution_notes, priority, status }) => {
      const response = await api.put(`/complaints/complaints/${id}/`, {
        resolution_notes,
        priority,
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['complaints']);
    },
    onError: (err) => {
      console.error('Failed to resolve complaint:', err);
    },
  });
}
