// src/Pages/Teachers/AddTeacher.jsx
import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Snackbar,
    Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../Components/Api/Api"; // Axios جاهز
import { useNavigate } from "react-router-dom";

export default function AddTeacher() {
    const navigate = useNavigate(); // إضافة

    const queryClient = useQueryClient();
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            phone: "",
            password: "",
            confirm_password: "",
        },
    });

    const addTeacherMutation = useMutation({
        mutationFn: async (data) => {
            const { data: res } = await api.post("/auth/users/", data);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            setSnackbar({ open: true, message: "تمت إضافة الأستاذ بنجاح!", severity: "success" });
            reset();
            navigate("/dashboard/teacher");
        },
        onError: (err) => {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "حدث خطأ أثناء الإضافة!",
                severity: "error"
            });
        }
    });

    const onSubmit = (values) => {
        if (values.password !== values.confirm_password) {
            setSnackbar({ open: true, message: "كلمة المرور غير متطابقة!", severity: "error" });
            return;
        }

        addTeacherMutation.mutate({
            first_name: values.first_name,
            middle_name: values.middle_name,
            last_name: values.last_name,
            phone: values.phone,
            password: values.password,
            confirm_password: values.confirm_password,
            user_type: "teacher",
        });
    };

    return (
        <Box sx={{ display: 'flex', p: 4 }}>
            <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                    Add New Teacher
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h7" gutterBottom>
                        First name          </Typography>
                    <Controller
                        name="first_name"
                        control={control}
                        rules={{ required: "هذا الحقل مطلوب" }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                error={!!errors.first_name}
                                helperText={errors.first_name?.message}
                                {...field}
                            />
                        )}
                    />

                    <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                        Middle name          </Typography>
                    <Controller
                        name="middle_name"
                        control={control}
                        render={({ field }) => (
                            <TextField fullWidth margin="dense" variant="outlined" {...field} />
                        )}
                    />

                    <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                        Last name          </Typography>
                    <Controller
                        name="last_name"
                        control={control}
                        rules={{ required: "هذا الحقل مطلوب" }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                error={!!errors.last_name}
                                helperText={errors.last_name?.message}
                                {...field}
                            />
                        )}
                    />

                    <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                        Phone number          </Typography>
                    <Controller
                        name="phone"
                        control={control}
                        rules={{ required: "هذا الحقل مطلوب" }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                {...field}
                            />
                        )}
                    />

                    <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                        Paassword          </Typography>
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: "هذا الحقل مطلوب" }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                type="password"
                                margin="dense"
                                variant="outlined"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                {...field}
                            />
                        )}
                    />

                    <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                        Confirm password          </Typography>
                    <Controller
                        name="confirm_password"
                        control={control}
                        rules={{ required: "هذا الحقل مطلوب" }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                type="password"
                                margin="dense"
                                variant="outlined"
                                error={!!errors.confirm_password}
                                helperText={errors.confirm_password?.message}
                                {...field}
                            />
                        )}
                    />

                    <Box sx={{ textAlign: 'right', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={addTeacherMutation.isLoading}
                            sx={{ borderRadius: '20px', textTransform: 'none', px: 4 }}
                        >
                            {addTeacherMutation.isLoading ? 'Adding ...' : 'Add New Teacher'}
                        </Button>
                    </Box>
                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
