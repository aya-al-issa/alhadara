// src/Hooks/EntranceExam/useLanguages.js
import { useQuery } from "@tanstack/react-query";
import api from '../../Api/Api';

const fetchLanguages = async () => {
  const { data } = await api.get("/entrance-exam/languages/");
  return data;
};

export const useLanguages = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
  });
};
