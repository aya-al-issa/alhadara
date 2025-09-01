import { useQueries } from "@tanstack/react-query";
import useScheduleSlots from "./useScheduleSlots";
import api from "../../Api/Api";
import { useUserType } from "../../Context/UserTypeContext";

const fetchFeedback = async (slotId) => {
  const res = await api.get(`/feedback/admin/by-scheduleslot/`, {
    params: { scheduleslot: slotId },
  });
  return res.data;
};

export default function useScheduleSlotsWithFeedback() {
  const { user } = useUserType(); // user.role === 'admin' مثلاً
  const { data: slots, isLoading: slotsLoading, isError, error } = useScheduleSlots();

  // استدعاء useQueries دائماً حتى لو ما كان admin
  const feedbackQueries = useQueries({
    queries: (slots || []).map((slot) => ({
      queryKey: ["feedback", slot.id],
      queryFn: () => fetchFeedback(slot.id),
      enabled: user?.role === "admin", // تنفذ فقط إذا كان admin
    })),
  });

  const slotsWithFeedback = (slots || []).map((slot, index) => ({
    ...slot,
    feedback: feedbackQueries[index]?.data,
    feedbackLoading: feedbackQueries[index]?.isLoading,
  }));

  return { slots: slotsWithFeedback, isLoading: slotsLoading, isError, error };
}
