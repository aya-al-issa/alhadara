import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useCreateDepartment } from '../../../Components/Hook/Department/useCreateDepartment.js';
import { useNavigate } from 'react-router-dom';

const CreateDepartment = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: '', description: '' }
  });

  const {
    mutate: createDepartment,
    isPending,
    isSuccess,
    isError,
    error
  } = useCreateDepartment();

  const navigate = useNavigate();

  // ✅ عند النجاح، أعد التوجيه إلى صفحة عرض الأقسام
  useEffect(() => {
  if (isSuccess) {
    reset();
    navigate('/dashboard/department', { state: { alert: { severity: 'success', message: 'تم إنشاء قسم جديد بنجاح.' } } });
  }
}, [isSuccess, reset, navigate]);


  const onSubmit = (data) => {
    createDepartment(data);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Create New Department
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Department name is required',
              maxLength: { value: 255, message: 'Max length is 255 characters' },
              minLength: { value: 2, message: 'Name must be at least 2 characters long' },
              validate: value => value.trim() !== '' || 'Department name cannot be empty'
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Department Name"
                variant="outlined"
                fullWidth
                margin="dense"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ''}
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
                helperText={errors.description ? errors.description.message : ''}
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
              {isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Department'}
            </Button>
          </Box>

          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.response?.data?.detail || error.message}
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default CreateDepartment;
