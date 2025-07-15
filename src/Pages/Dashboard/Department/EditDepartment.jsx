import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSingleDepartment } from '../../../Components/Hook/Department/useGetSingleDepartment';
import { useUpdateDepartment } from '../../../Components/Hook/Department/useUpdateDepartment';

const EditDepartment = () => {
  const { id } = useParams(); // 🔑 جلب ID القسم من رابط الصفحة
  const navigate = useNavigate();

  const { data: department, isLoading } = useGetSingleDepartment(id);
  const {
    mutate: updateDepartment,
    isPending,
    isSuccess,
    isError,
    error
  } = useUpdateDepartment();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: '', description: '' }
  });

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        description: department.description
      });
    }
  }, [department, reset]);

  useEffect(() => {
  if (isSuccess) {
    navigate('/dashboard/department', { state: { alert: { severity: 'success', message: 'تم تعديل القسم بنجاح.' } } });
  }
}, [isSuccess, navigate]);

  const onSubmit = (data) => {
    updateDepartment({ id, ...data });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Edit Department
        </Typography>

        {isLoading ? (
          <Typography>جاري تحميل بيانات القسم...</Typography>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Department name is required',
                maxLength: { value: 255, message: 'Max length is 255 characters' },
                validate: value => value.trim() !== '' || 'Name cannot be empty'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Department Name"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{
                required: 'Description is required',
                maxLength: { value: 255, message: 'Max length is 255 characters' },
                validate: value => value.trim() !== '' || 'Description cannot be empty'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <Box sx={{ textAlign: 'right', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: '20px', textTransform: 'none' }}
                disabled={isPending}
              >
                {isPending ? <CircularProgress size={24} color="inherit" /> : 'Update Department'}
              </Button>
            </Box>

            {isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error.response?.data?.detail || error.message}
              </Alert>
            )}
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default EditDepartment;
