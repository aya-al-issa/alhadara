import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useGetDepartments } from '../../../Components/Hook/Department/useGetDepartments.js';
import { useGetCourseTypes } from '../../../Components/Hook/CourseType/useGetCourseType.js';
import { useCreateCourse } from '../../../Components/Hook/Courses/useCreateCourse.js';
import { useEffect, useState } from 'react';

const CreateCoursePage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      duration: '',
      max_students: '',
      certification_eligible: false,
      department: '',
      course_type: '',
      category: 'course',
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      console.clear();
      console.log('📝 Form Values:', value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const { data: departments = [], isLoading: isDepartmentsLoading } = useGetDepartments();
  const { data: courseTypes = [], isLoading: isTypesLoading } = useGetCourseTypes();
  const createCourseMutation = useCreateCourse();

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = (data) => {
    setErrorMessage('');

    // تحقق أن نوع الكورس ينتمي للقسم
    const selectedType = courseTypes.find((type) => type.id === data.course_type);
    if (selectedType && selectedType.department !== data.department) {
      setErrorMessage('The selected course type does not belong to the specified department');
      return;
    }

    // إذا كل شيء تمام، نرسل البيانات
    createCourseMutation.mutate(data, {
      onSuccess: () => {
        reset();
        navigate('/dashboard/courses');
      },
      onError: () => {
        setErrorMessage('Please check your data: Failed');
      },
    });
  };

  const selectedDepartment = watch('department');
  const filteredCourseTypes = courseTypes.filter(
    (type) => type.department === selectedDepartment
  );

  // عند تغيير القسم نعيد تعيين نوع الكورس
  useEffect(() => {
    setValue('course_type', '');
  }, [selectedDepartment, setValue]);

  return (
    <Box sx={{ display: 'flex', p: 4 }}>
      <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
          Create New Course
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h7" gutterBottom>
            Course Name
          </Typography>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Please enter the course name' }}
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                placeholder="Enter Course Name"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...field}
              />
            )}
          />

          <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
            Description
          </Typography>
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Please enter a description' }}
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                multiline
                rows={3}
                placeholder="Enter Description"
                error={!!errors.description}
                helperText={errors.description?.message}
                {...field}
              />
            )}
          />

          <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
            Price
          </Typography>
          <Controller
            name="price"
            control={control}
            rules={{
              required: 'Price is required',
              min: { value: 0.01, message: 'Price must be positive' },
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: 'Only up to 2 decimal places allowed',
              },
            }}
            render={({ field }) => (
              <TextField
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                variant="outlined"
                fullWidth
                margin="dense"
                placeholder="Price"
                error={!!errors.price}
                helperText={errors.price?.message}
                {...field}
              />
            )}
          />


          <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
            Duration
          </Typography>
          <Controller
            name="duration"
            control={control}
            rules={{
              required: 'Duration is required',
              min: { value: 1, message: 'Duration must be at least 1 hour' },
            }}
            render={({ field }) => (
              <TextField
                type="number"
                inputProps={{ min: '1' }}
                variant="outlined"
                fullWidth
                margin="dense"
                placeholder="Duration (in hours)"
                error={!!errors.duration}
                helperText={errors.duration?.message}
                {...field}
              />
            )}
          />


          <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
            Max Students
          </Typography>
          <Controller
            name="max_students"
            control={control}
            rules={{
              required: 'Max students is required',
              min: { value: 1, message: 'Max students must be positive' },
              validate: (value) =>
                !isNaN(value) || 'Max students must be a valid number',
            }}
            render={({ field }) => (
              <TextField
                type="number"
                inputProps={{ min: '1' }}
                variant="outlined"
                fullWidth
                margin="dense"
                placeholder="Max Students"
                error={!!errors.max_students}
                helperText={errors.max_students?.message}
                {...field}
              />
            )}
          />

          <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
            Department
          </Typography>
          <Controller
            name="department"
            control={control}
            rules={{ required: 'Please select a department' }}
            render={({ field }) => (
              <TextField
                select
                variant="outlined"
                fullWidth
                margin="dense"
                placeholder="Select Department"
                error={!!errors.department}
                helperText={errors.department?.message}
                {...field}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
            Course Type
          </Typography>
          <Controller
            name="course_type"
            control={control}
            rules={{ required: 'Please select a course type' }}
            render={({ field }) => (
              <FormControl fullWidth margin="dense" error={!!errors.course_type}>
                <InputLabel id="type-label">Course Type</InputLabel>
                <Select
                  labelId="type-label"
                  {...field}
                  value={field.value || ''}
                >
                  {filteredCourseTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.course_type && (
                  <Typography color="error" variant="caption">
                    {errors.course_type.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="certification_eligible"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Certification Eligible"
                sx={{ mt: 2 }}
              />
            )}
          />

          <Box sx={{ textAlign: 'right', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={createCourseMutation.isLoading}
              sx={{ borderRadius: '20px', textTransform: 'none' }}
            >
              {createCourseMutation.isLoading ? 'Creating...' : 'Create Course'}
            </Button>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCoursePage;
