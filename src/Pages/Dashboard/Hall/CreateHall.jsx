import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useCreateHall } from '../../../Components/Hook/Hall/useCreateHall';
import { useNavigate } from 'react-router-dom';  // <-- استيراد useNavigate

const CreateHall = () => {
  const navigate = useNavigate();  // <-- إنشاء المتغير

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      capacity: '',
      location: '',
      hourly_rate: ''
    }
  });

  const {
    mutate: createHall,
    isPending,
    isSuccess,
    isError,
    error
  } = useCreateHall();

  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate('/dashboard/halls', { state: { alertMessage: 'تم إضافة صالة جديدة بنجاح!' } });
    }
  }, [isSuccess, reset, navigate]);

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      capacity: parseInt(data.capacity, 10),
      hourly_rate: parseFloat(data.hourly_rate)
    };
    createHall(formattedData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
      <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Create New Hall
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* الاسم */}
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Hall name is required',
              maxLength: { value: 255, message: 'Max length is 255 characters' },
              validate: (value) => value.trim() !== '' || 'Hall name cannot be empty'
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Hall Name"
                variant="outlined"
                fullWidth
                margin="dense"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* السعة */}
          <Controller
            name="capacity"
            control={control}
            rules={{
              required: 'Capacity is required',
              validate: (value) => {
                const num = parseInt(value, 10);
                if (isNaN(num)) return 'Capacity must be a number';
                if (num <= 0) return 'Capacity must be positive';
                return true;
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Capacity"
                type="number"
                inputProps={{ min: 1 }}
                variant="outlined"
                fullWidth
                margin="dense"
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
              />
            )}
          />

          {/* الموقع */}
          <Controller
            name="location"
            control={control}
            rules={{
              required: 'Location is required',
              maxLength: { value: 255, message: 'Max length is 255 characters' },
              validate: (value) => value.trim() !== '' || 'Location cannot be empty'
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Location"
                variant="outlined"
                fullWidth
                margin="dense"
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            )}
          />

          {/* السعر بالساعة */}
          <Controller
            name="hourly_rate"
            control={control}
            rules={{
              required: 'Hourly rate is required',
              validate: (value) => {
                const num = parseFloat(value);
                if (isNaN(num)) return 'Hourly rate must be a number';
                if (num <= 0) return 'Hourly rate must be positive';
                return true;
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Hourly Rate"
                type="number"
                inputProps={{ min: 0.01, step: 0.01 }}
                variant="outlined"
                fullWidth
                margin="dense"
                error={!!errors.hourly_rate}
                helperText={errors.hourly_rate?.message}
              />
            )}
          />

          {/* زر الإرسال */}
          <Box sx={{ textAlign: 'right', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: '20px', textTransform: 'none' }}
              disabled={isPending}
            >
              {isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Hall'}
            </Button>
          </Box>

          {/* الرسائل */}
          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.response?.data?.detail || error.message}
            </Alert>
          )}
          {isSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Hall Created Successfully!
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default CreateHall;
