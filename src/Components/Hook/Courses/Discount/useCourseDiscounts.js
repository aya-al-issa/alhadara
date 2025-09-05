// src/Components/Hook/Courses/Discount/useCourseDiscounts.js
import { useQuery } from "@tanstack/react-query";
import api from "../../../Api/Api";

const fetchCourseDiscounts = async (courseId) => {
  const response = await api.get("/courses/course-discounts/");
  // فلترة الخصومات الخاصة بالكورس المحدد
  return response.data.filter((discount) => discount.course === parseInt(courseId));
};

export const useCourseDiscounts = (courseId) => {
  return useQuery({
    queryKey: ["course-discounts", courseId],
    queryFn: () => fetchCourseDiscounts(courseId),
    staleTime: 1000 * 60, // 1 دقيقة
    refetchOnWindowFocus: false,
  });
};
