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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import useCourses from '../../../Components/Hook/Courses/useCourses';
import { useGetDepartments } from '../../../Components/Hook/Department/useGetDepartments';
import imageCourse from '../../../Assets/default.jpeg';
import FilterSelect from "../../../Components/FilterSelect";

const CoursesPage = () => {
  const navigate = useNavigate();
  const { data: courseData, isLoading, isError, error } = useCourses();
  const { data: departmentsData } = useGetDepartments();

  const courses = Array.isArray(courseData) ? courseData : courseData?.courses ?? [];
  const departments = departmentsData?.map(dep => dep.name) ?? [];
  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];

  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});

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

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          mb: 4,
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Courses
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mb: 2,
            }}
          >
            {/* الفلاتر */}
            <Box sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              width: { xs: "100%", sm: "auto" },
            }}>
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
            </Box>
          </Box>

          {/* زر الإنشاء */}
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

      {/* Course List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error">Failed to load courses: {error.message}</Typography>
      ) : filteredData.length === 0 ? (
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
            لا يوجد كورسات تطابق الفلاتر.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredData.map((course, index) => (
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
