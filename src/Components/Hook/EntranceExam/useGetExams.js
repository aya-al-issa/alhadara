// src/hooks/EntranceExam/useGetExams.js
import { useQuery } from "@tanstack/react-query";
import api from '../../Api/Api';

export const useGetExams = () => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data } = await api.get("/entrance-exam/exams/");
      return data;
    },
  });
};