// src/Components/Hook/EntranceExam/useCreateQuestionBank.js
import { useMutation } from '@tanstack/react-query';
import api from '../../Api/Api';

// الدالة التي ترسل البيانات إلى السيرفر
export const useCreateQuestionBank = () => {
  return useMutation({
    mutationFn: async (questions) => {
      // إرسال الداتا للـ endpoint bulk_create
      const response = await api.post("/entrance-exam/questionbanks/bulk_create/", questions);
      return response.data;
    },
  });
};