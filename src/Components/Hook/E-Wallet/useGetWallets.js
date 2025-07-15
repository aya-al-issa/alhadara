// src/hooks/useGetWallets.js
import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api';

export const useGetWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await api.get('core/wallets/');
      return response.data;
    },
    
  });
  
};
