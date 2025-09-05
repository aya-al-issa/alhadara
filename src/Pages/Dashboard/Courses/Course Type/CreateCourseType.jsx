import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    Select,
    FormControl,
    Stack,
    CircularProgress,
    Divider,
    Paper
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateCourseType } from '../../../../Components/Hook/CourseType/useCreateCourseType';
import { useGetDepartments } from '../../../../Components/Hook/Department/useGetDepartments';
import { useUploadCourseTypeIcon } from '../../../../Components/Hook/CourseType/useUploadCourseTypeIcon';

const CreateCourseType = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: { name: '', department: '' }
    });

    const { data: departments = [] } = useGetDepartments();
    const createCourseType = useCreateCourseType();
    const uploadIcon = useUploadCourseTypeIcon();

    // إعادة التوجيه بعد النجاح
    useEffect(() => {
        if (createCourseType.isSuccess) {
            reset();
            navigate('/dashboard/course-type', {
                state: {
                    alert: { severity: 'success', message: 'Course Type Created Successfully!' }
                }
            });
        }
    }, [createCourseType.isSuccess, reset, navigate]);

    const departmentOptions = useMemo(() => {
        return departments.map((dep) => (
            <MenuItem key={dep.id} value={dep.id}>
                {dep.name}
            </MenuItem>
        ));
    }, [departments]);

    const onSubmit = (data) => {
        createCourseType.mutate(data, {
            onSuccess: (newCourseType) => {
                if (selectedFile) {
                    uploadIcon.mutate({ courseTypeId: newCourseType.id, file: selectedFile });
                }
            }
        });
    };

    return (
        <Box sx={{ p: 4, backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                    Create Course Type
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Department Select */}
                    <Controller
                        name="department"
                        control={control}
                        rules={{ required: 'Please select a department' }}
                        render={({ field }) => (
                            <FormControl fullWidth margin="dense" error={!!errors.department}>
                                <Typography variant="h7" gutterBottom>Select Department</Typography>
                                <Select {...field}>{departmentOptions}</Select>
                                {errors.department && (
                                    <Typography variant="caption" color="error">
                                        {errors.department.message}
                                    </Typography>
                                )}
                            </FormControl>
                        )}
                    />

                    {/* Course Type Name */}
                    <Typography variant="h7" gutterBottom>
                        Course type name
                    </Typography>
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: 'Course type name is required',
                            maxLength: { value: 255, message: 'Max length is 255 characters' },
                            validate: value => value.trim() !== '' || 'Course type name cannot be empty'
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                error={!!errors.name}
                                helperText={errors.name ? errors.name.message : ''}
                            />
                        )}
                    />

                    {/* Upload Icon */}
                    <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                        <Typography variant="h7">Course Type Icon</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                    </Stack>

                    {/* Submit Button */}
                    <Box sx={{ textAlign: 'right', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ borderRadius: '20px', textTransform: 'none' }}
                            disabled={createCourseType.isPending || uploadIcon.isLoading}
                        >
                            {createCourseType.isPending || uploadIcon.isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Create Course Type'
                            )}
                        </Button>
                    </Box>

                    {/* Alerts */}
                    {createCourseType.isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {createCourseType.error.response?.data?.detail || createCourseType.error.message}
                        </Alert>
                    )}
                    {uploadIcon.isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Error uploading icon: {uploadIcon.error.response?.data?.detail || uploadIcon.error.message}
                        </Alert>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default CreateCourseType;
