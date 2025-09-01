import React, { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useLanguages } from "../../../Components/Hook/EntranceExam/useLanguages";
import { useCreateExam } from "../../../Components/Hook/EntranceExam/useCreateExam";
import { useGetTeachers } from "../../../Components/Hook/Teacher/useGetTeachers";

const CreateExamForm = () => {
    const { data: languages, isLoading: loadingLang } = useLanguages();
    const { data: teachers, isLoading: loadingTeachers } = useGetTeachers();
    const { mutate: createExam, isPending, isSuccess, data } = useCreateExam();

    // ✅ Snackbar state
    const [errorMsg, setErrorMsg] = useState("");
    const [openError, setOpenError] = useState(false);

    // ✅ React Hook Form
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            language: "",
            title: "",
            description: "",
            grading_teacher: "",
            mcq_time_limit_minutes: 60,
            mcq_total_points: 100,
            speaking_total_points: 100,
            writing_total_points: 100,
            is_active: true,
        },
    });

    const onSubmit = (formData) => {
        createExam(formData, {
            onSuccess: () => reset(),
            onError: (err) => {
                setErrorMsg(err?.response?.data?.message || "Something went wrong!");
                setOpenError(true);
            },
        });
    };

    return (
        <Box sx={{ display: "flex", p: 4 }}>
            <Paper elevation={3} sx={{ width: "100%", p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                    Create Entrance Exam
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {(loadingLang || loadingTeachers) ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Language */}
                        <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                            Language
                        </Typography>
                        <Controller
                            name="language"
                            control={control}
                            rules={{ required: "Language is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.language}
                                    helperText={errors.language?.message}
                                >
                                    {languages?.map((lang) => (
                                        <MenuItem key={lang.id} value={lang.id}>
                                            {lang.display_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        {/* Title */}
                        <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                            Title
                        </Typography>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "Title is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            )}
                        />

                        {/* Description */}
                        <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                            Description
                        </Typography>
                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                required: "Description is required",
                                minLength: {
                                    value: 10,
                                    message: "Description must be at least 10 characters",
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    margin="dense"
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            )}
                        />

                        {/* Grading Teacher */}
                        <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                            Grading Teacher
                        </Typography>
                        <Controller
                            name="grading_teacher"
                            control={control}
                            rules={{ required: "Teacher is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.grading_teacher}
                                    helperText={errors.grading_teacher?.message}
                                >
                                    {teachers?.map((teacher) => (
                                        <MenuItem key={teacher.id} value={teacher.id}>
                                            {teacher.full_name ||
                                                `${teacher.first_name} ${teacher.last_name}`}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Divider sx={{ mb: 1, mt: 2,borderBottomWidth: 2}} />
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Exam Points
                        </Typography>
                        {/* MCQ Time Limit */}
                        <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                            MCQ Time Limit (minutes)
                        </Typography>
                        <Controller
                            name="mcq_time_limit_minutes"
                            control={control}
                            rules={{
                                required: "Time limit is required",
                                min: { value: 1, message: "Must be greater than 0" },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.mcq_time_limit_minutes}
                                    helperText={errors.mcq_time_limit_minutes?.message}
                                />
                            )}
                        />

                        {/* MCQ Points */}
                        <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                            MCQ Points
                        </Typography>
                        <Controller
                            name="mcq_total_points"
                            control={control}
                            rules={{
                                required: "Points are required",
                                min: { value: 1, message: "Must be greater than 0" },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.mcq_total_points}
                                    helperText={errors.mcq_total_points?.message}
                                />
                            )}
                        />

                        {/* Speaking Points */}
                        <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                            Speaking Points
                        </Typography>
                        <Controller
                            name="speaking_total_points"
                            control={control}
                            rules={{
                                required: "Points are required",
                                min: { value: 1, message: "Must be greater than 0" },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.speaking_total_points}
                                    helperText={errors.speaking_total_points?.message}
                                />
                            )}
                        />

                        {/* Writing Points */}
                        <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
                            Writing Points
                        </Typography>
                        <Controller
                            name="writing_total_points"
                            control={control}
                            rules={{
                                required: "Points are required",
                                min: { value: 1, message: "Must be greater than 0" },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.writing_total_points}
                                    helperText={errors.writing_total_points?.message}
                                />
                            )}
                        />

                        {/* Submit Button */}
                        <Box sx={{ textAlign: "right", mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isPending}
                                sx={{ borderRadius: "20px", textTransform: "none" }}
                            >
                                {isPending ? <CircularProgress size={24} /> : "Create Exam"}
                            </Button>
                        </Box>
                    </form>
                )}

                {/* ✅ Success Message */}
                {isSuccess && (
                    <Box mt={3} textAlign="center">
                        <Typography color="green" fontWeight="bold">
                            Exam Created Successfully ✅
                        </Typography>
                        <Typography variant="body2">QR Code: {data?.qr_code}</Typography>
                        {data?.qr_image_base64 && (
                            <img
                                src={data.qr_image_base64}
                                alt="QR Code"
                                style={{ marginTop: 10, width: 150 }}
                            />
                        )}
                    </Box>
                )}

                {/* ❌ Error Snackbar */}
                <Snackbar
                    open={openError}
                    autoHideDuration={4000}
                    onClose={() => setOpenError(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        severity="error"
                        onClose={() => setOpenError(false)}
                        sx={{ width: "100%" }}
                    >
                        {errorMsg}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default CreateExamForm;
