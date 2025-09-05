import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    Select,
    FormControl,
    CircularProgress,
    Divider,
    Stack,
    Paper
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetDepartments } from '../../../../Components/Hook/Department/useGetDepartments';
import { useUpdateCourseType } from '../../../../Components/Hook/CourseType/useUpdateCourseType';
import { useUploadCourseTypeIcon, useUpdateCourseTypeIcon } from '../../../../Components/Hook/CourseType/useUploadCourseTypeIcon';
import api from '../../../../Components/Api/Api';

const EditCourseType = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [iconId, setIconId] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: { name: '', department: '' }
    });

    const { data: departments = [] } = useGetDepartments();
    const { mutate: updateCourseType, isError, error: updateError } = useUpdateCourseType();
    const uploadIconMutation = useUploadCourseTypeIcon();
    const updateIconMutation = useUpdateCourseTypeIcon();
    // جلب بيانات الكورس تايب مع الأيقونة
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/courses/course-types/${id}/`);
                reset({
                    name: res.data.name,
                    department: res.data.department
                });
                if (res.data.icon) {
                    setPreview(res.data.icon.image_url);
                    setIconId(res.data.icon.id); // حفظ معرف الأيقونة
                }
            } catch (err) {
                console.error('Error fetching course type:', err);
            }
        };
        fetchData();
    }, [id, reset]);

    // معاينة الصورة عند الاختيار
    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [selectedFile]);

    const departmentOptions = useMemo(() => {
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
                    if (selectedFile) {
                        if (iconId) {
                            // تعديل أيقونة موجودة
                            updateIconMutation.mutate(
                                { iconId, file: selectedFile },
                                {
                                    onSuccess: (res) => {
                                        setPreview(res.image_url || preview);
                                        setSelectedFile(null);
                                    },
                                    onError: (err) => console.error('فشل تعديل الصورة', err)
                                }
                            );
                        } else {
                            // رفع أيقونة جديدة
                            uploadIconMutation.mutate(
                                { courseTypeId: id, file: selectedFile },
                                {
                                    onSuccess: (res) => {
                                        setPreview(res.image_url || preview);
                                        setSelectedFile(null);
                                        setIconId(res.id); // حفظ معرف الأيقونة الجديدة
                                    },
                                    onError: (err) => console.error('فشل رفع الصورة الجديدة', err)
                                }
                            );
                        }
                    }

                    navigate('/dashboard/course-type', {
                        state: { alert: { severity: 'success', message: 'تم تعديل نوع الكورس بنجاح.' } }
                    });
                },
                onError: (err) => console.error('فشل تحديث الكورس تايب', err)
            }
        );
    };



    return (
        <Box sx={{ p: 4, backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                    Edit Course Type
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* القسم */}
                    <Typography variant="h7" gutterBottom>
                        Select Department
                    </Typography>
                    <Controller
                        name="department"
                        control={control}
                        rules={{
                            required: 'Please select a department'
                        }}
                        render={({ field }) => (
                            <FormControl fullWidth margin="dense" error={!!errors.department}>
                                <Select {...field}>
                                    {departmentOptions}
                                </Select>
                                {errors.department && (
                                    <Typography variant="caption" color="error">{errors.department.message}</Typography>
                                )}
                            </FormControl>
                        )}
                    />

                    {/* الاسم */}
                    <Typography variant="h7" gutterBottom>
                        Course Type Name
                    </Typography>
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: 'Course type name is required',
                            maxLength: { value: 255, message: 'Max length is 255 characters' },
                            validate: value => typeof value === 'string' && value.trim() !== '' || 'Name cannot be empty'
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />

                    {/* الصورة */}
                    <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                        <Typography variant="h7">Course Type Icon</Typography>
                        {preview && (
                            <Box sx={{ mb: 1 }}>
                                <img
                                    src={preview}
                                    alt="Icon Preview"
                                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
                                />
                            </Box>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    </Stack>

                    {/* زر الحفظ */}
                    <Box sx={{ textAlign: 'right', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ borderRadius: '20px', textTransform: 'none' }}
                            disabled={isSubmitting || uploadIconMutation.isPending}
                        >
                            {isSubmitting || uploadIconMutation.isPending
                                ? <CircularProgress size={24} color="inherit" />
                                : 'Update Course Type'}
                        </Button>
                    </Box>

                    {/* رسائل الخطأ */}
                    {(isError || uploadIconMutation.isError) && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {updateError?.response?.data?.detail || uploadIconMutation.error?.message || 'حدث خطأ أثناء التحديث'}
                        </Alert>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default EditCourseType;
