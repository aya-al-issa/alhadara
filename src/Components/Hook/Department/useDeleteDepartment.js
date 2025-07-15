import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api.js'; // تأكد من المسار حسب مشروعك

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/courses/departments/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      // إعادة تحميل الأقسام تلقائيًا
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};
