// src/Components/Hook/Department/useCreateDepartment.js
import { useMutation } from '@tanstack/react-query';
import api from '../../Api/Api.js'; // تأكد من المسار حسب مشروعك

export const useCreateDepartment = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/courses/departments/', formData);
      return response.data;
    },
  });
};
