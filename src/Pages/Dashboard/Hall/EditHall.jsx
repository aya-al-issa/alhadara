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
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSingleHall } from '../../../Components/Hook/Hall/useGetSingleHall';
import { useUpdateHall } from '../../../Components/Hook/Hall/useUpdateHall';

const EditHall = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: hall, isLoading, isError } = useGetSingleHall(id);
    const {
        mutate: updateHall,
        isPending,
        isSuccess,
        isError: isUpdateError,
        error
    } = useUpdateHall();

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

    useEffect(() => {
        if (hall) {
            reset({
                name: hall.name,
                capacity: hall.capacity,
                location: hall.location,
                hourly_rate: hall.hourly_rate
            });
        }
    }, [hall, reset]);

    useEffect(() => {
        if (isSuccess) {
            navigate('/dashboard/halls', { state: { alert: { severity: 'success', message: 'تم تعديل بيانات الصالة بنجاح.' } } });
        }
    }, [isSuccess, navigate]);

    const onSubmit = (data) => {
        const formattedData = {
            ...data,
            capacity: parseInt(data.capacity, 10),
            hourly_rate: parseFloat(data.hourly_rate)
        };
        updateHall({ id, data: formattedData });
    };

    if (isLoading) {
        return <Typography sx={{ p: 4 }}>جارٍ تحميل بيانات الصالة...</Typography>;
    }

    if (isError) {
        return <Typography color="error" sx={{ p: 4 }}>حدث خطأ أثناء تحميل بيانات الصالة.</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
            <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
                    Update Hall Inforamtion        </Typography>

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
                            {isPending ? <CircularProgress size={24} color="inherit" /> : 'Update Hall'}
                        </Button>
                    </Box>

                    {/* الرسائل */}
                    {isUpdateError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error.response?.data?.detail || error.message}
                        </Alert>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default EditHall;
