// src/Pages/Teachers/TeachersList.jsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Stack,
  Chip,
  Grid,
  CircularProgress,
  TextField,
  Button,

} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useGetTeachers } from "../../../Components/Hook/Teacher/useGetTeachers";
import { useNavigate } from "react-router-dom";

export default function TeachersList() {
  const { data: teachers, isLoading, isError } = useGetTeachers();
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // إضافة

  if (isLoading) return <CircularProgress sx={{ display: "block", m: "auto", mt: 10 }} />;
  if (isError) return <Typography color="error">حدث خطأ أثناء تحميل البيانات</Typography>;

  const filteredTeachers = teachers.filter((t) =>
    t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>

        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
          Teachers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard/teacher/create")}
        >
          Add Teacher
        </Button>
      </Stack>
      <TextField
        placeholder="ابحث بالاسم أو رقم الهاتف..."
        fullWidth
        variant="outlined"
        sx={{ mb: 4 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid container spacing={3}>
        {filteredTeachers.map((teacher) => (
          <Grid item xs={12} sm={6} md={4} key={teacher.id}>
            <Card
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 4,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "scale(1.03)", boxShadow: 8 },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
                    {teacher.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Avatar>
                  <Stack spacing={0.5} flex={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {teacher.full_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📞 {teacher.phone}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip
                        icon={teacher.is_active ? <CheckCircleIcon /> : <HighlightOffIcon />}
                        label={teacher.is_active ? "Active" : "Not Active "}
                        color={teacher.is_active ? "success" : "error"}
                        size="small"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
