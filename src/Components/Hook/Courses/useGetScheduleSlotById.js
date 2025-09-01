import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api.js';

const fetchScheduleSlotById = async (id) => {
  const response = await api.get(`/courses/schedule-slots/${id}/`);
  return response.data;
};

const useScheduleSlotById = (id) => {
  return useQuery({
    queryKey: ['schedule-slot', id],
    queryFn: () => fetchScheduleSlotById(id),
    enabled: !!id, // فقط يشغل الهوك إذا كان فيه id
  });
};

export default useScheduleSlotById;
