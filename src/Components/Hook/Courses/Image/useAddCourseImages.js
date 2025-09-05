// src/Components/Hook/Courses/useAddCourseImages.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../Api/Api"; // عندك axios instance جاهز

const addCourseImages = async (formData) => {
  // formData لازم يكون نوعه FormData
  const response = await api.post("/courses/course-images/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useAddCourseImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCourseImages,
    onSuccess: (data) => {
      // اعمل invalidate للكورسات أو صور الكورس لحتى تنعاد جلب
      queryClient.invalidateQueries(["courses"]);
      queryClient.invalidateQueries(["course-images", data.course]);
    },
  });
};
