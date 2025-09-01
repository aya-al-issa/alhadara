import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Chip, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ExamCard = ({ exam }) => {
    const [openQr, setOpenQr] = useState(false);

    if (!exam) return null;

    return (
        <>
            <Card
                sx={{
                    mb: 3,
                    position: "relative",
                    borderLeft: `6px solid ${exam.is_active ? "#4caf50" : "#f44336"}`,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                    },
                }}
            >
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h6" fontWeight="bold">{exam.title}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                Language: {exam.language_name} | Teacher: {exam.grading_teacher_name}
                            </Typography>
                            <Typography variant="body2" mt={1}>{exam.description}</Typography>

                            <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                                <Chip label={`MCQ: ${exam.mcq_total_points} pts`} size="small" color="primary" />
                                <Chip label={`Speaking: ${exam.speaking_total_points} pts`} size="small" color="secondary" />
                                <Chip label={`Writing: ${exam.writing_total_points} pts`} size="small" color="warning" />
                                <Chip label={`Total: ${exam.total_points} pts`} size="small" color="success" />
                            </Box>
                        </Box>

                        {/* QR Code مع الوصف */}
                        <Box ml={2} textAlign="center" sx={{ cursor: "pointer" }} onClick={() => setOpenQr(true)}>
                            <img
                                src={exam.qr_image_base64}
                                alt="QR Code"
                                style={{ width: 100, height: 100, borderRadius: 8 }}
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Dialog لعرض QR Code كبير مع زر امسح */}
            <Dialog open={openQr} onClose={() => setOpenQr(false)} maxWidth="xs">
                <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box display="flex" justifyContent="flex-end" width="100%">
                        <IconButton onClick={() => setOpenQr(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="h7" color="primary" >Scan to start ...</Typography>
                    <img src={exam.qr_image_base64} alt="QR Code" style={{ width: "300px", height: "300px" }} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ExamCard;
