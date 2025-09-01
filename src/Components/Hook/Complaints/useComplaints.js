import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api';

const fetchComplaints = async ({ queryKey }) => {
  const [_key, { status, type }] = queryKey;
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (type) params.append("type", type);

  const res = await api.get(`/complaints/complaints/?${params.toString()}`);
  return res.data;
};

export default function useComplaints(filters) {
  return useQuery({
    queryKey: ['complaints', filters],
    queryFn: fetchComplaints,
    staleTime: 1000 * 60 * 5,
  });
}
