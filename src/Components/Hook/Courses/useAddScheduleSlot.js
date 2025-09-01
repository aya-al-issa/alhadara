import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api';

const useAddScheduleSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSlotData) => api.post('/courses/schedule-slots/', newSlotData),
    onSuccess: () => {
      // بعد الإضافة، نعيد تحديث بيانات قائمة الشيفتات
      queryClient.invalidateQueries(['schedule-slots']);
    },
  });
};

export default useAddScheduleSlot;
