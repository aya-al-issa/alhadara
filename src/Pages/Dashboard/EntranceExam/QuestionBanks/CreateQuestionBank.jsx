import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    MenuItem,
    IconButton,
    Paper,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useCreateQuestionBank } from "../../../../Components/Hook/EntranceExam/useCreateQuestionBank";
import { useLanguages } from "../../../../Components/Hook/EntranceExam/useLanguages";

const difficulties = ["easy", "medium", "hard"];
const questionTypes = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "true_false", label: "True / False" },
];

const CreateQuestionBank = () => {
    const { data: languages = [], isLoading: langLoading } = useLanguages();
    const { mutate, isLoading: isSubmitting, isSuccess } = useCreateQuestionBank();
    const [openError, setOpenError] = useState(false);

    const [questions, setQuestions] = useState([
        {
            language: null,
            text: "",
            question_type: "multiple_choice",
            difficulty: "easy",
            points: 1,
            choices: [
                { text: "", is_correct: false, order: 0 },
                { text: "", is_correct: false, order: 1 },
            ],
        },
    ]);

    if (langLoading) return <CircularProgress />;

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                language: languages[0]?.id || null,
                text: "",
                question_type: "multiple_choice",
                difficulty: "easy",
                points: 1,
                choices: [
                    { text: "", is_correct: false, order: 0 },
                    { text: "", is_correct: false, order: 1 },
                ],
            },
        ]);
    };

    const handleChangeQuestion = (index, key, value) => {
        const newQuestions = [...questions];
        newQuestions[index][key] = value;
        setQuestions(newQuestions);
    };

    const handleQuestionTypeChange = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].question_type = value;
        if (value === "true_false") {
            newQuestions[qIndex].choices = [
                { text: "True", is_correct: false, order: 0 },
                { text: "False", is_correct: false, order: 1 },
            ];
        } else {
            newQuestions[qIndex].choices = [
                { text: "", is_correct: false, order: 0 },
                { text: "", is_correct: false, order: 1 },
            ];
        }
        setQuestions(newQuestions);
    };

    const handleAddChoice = (qIndex) => {
        const newQuestions = [...questions];
        const nextOrder = newQuestions[qIndex].choices.length;
        newQuestions[qIndex].choices.push({ text: "", is_correct: false, order: nextOrder });
        setQuestions(newQuestions);
    };

    const handleDeleteChoice = (qIndex, cIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].choices.splice(cIndex, 1);
        newQuestions[qIndex].choices = newQuestions[qIndex].choices.map((c, i) => ({
            ...c,
            order: i,
        }));
        setQuestions(newQuestions);
    };

    const handleChangeChoice = (qIndex, cIndex, key, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].choices[cIndex][key] = value;
        setQuestions(newQuestions);
    };

    const validate = () => {
        for (const q of questions) {
            if (!q.language || !q.text || !q.points || !q.difficulty) return false;
            const hasCorrect = q.choices.some((c) => c.is_correct);
            if (!hasCorrect) return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validate()) {
            setOpenError(true);
            return;
        }
        mutate(questions, {
            onSuccess: () => console.log("Created successfully"),
            onError: () => setOpenError(true),
        });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={3}>
                Create Question Bank
            </Typography>

            {questions.map((q, qIndex) => (
                <Paper key={qIndex} sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h6" mb={2} color="primary">
                        Question {qIndex + 1}
                    </Typography>


                    {/* زر حذف السؤال */}
                    <IconButton
                        color="error"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={() => {
                            const newQuestions = [...questions];
                            newQuestions.splice(qIndex, 1);
                            setQuestions(newQuestions);
                        }}
                    >
                        <Delete />
                    </IconButton>
                    {/* Language */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Language</FormLabel>
                        <TextField
                            select
                            value={q.language}
                            onChange={(e) => handleChangeQuestion(qIndex, "language", e.target.value)}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang.id} value={lang.id}>
                                    {lang.display_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    {/* Question Text */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Question Text</FormLabel>
                        <TextField
                            multiline
                            minRows={2}
                            value={q.text}
                            onChange={(e) => handleChangeQuestion(qIndex, "text", e.target.value)}
                        />
                    </FormControl>

                    {/* Question Type */}
                    <FormControl sx={{ mb: 2, width: 200 }}>
                        <FormLabel>Question Type</FormLabel>
                        <TextField
                            select
                            value={q.question_type}
                            onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                        >
                            {questionTypes.map((qt) => (
                                <MenuItem key={qt.value} value={qt.value}>
                                    {qt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    {/* Points and Difficulty */}
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <FormControl sx={{ width: 120 }}>
                            <FormLabel>Points</FormLabel>
                            <TextField
                                type="number"
                                value={q.points}
                                onChange={(e) => handleChangeQuestion(qIndex, "points", parseInt(e.target.value))}
                            />
                        </FormControl>

                        <FormControl sx={{ width: 150 }}>
                            <FormLabel>Difficulty</FormLabel>
                            <TextField
                                select
                                value={q.difficulty}
                                onChange={(e) => handleChangeQuestion(qIndex, "difficulty", e.target.value)}
                            >
                                {difficulties.map((d) => (
                                    <MenuItem key={d} value={d}>
                                        {d}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Box>

                    {/* Choices */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" mb={1}>
                            Choices
                        </Typography>

                        {q.question_type === "true_false" ? (
                            <FormControl>
                                <RadioGroup
                                    value={q.choices.find((c) => c.is_correct)?.text || ""}
                                    onChange={(e) => {
                                        const newQuestions = [...questions];
                                        newQuestions[qIndex].choices = newQuestions[qIndex].choices.map((c) => ({
                                            ...c,
                                            is_correct: c.text === e.target.value,
                                        }));
                                        setQuestions(newQuestions);
                                    }}
                                >
                                    {q.choices.map((c, cIndex) => (
                                        <FormControlLabel key={cIndex} value={c.text} control={<Radio />} label={c.text} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        ) : (
                            <>
                                {q.choices.map((c, cIndex) => (
                                    <Paper
                                        key={cIndex}
                                        sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, mb: 1 }}
                                    >
                                        <TextField
                                            label={`Choice ${cIndex + 1}`}
                                            value={c.text}
                                            onChange={(e) => handleChangeChoice(qIndex, cIndex, "text", e.target.value)}
                                            sx={{ flex: 1 }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={c.is_correct}
                                                    onChange={() => {
                                                        const newQuestions = [...questions];
                                                        // جعل جميع الخيارات الأخرى false واللي ضغطت عليه true
                                                        newQuestions[qIndex].choices = newQuestions[qIndex].choices.map((ch, idx) => ({
                                                            ...ch,
                                                            is_correct: idx === cIndex,
                                                        }));
                                                        setQuestions(newQuestions);
                                                    }}
                                                />
                                            }
                                            label="Correct"
                                        />
                                        <IconButton color="error" onClick={() => handleDeleteChoice(qIndex, cIndex)}>
                                            <Delete />
                                        </IconButton>
                                    </Paper>
                                ))}
                                <Button
                                    startIcon={<Add />}
                                    onClick={() => handleAddChoice(qIndex)}
                                    variant="outlined"
                                    sx={{ mt: 1 }}
                                >
                                    Add Choice
                                </Button>
                            </>
                        )}
                    </Box>
                </Paper>
            ))}

            <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleAddQuestion} sx={{ mr: 2 }}>
                    Add Question
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : "Create Question Bank"}
                </Button>
            </Box>

            {isSuccess && (
                <Typography color="green" mt={2}>
                    Questions Created Successfully ✅
                </Typography>
            )}

            <Snackbar open={openError} autoHideDuration={4000} onClose={() => setOpenError(false)}>
                <Alert severity="error">Please fill all required fields and select at least one correct choice!</Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateQuestionBank;
