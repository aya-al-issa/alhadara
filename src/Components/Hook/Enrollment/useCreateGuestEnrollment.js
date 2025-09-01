// src/hooks/useCreateGuestEnrollment.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api';


const useCreateGuestEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guestData) => api.post('/courses/enrollments/create_guest/', guestData),
    onSuccess: () => {
      // بعد الإضافة، نعيد تحديث بيانات قائمة الشيفتات أو الاستعلامات المطلوبة
      queryClient.invalidateQueries(['create_guest']);
    },
  });
};

export default useCreateGuestEnrollment;
