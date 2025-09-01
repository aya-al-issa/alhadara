import { useQuery } from '@tanstack/react-query';
import api from '../../Api/Api';

const fetchScheduleSlots = async () => {
  const response = await api.get('/courses/schedule-slots/');
  return response.data;
};

const useScheduleSlots = () => {
  return useQuery({
    queryKey: ['schedule-slots'],
    queryFn: fetchScheduleSlots,
  });
};

export default useScheduleSlots;
