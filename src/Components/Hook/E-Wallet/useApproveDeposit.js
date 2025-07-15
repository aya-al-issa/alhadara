// useApproveDeposit.js
import { useMutation } from '@tanstack/react-query';
import api from '../../Api/Api';

export const useApproveDeposit = () => {
  return useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/core/deposit-requests/${id}/approve/`);
      return res.data;
    },
  });
};
