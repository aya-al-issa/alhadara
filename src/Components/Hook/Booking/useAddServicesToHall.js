import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api.js';

export const useAddServicesToHall = (hallId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ serviceIds }) => {
      const res = await api.post(`/courses/halls/${hallId}/add-services/`, { service_ids: serviceIds });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries(['halls']);
      qc.invalidateQueries(['hallServices']);
    }
  });
};