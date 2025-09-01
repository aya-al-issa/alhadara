import React, { useMemo, useState } from "react";
import { Box, CircularProgress, Typography,Button } from "@mui/material";
import { useGetExams } from "../../../Components/Hook/EntranceExam/useGetExams";
import ExamCard from "../../../Components/Card/ExamCard";
import FilterSelect from "../../../Components/FilterSelect"; // استدعاء الكومبوننت
import { useNavigate } from "react-router-dom"; // ✅ استدعاء useNavigate

const ExamPage = () => {
  const { data: exams, isLoading, isError } = useGetExams();
  const [filters, setFilters] = useState({});
  const navigate = useNavigate(); // ✅ إنشاء الـ navigate

  // استخراج اللغات والمعلمين
  const languages = useMemo(() => (exams ? [...new Set(exams.map(e => e.language_name))] : []), [exams]);
  const teachers = useMemo(() => (exams ? [...new Set(exams.map(e => e.grading_teacher_name))] : []), [exams]);

  // إعداد الفلترات للكومبوننت
  const filterOptions = [
    { name: "language", label: "Language", options: languages },
    { name: "teacher", label: "Teacher", options: teachers }
  ];

  // تطبيق الفلترة
  const filteredExams = useMemo(() => {
    if (!exams) return [];
    return exams.filter(exam => {
      const langMatch = filters.language ? exam.language_name === filters.language : true;
      const teacherMatch = filters.teacher ? exam.grading_teacher_name === filters.teacher : true;
      return langMatch && teacherMatch;
    });
  }, [exams, filters]);

  if (isLoading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  if (isError) return <Box textAlign="center" py={6}><Typography color="error">Failed to load exams!</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>Entrance Exams 📚</Typography>
<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
  <Button
    variant="contained"
    color="primary"
    sx={{ borderRadius: "20px", textTransform: "none" }}
    onClick={() => navigate("/dashboard/EntranceExam/create")}
  >
    Create Entrance Exam
  </Button>
  <Button
    variant="contained"
    color="primary"
    sx={{ borderRadius: "20px", textTransform: "none" }}
    onClick={() => navigate("/dashboard/qb")}
  >
    Create Question Bank
  </Button>
</Box>
      {/* فلترة باستخدام كومبوننت FilterSelect */}
      <FilterSelect filters={filterOptions} onFilterChange={setFilters} />

      {/* قائمة الكروت */}
      <Box mt={3}>
        {filteredExams.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No exams found.
          </Typography>
        ) : (
          filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default ExamPage;
