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
    CircularProgress,
    Divider
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useCreateDepartment } from '../../../../Components/Hook/Department/useCreateDepartment.js';
import { useCreateCourseType } from '../../../../Components/Hook/CourseType/useCreateCourseType.js';
import { useGetDepartments } from '../../../../Components/Hook/Department/useGetDepartments.js';
import { useNavigate } from 'react-router-dom';

const CreateCourseType = () => {
  const navigate = useNavigate();

    // React Hook Form لإدارة نموذج نوع الكورس
    const {
        control: controlCourse,
        handleSubmit: handleSubmitCourse,
        reset: resetCourse,
        formState: { errors: errorsCourse }
    } = useForm({
        defaultValues: { name: '', department: '' }
    });

    const {
        mutate: createDepartment,
        isPending: isPendingDept,
        isSuccess: isSuccessDept,
        isError: isErrorDept,
        error: errorDept
    } = useCreateDepartment();

    const {
        mutate: createCourseType,
        isSuccess: isSuccessCourse,
        isError: isErrorCourse,
        error: errorCourse
    } = useCreateCourseType();

    const {
        data: departments = [],
        isError: deptFetchError,
        error: deptFetchErrorData
    } = useGetDepartments();

    // عند نجاح إنشاء نوع كورس، إعادة تعيين النموذج
    useEffect(() => {
        if (isSuccessCourse) {
            resetCourse();
            navigate('/dashboard/course-type');

        }
    }, [isSuccessCourse, resetCourse]);

    // تجهيز خيارات الأقسام باستخدام useMemo لتحسين الأداء
    const departmentOptions = useMemo(() => {
        if (!Array.isArray(departments)) return [];
        return departments.map((dep) => (
            <MenuItem key={dep.id} value={dep.id}>
                {dep.name}
            </MenuItem>
        ));
    }, [departments]);


    // دالة إرسال نموذج نوع الكورس
    const onSubmitCourse = (data) => {
        createCourseType(data);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4, backgroundColor: "#f3f4f6", minHeight: "100vh"  }}>

            {/* قسم إنشاء نوع كورس */}
            <Box>
                <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold" className="fw-bold" sx={{ mb: 4 }}>
                        Create Course Type
                    </Typography>
                    <Divider sx={{mb:2}}/>

                    <form onSubmit={handleSubmitCourse(onSubmitCourse)} noValidate>
                        <Controller
                            name="department"
                            control={controlCourse}
                            rules={{ required: 'Please select a department' }}
                            render={({ field }) => (
                                <FormControl fullWidth margin="dense" error={!!errorsCourse.department}>
                                    <InputLabel id="department-label">Select Department</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="department-label"
                                        label="Select Department"
                                    >
                                        {departmentOptions}
                                    </Select>
                                    {errorsCourse.department && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                            {errorsCourse.department.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="name"
                            control={controlCourse}
                            rules={{
                                required: 'Course type name is required',
                                maxLength: { value: 255, message: 'Max length is 255 characters' },
                                validate: value => value.trim() !== '' || 'Course type name cannot be empty'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Course Type Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    error={!!errorsCourse.name}
                                    helperText={errorsCourse.name ? errorsCourse.name.message : ''}
                                />
                            )}
                        />

                        <Box sx={{ textAlign: 'right', mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ borderRadius: '20px', textTransform: 'none' }}
                                disabled={isPendingDept /* أو اضف حالة تحميل خاصة بنوع الكورس إذا موجودة */}
                            >
                                Create Course Type
                            </Button>
                        </Box>

                        {isErrorCourse && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {errorCourse.response?.data?.detail || errorCourse.message}
                            </Alert>
                        )}
                        {isSuccessCourse && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Course Type Created Successfully!
                            </Alert>
                        )}

                        {deptFetchError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {deptFetchErrorData.response?.data?.detail || deptFetchErrorData.message}
                            </Alert>
                        )}
                    </form>
                </Paper>
            </Box>
        </Box>
    );
};

export default CreateCourseType;

