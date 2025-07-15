import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api'; // استيراد api الخاص بك

export const fetchProfiles = async () => {
  const { data } = await api.get('/core/profiles/');
  return data;
};

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};