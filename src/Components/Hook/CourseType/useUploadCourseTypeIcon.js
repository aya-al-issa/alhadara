// src/Components/Hook/CourseType/useUploadCourseTypeIcon.js
import { useMutation,useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api';

export const useUploadCourseTypeIcon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseTypeId, file }) => {
      const formData = new FormData();
      formData.append("course_type", courseTypeId);
      formData.append("image", file);

      const res = await api.post("/courses/course-type-icon/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      // إعادة جلب الأقسام بعد رفع الصورة
      queryClient.invalidateQueries(["course-types"]);
    },
  });
};
export const useUpdateCourseTypeIcon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ iconId, file }) => {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.patch(`/courses/course-type-icon/${iconId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["course-types"]);
    },
  });
};
