import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api'; // تأكد من المسار الصحيح حسب مشروعك

const fetchDepositRequests = async () => {
  const response = await api.get('/core/deposit-requests/');
  return response.data;
};

export const useDepositRequests = () => {
  return useQuery({
    queryKey: ['depositRequests'],
    queryFn: fetchDepositRequests,
  });
};
