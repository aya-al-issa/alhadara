// useUpdateDepartment.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api.js';  // استورد api مع interceptor

const updateDepartment = async ({ id, ...data }) => {
  const response = await api.put(`courses/departments/${id}/`, data);
  return response.data;
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
    },
    onError: (error) => {
      console.error('فشل التحديث:', error);
    },
  });
};
