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
    staleTime: 1000 * 60 * 5, // البيانات تظل "طازجة" لمدة 5 دقائق
    cacheTime: 1000 * 60 * 30, // تبقى في الكاش لمدة 30 دقيقة
    refetchOnWindowFocus: false, // لا تعيد الجلب عند ترك/العودة للنافذة
    
  });
  
};
