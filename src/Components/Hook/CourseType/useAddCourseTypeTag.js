// src/Components/Hook/CourseType/useAddCourseTypeTag.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Api/Api';

export const useAddCourseTypeTag = (courseTypeId) => {
  const queryClient = useQueryClient();

  return useMutation(
    (interestId) => api.post(`/courses/course-types/${courseTypeId}/add_tag/`, { interest_id: interestId }),
    {
      onSuccess: () => {
        // إعادة جلب الكورس تايب لتحديث الـ tags
        queryClient.invalidateQueries(['course-types']);
      },
    }
  );
};
