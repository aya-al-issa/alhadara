import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../Api/Api";

export const useUploadDepartmentIcon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, file }) => {
      const formData = new FormData();
      formData.append("department", departmentId);
      formData.append("image", file);

      const res = await api.post("/courses/department-icon/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      // إعادة جلب الأقسام بعد رفع الصورة
      queryClient.invalidateQueries(["departments"]);
    },
  });
};

export const useUpdateDepartmentIcon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ iconId, file }) => {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.patch(`/courses/department-icon/${iconId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
  });
};
