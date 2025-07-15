// useGetSingleDepartment.js
import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api.js';  // استورد api مع interceptor

const fetchDepartmentById = async (id) => {
  const response = await api.get(`courses/departments/${id}/`);
  return response.data;
};

export const useGetSingleDepartment = (id) => {
  return useQuery({
    queryKey: ['singleDepartment', id],
    queryFn: () => fetchDepartmentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
