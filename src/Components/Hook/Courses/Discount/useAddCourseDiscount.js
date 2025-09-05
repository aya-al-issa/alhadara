// src/Components/Hook/Courses/useAddCourseDiscount.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../Api/Api";

const addCourseDiscount = async (data) => {
  const response = await api.post("/courses/course-discounts/", data);
  return response.data;
};

export const useAddCourseDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCourseDiscount,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["course-discounts", data.course]);
    },
    onError: (error) => {
      console.error("Failed to add discount:", error);
    },
  });
};