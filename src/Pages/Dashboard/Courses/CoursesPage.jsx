import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import useCourses from '../../../Components/Hook/Courses/useCourses';
import { useGetDepartments } from '../../../Components/Hook/Department/useGetDepartments';
import imageCourse from '../../../Assets/default.jpeg';
import FilterSelect from "../../../Components/FilterSelect";
import useScheduleSlots from '../../../Components/Hook/Courses/useScheduleSlots';
import LinearProgress from '@mui/material/LinearProgress';

const CoursesPage = () => {
  const navigate = useNavigate();
  const { data: courseData, isLoading, isError, error } = useCourses();
  const { data: departmentsData } = useGetDepartments();
  const { data: slots = [] } = useScheduleSlots();

  const courses = Array.isArray(courseData) ? courseData : courseData?.courses ?? [];
  const departments = departmentsData?.map(dep => dep.name) ?? [];
  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];

  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [tabValue, setTabValue] = useState(0); // 0: All, 1: In Progress, 2: Others

  useEffect(() => {
    if (courses) {
      setFilteredData(courses);
    }
  }, [courses]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    let updatedData = [...courses];

    if (newFilters.department_name) {
      updatedData = updatedData.filter(
        (course) => course.department_name === newFilters.department_name
      );
    }

    if (newFilters.certification_eligible) {
      updatedData = updatedData.filter(
        (course) =>
          (newFilters.certification_eligible === "Yes" && course.certification_eligible === true) ||
          (newFilters.certification_eligible === "No" && course.certification_eligible === false)
      );
    }

    if (newFilters.category) {
      updatedData = updatedData.filter(
        (course) => course.category === newFilters.category
      );
    }

    setFilteredData(updatedData);
  };

  const getCourseProgress = (courseId) => {
    const relatedSlots = slots.filter(slot => slot.course === courseId);
    const progressValues = relatedSlots.map(slot => slot.course_progress);
    if (progressValues.length === 0) return 0;
    const total = progressValues.reduce((sum, val) => sum + val, 0);
    return Math.round(total / progressValues.length);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // فلترة البيانات حسب التبويب
  const tabFilteredData = filteredData.filter(course => {
    const progress = getCourseProgress(course.id);
    if (tabValue === 1) return progress > 0;         // In Progress
    if (tabValue === 2) return progress === 0;       // Others
    return true;                                     // All Courses
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          mb: 2,
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          My Courses
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <FilterSelect
            filters={[
              {
                label: "Department",
                name: "department_name",
                options: departments,
              },
              {
                label: "Category",
                name: "category",
                options: categories,
              },
              {
                label: "Certification Eligible",
                name: "certification_eligible",
                options: ["Yes", "No"],
              },
            ]}
            onFilterChange={handleFilterChange}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
            onClick={() => navigate('/dashboard/courses/create-course')}
          >
            Create Course
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label="All Courses" />
        <Tab label="In Progress" />
        <Tab label="Others" />
      </Tabs>

      {/* Course List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error">Failed to load courses: {error.message}</Typography>
      ) : tabFilteredData.length === 0 ? (
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'text.secondary',
            gap: 2,
          }}
        >
          <Typography variant="h6" align="center">
No Courses To Display         
 </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {tabFilteredData.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={course.id || index}>
              <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 4 }}>
                <CardMedia
                  component="img"
                  height="230"
                  image={course.image || imageCourse}
                  alt={course.title}
                />
                <CardContent sx={{ minHeight: 240 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={course.department_name}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 'bold', backgroundColor: 'rgb(231 236 253)', color: '#3f51b5' }}
                    />
                    <Chip
                      label={course.course_type_name}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {course.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.description}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Duration: {course.duration} hours
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Certification: {course.certification_eligible ? '✅ Available' : '❌ Not available'}
                  </Typography>

                  {/* <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Course Progress
                    </Typography>
                    <LinearProgress variant="determinate" value={getCourseProgress(course.id)} sx={{ height: 10, borderRadius: 5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {getCourseProgress(course.id)}%
                    </Typography>
                  </Box> */}

                  <Divider sx={{ my: 1, mb: 2, mt: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24 }} />
                      <Typography variant="caption">{course.max_students} students</Typography>
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                      ${course.price}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 2 }}
                    onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CoursesPage;
