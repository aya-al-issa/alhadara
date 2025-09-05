import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../Api/Api";

export const useApproveBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId) => {
      const { data } = await api.post(`/courses/bookings/${bookingId}/approve/`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: () => {
      queryClient.invalidateQueries(["bookings"]);
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId) => {
      const { data } = await api.post(`/courses/bookings/${bookingId}/cancel/`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: () => {
      queryClient.invalidateQueries(["bookings"]);
    },
  });
};
