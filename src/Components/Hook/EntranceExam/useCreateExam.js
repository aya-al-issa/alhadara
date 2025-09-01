// src/Hooks/EntranceExam/useCreateExam.js
import { useMutation } from "@tanstack/react-query";
import api from '../../Api/Api';

const createExam = async (examData) => {
  const { data } = await api.post("/entrance-exam/exams/", examData);
  return data;
};

export const useCreateExam = () => {
  return useMutation({
    mutationFn: createExam,
  });
};
