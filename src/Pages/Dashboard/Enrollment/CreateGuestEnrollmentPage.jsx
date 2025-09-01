import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Paper,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import { Divider } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import useCourses from '../../../Components/Hook/Courses/useCourses';
import useScheduleSlots from '../../../Components/Hook/Courses/useScheduleSlots';
import useCreateGuestEnrollment from '../../../Components/Hook/Enrollment/useCreateGuestEnrollment';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CreateGuestEnrollmentPage = () => {
    const { data: courses } = useCourses();
    const { data: scheduleSlots } = useScheduleSlots();
    const { mutate, isLoading, isSuccess, isError, error } = useCreateGuestEnrollment();
    const { slotId } = useParams();

    const { control, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            first_name: '',
            middle_name: '',
            last_name: '',
            phone: '',
            course: '',
            schedule_slot: '',
            amount_paid: '',
            payment_method: 'cash',
        },
    });

    const selectedCourse = watch('course');
    const filteredSlots = scheduleSlots?.filter(
        (slot) => slot.course === Number(selectedCourse)
    );

    useEffect(() => {
        if (isSuccess) {
            reset();
        }
    }, [isSuccess, reset]);

    const onSubmit = (data) => {
        const payload = {
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            phone: data.phone,
            course: Number(data.course),
            schedule_slot: Number(data.schedule_slot),
            payment_method: data.payment_method,
            cash_amount: data.payment_method === 'cash'
                ? (data.amount_paid === '' ? '0' : String(data.amount_paid))
                : '0'
        };
        mutate(payload);
    };

    return (
        <Box p={4}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: '16px' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Create Guest Enrollment
                </Typography>
        <Divider  sx={{mb:2}}/>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        {/* First & Middle Name */}
                        <Grid item xs={12} md={6}>
                            <Typography fontWeight="500" mb={1}>First Name</Typography>
                            <Controller
                                name="first_name"
                                control={control}
                                rules={{ required: 'First name is required' }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography fontWeight="500" mb={1}>Middle Name</Typography>
                            <Controller
                                name="middle_name"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth />
                                )}
                            />
                        </Grid>

                        {/* Last Name & Phone */}
                        <Grid item xs={12} md={6}>
                            <Typography fontWeight="500" mb={1}>Last Name</Typography>
                            <Controller
                                name="last_name"
                                control={control}
                                rules={{ required: 'Last name is required' }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography fontWeight="500" mb={1}>Phone</Typography>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: 'Phone is required',
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'Invalid phone number',
                                    },
                                }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Course & Slot */}
                        <Grid item xs={12} md={6}>
                            <Typography fontWeight="500" mb={1}>Course</Typography>
                            <Controller
                                name="course"
                                control={control}
                                rules={{ required: 'Course is required' }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <Select {...field} displayEmpty>
                                            <MenuItem disabled value="">
                                                Select a course
                                            </MenuItem>
                                            {courses?.map((course) => (
                                                <MenuItem key={course.id} value={course.id}>
                                                    {course.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {fieldState.error && (
                                            <Typography variant="caption" color="error">
                                                {fieldState.error.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography fontWeight="500" mb={1}>Schedule Slot</Typography>
                            <Controller
                                name="schedule_slot"
                                control={control}
                                rules={{ required: 'Schedule slot is required' }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <Select {...field} disabled={!filteredSlots?.length} displayEmpty>
                                            <MenuItem disabled value="">
                                                Select a schedule
                                            </MenuItem>
                                            {filteredSlots?.map((slot) => (
                                                <MenuItem key={slot.id} value={slot.id}>
                                                    {slot.days_of_week.join(', ')} | {slot.start_time} - {slot.end_time}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {fieldState.error && (
                                            <Typography variant="caption" color="error">
                                                {fieldState.error.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {/* Payment Fields */}
                        <Grid item xs={12} md={6}>
                            <Typography fontWeight="500" mb={1}>Amount Paid</Typography>
                            <Controller
                                name="amount_paid"
                                control={control}
                                rules={{
                                    min: { value: 0, message: 'Amount must be >= 0' },
                                }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        fullWidth
                                        disabled={watch('payment_method') !== 'cash'}
                                        error={!!fieldState.error}
                                        helperText={
                                            watch('payment_method') !== 'cash'
                                                ? 'Auto-calculated for eWallet'
                                                : fieldState.error?.message
                                        }
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography fontWeight="500" mb={1}>Payment Method</Typography>
                            <Controller
                                name="payment_method"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <Select {...field}>
                                            <MenuItem value="cash">Cash</MenuItem>
                                            <MenuItem value="ewallet">eWallet</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {/* Submit */}
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, py: 1.5 }}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Create Enrollment'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Snackbar Alerts */}
            <Snackbar open={isSuccess} autoHideDuration={3000} onClose={() => { }}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    Guest enrollment created successfully!
                </Alert>
            </Snackbar>

            <Snackbar open={isError} autoHideDuration={3000} onClose={() => { }}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error?.response?.data?.detail || 'Error creating enrollment'}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateGuestEnrollmentPage;
