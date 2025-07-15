// src/hooks/useTransactions.js
import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api';

const fetchTransactions = async () => {
  const res = await api.get('/core/transactions/');
  return res.data;
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
};
