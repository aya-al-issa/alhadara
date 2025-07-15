// src/Components/Hook/E-Wallet/useRejectDeposit.js
import { useMutation } from '@tanstack/react-query';
import api from '../../Api/Api';

export const useRejectDeposit = () => {
  return useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/core/deposit-requests/${id}/reject/`);
      return res.data;
    },
  });
};
