import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import useCourseDetails from '../../../Components/Hook/Courses/useCourseDetails';
import useScheduleSlots from '../../../Components/Hook/Courses/useScheduleSlots'; 
import imageCourse from '../../../Assets/default.jpeg';
import { useNavigate } from 'react-router-dom'; 

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading: loadingCourse, error: courseError } = useCourseDetails(id);
  const { data: slots = [] } = useScheduleSlots();

  if (loadingCourse ) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress/>
      </Box>
    );
  }

  if (courseError) {
    return <Typography color="error">خطأ في تحميل بيانات الكورس: {courseError.message}</Typography>;
  }

  if (!course) {
    return <Typography> Course Not Found .</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* معلومات الكورس */}
      <Typography variant="h4" fontWeight="bold" mb={2}>
        {course.title}
      </Typography>

      <Box
        component="img"
        src={course.image || imageCourse}
        alt={course.title}
        sx={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 2, mb: 3 }}
      />

      <Typography variant="body1" sx={{ mb: 2 }}>
        {course.description}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Chip label={`Department: ${course.department_name}`} color="primary" />
        <Chip label={`Course Type: ${course.course_type_name}`} variant="outlined" />
        <Chip label={`Duration: ${course.duration} Hours`} />
        <Chip
          label={course.certification_eligible ? 'Certification Eligible ✅' : ' Certification Eligible ❌'}
          color={course.certification_eligible ? 'success' : 'default'}
        />

      </Box>
      <Typography>{course.description}</Typography>

      <Divider sx={{ mb: 3 }} />


    </Box>

  );
};

export default CourseDetailsPage;
