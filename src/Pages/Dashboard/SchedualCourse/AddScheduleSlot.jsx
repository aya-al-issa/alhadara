import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Stack,
} from '@mui/material';
import { differenceInMinutes, differenceInCalendarDays, parseISO, isBefore, isAfter } from 'date-fns';
import useAddScheduleSlot from '../../../Components/Hook/Courses/useAddScheduleSlot';
import { useGetTeachers } from '../../../Components/Hook/Teacher/useGetTeachers';
import { useForm, Controller } from 'react-hook-form';
import useCourses from '../../../Components/Hook/Courses/useCourses';
import { useGetHalls } from '../../../Components/Hook/Hall/useGetHalls';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const daysOptions = [
  { label: 'Sunday', value: 'sun' },
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wed' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
];

const AddScheduleSlot = () => {
  const { data: courses = [] } = useCourses();
  const { data: halls = [] } = useGetHalls();
  const { data: teachers = [] } = useGetTeachers();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      course: courseId || '',
      hall: '',
      teacher: '',
      days_of_week: [],
      start_time: '',
      end_time: '',
      recurring: false,
      valid_from: '',
      valid_until: '',
    },
  });

  const mutation = useAddScheduleSlot();

  const onSubmit = (data) => {
    const {
      valid_from,
      valid_until,
      start_time,
      end_time,
      recurring,
      days_of_week,
    } = data;

    clearErrors();

    const now = new Date();
    const fromDate = parseISO(valid_from);
    const untilDate = parseISO(valid_until);

    if (isBefore(fromDate, now)) {
      setError("valid_from", { message: "Cannot schedule in the past." });
      return;
    }

    if (isAfter(fromDate, untilDate)) {
      setError("valid_until", { message: "End date must be after start date." });
      return;
    }

    if (recurring && !valid_until) {
      setError("valid_until", { message: "Recurring shifts require an end date." });
      return;
    }

    if (!recurring && days_of_week.length > 1) {
      setError("days_of_week", { message: "Only one day is allowed for non-recurring shifts." });
      return;
    }

    const [startHour, startMinute] = start_time.split(":").map(Number);
    const [endHour, endMinute] = end_time.split(":").map(Number);
    const start = new Date(2000, 0, 1, startHour, startMinute);
    const end = new Date(2000, 0, 1, endHour, endMinute);

    if (start >= end) {
      setError("end_time", { message: "End time must be after start time." });
      return;
    }

    const duration = differenceInMinutes(end, start) / 60;
    if (duration > 8) {
      setError("end_time", { message: "Shift duration cannot exceed 8 hours." });
      return;
    }

    if (duration < 0.5) {
      setError("end_time", { message: "Minimum duration is 30 minutes." });
      return;
    }

    const daysRange = differenceInCalendarDays(untilDate, fromDate);
    if (daysRange > 365) {
      setError("valid_until", { message: "Period cannot exceed one year." });
      return;
    }

    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        navigate('/dashboard/courses/schedual');
      },
      onError: (error) => {
        setError("course", { message: "Error occurred: " + error.message });
      },
    });
  };

  return (
    <Box sx={{ display: 'flex', p: 4 }}>
      <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
          Add New Schedule Slot
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            {/* Course Select */}
            <FormControl fullWidth>
              <Typography variant="h7" gutterBottom>
                Course Name
              </Typography>            
              <Controller
                name="course"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Course" required>
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.title}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            {/* Hall Select */}
            <FormControl fullWidth>
              <Typography variant="h7" gutterBottom>
                Hall
              </Typography>
              <Controller
                name="hall"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Hall" required>
                    {halls.map((hall) => (
                      <MenuItem key={hall.id} value={hall.id}>
                        {hall.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            {/* Teacher Select */}
            <FormControl fullWidth>
              <Typography variant="h7" gutterBottom>
                Teacher
              </Typography>
              <Controller
                name="teacher"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Teacher" required>
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            {/* Days of Week */}
            <Box>
              <Typography variant="h7" gutterBottom>
                Days of the Week
              </Typography>
              <FormGroup row>
                {daysOptions.map((day) => (
                  <FormControlLabel
                    key={day.value}
                    control={
                      <Controller
                        name="days_of_week"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value.includes(day.value)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, day.value]
                                : field.value.filter((v) => v !== day.value);
                              field.onChange(newValue);
                            }}
                          />
                        )}
                      />
                    }

                    label={day.label}
                  />
                ))}
              </FormGroup>
              {errors.days_of_week && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.days_of_week.message}
                </Typography>
              )}
            </Box>

            {/* Start Time */}
            <Typography variant="h7" gutterBottom>
              Start Time
            </Typography>
            <Controller
              name="start_time"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type="time"
                  label="Start Time"
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  required
                />
              )}
            />

            {/* End Time */}
            <Typography variant="h7" gutterBottom>
              End Time
            </Typography>
            <Controller
              name="end_time"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type="time"
                  label="End Time"
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  required
                  error={!!errors.end_time}
                  helperText={errors.end_time?.message}
                />
              )}
            />

            {/* Valid From */}
            <Typography variant="h7" gutterBottom>
              Valid Form
            </Typography>
            <Controller
              name="valid_from"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  required
                  error={!!errors.valid_from}
                  helperText={errors.valid_from?.message}
                />
              )}
            />

            {/* Valid Until */}
            <Typography variant="h7" gutterBottom>
              Valid Until
            </Typography>
            <Controller
              name="valid_until"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  required
                  error={!!errors.valid_until}
                  helperText={errors.valid_until?.message}
                />
              )}
            />

            {/* Recurring Checkbox */}
            <FormControlLabel
              control={
                <Controller
                  name="recurring"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label="Recurring"
            />
            <Box sx={{ textAlign: 'right', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ borderRadius: '20px', textTransform: 'none' }}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? 'Submitting...' : 'Add Schedule Slot'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddScheduleSlot;
