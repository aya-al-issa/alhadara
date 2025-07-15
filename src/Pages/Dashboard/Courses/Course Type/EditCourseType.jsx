// src/Pages/Dashboard/CourseType/EditCourseType.jsx
import React, { useEffect, useMemo } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetDepartments } from '../../../../Components/Hook/Department/useGetDepartments';
import { useUpdateCourseType } from '../../../../Components/Hook/CourseType/useUpdateCourseType';
import api from '../../../../Components/Api/Api';

const EditCourseType = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: { name: '', department: '' }
    });

    const {
        data: departments = [],
        isError: deptFetchError,
        error: deptFetchErrorData
    } = useGetDepartments();

    const { mutate: updateCourseType, isSuccess, isError, error: updateError } = useUpdateCourseType();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/courses/course-types/${id}/`);
                reset({
                    name: res.data.name,
                    department: res.data.department
                });
            } catch (error) {
                console.error('Error fetching course type:', error);
            }
        };
        fetchData();
    }, [id, reset]);

    const departmentOptions = useMemo(() => {
        if (!Array.isArray(departments)) return [];
        return departments.map((dep) => (
            <MenuItem key={dep.id} value={dep.id}>
                {dep.name}
            </MenuItem>
        ));
    }, [departments]);

    const onSubmit = (data) => {
        updateCourseType(
            { id, data },
            {
                onSuccess: () => {
                    navigate('/dashboard/course-type');
                }
            }
        );
    };

    return (
        <Box sx={{ p: 4, backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                    Edit Course Type
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Controller
                        name="department"
                        control={control}
                        rules={{ required: 'Please select a department' }}
                        render={({ field }) => (
                            <FormControl fullWidth margin="dense" error={!!errors.department}>
                                <InputLabel id="department-label">Select Department</InputLabel>
                                <Select
                                    {...field}
                                    labelId="department-label"
                                    label="Select Department"
                                >
                                    {departmentOptions}
                                </Select>
                                {errors.department && (
                                    <Typography variant="caption" color="error">
                                        {errors.department.message}
                                    </Typography>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: 'Course type name is required',
                            maxLength: { value: 255, message: 'Max length is 255 characters' },
                            validate: value => value.trim() !== '' || 'Name cannot be empty'
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Course Type Name"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />

                    <Box sx={{ textAlign: 'right', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            className="btn btn-primary rounded-pill"
                        >
                            <i className="bi bi-plus-circle me-2"></i>

                            {isSubmitting ? <CircularProgress size={24} /> : 'Update Course Type'}
                        </Button>
                    </Box>

                    {isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {updateError?.response?.data?.detail || updateError.message}
                        </Alert>
                    )}

                    {isSuccess && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Course Type Updated Successfully!
                        </Alert>
                    )}

                    {deptFetchError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {deptFetchErrorData?.response?.data?.detail || deptFetchErrorData?.message}
                        </Alert>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default EditCourseType;
