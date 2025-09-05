import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Divider,
  Stack,
  CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSingleDepartment } from '../../../Components/Hook/Department/useGetSingleDepartment';
import { useUpdateDepartment } from '../../../Components/Hook/Department/useUpdateDepartment';
import { useUpdateDepartmentIcon } from '../../../Components/Hook/Department/useUploadDepartmentIcon';

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: department, isLoading } = useGetSingleDepartment(id);
  const {
    mutate: updateDepartment,
    isPending: isUpdating,
    isSuccess: updateSuccess,
    isError: updateError,
    error: updateErrorMsg
  } = useUpdateDepartment();

  const updateIcon = useUpdateDepartmentIcon();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: '', description: '' }
  });

  // تحميل بيانات القسم
  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        description: department.description
      });
      if (department.icon) {
        setPreview(department.icon.image_url);
      }
    }
  }, [department, reset]);

  // معاينة الصورة الجديدة
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  // عند نجاح التحديث
  useEffect(() => {
    if (updateSuccess) {
      navigate('/dashboard/department', {
        state: { alert: { severity: 'success', message: 'تم تعديل القسم بنجاح.' } }
      });
    }
  }, [updateSuccess, navigate]);

  const onSubmit = (data) => {
    // أولاً تحديث البيانات الأساسية
    updateDepartment(
      { id, ...data },
      {
        onSuccess: () => {
          // ثم تحديث الصورة إذا تم اختيار واحدة جديدة
          if (selectedFile && department.icon) {
            updateIcon.mutate(
              { iconId: department.icon.id, file: selectedFile },
              {
                onSuccess: (res) => {
                  setPreview(res.image_url);
                  setSelectedFile(null);
                },
                onError: (err) => {
                  console.error('فشل تعديل الصورة', err);
                }
              }
            );
          }
        }
      }
    );
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f1f1f1" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Edit Department
        </Typography>
        <Divider sx={{ mb: 1 }} />

        {isLoading ? (
          <Typography>جاري تحميل بيانات القسم...</Typography>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="subtitle1" gutterBottom>
              Department Name
            </Typography>
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
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Description
            </Typography>
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
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            {/* قسم الصورة مع المعاينة */}
            <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Department Icon</Typography>
              {preview && (
                <Box sx={{ mb: 1 }}>
                  <img
                    src={preview}
                    alt="Icon Preview"
                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Stack>

            <Box sx={{ textAlign: 'right', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: '20px', textTransform: 'none' }}
                disabled={isUpdating || updateIcon.isPending}
              >
                {isUpdating || updateIcon.isPending
                  ? <CircularProgress size={24} color="inherit" />
                  : 'Update Department'}
              </Button>
            </Box>

            {(updateError || updateIcon.isError) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {updateErrorMsg?.response?.data?.detail || updateIcon.error?.message || 'حدث خطأ أثناء التحديث'}
              </Alert>
            )}
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default EditDepartment;
