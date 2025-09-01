import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Button,
  CardActions,
  LinearProgress,
  Divider,
  Rating,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useScheduleSlotsWithFeedback from "../../../Components/Hook/Courses/useScheduleSlotsWithFeedback";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { useUserType } from "../../../Components/Context/UserTypeContext";

const ScheduleSlotsList = () => {
  const { slots, isLoading, isError, error } = useScheduleSlotsWithFeedback();
  const navigate = useNavigate();
  const { userType } = useUserType();

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Box mt={4}>
        <Alert severity="error">حدث خطأ: {error.message}</Alert>
      </Box>
    );

  const dayColors = {
    Monday: "#1976d2",
    Tuesday: "#9c27b0",
    Wednesday: "#2e7d32",
    Thursday: "#ed6c02",
    Friday: "#0288d1",
    Saturday: "#d32f2f",
    Sunday: "#616161",
  };

  return (
    <Box p={4}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary" fontWeight="bold">
          📅 Schedule Slots
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard/courses/schedual/create")}
        >
          + Add Schedule Slot
        </Button>
      </Box>

      {slots.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          🚫 No Schedule Slots Found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {slots.map((slot) => (
            <Grid item xs={12} md={6} lg={4} key={slot.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 6,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 10 },
                  display: "flex",
                  flexDirection: "column",
                  height: "100%", // يجعل كل الكاردات بنفس الارتفاع
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Course Title */}
                  <Box>
                    <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                      {slot.course_title}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Info Section */}
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: "secondary.main" }} />
                      Teacher: <strong style={{ marginLeft: 5 }}>{slot.teacher_name}</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                      <MeetingRoomIcon fontSize="small" sx={{ mr: 1, color: "info.main" }} />
                      Hall: <strong style={{ marginLeft: 5 }}>{slot.hall_name}</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                      Time: <strong style={{ marginLeft: 5 }}>{slot.start_time}</strong> -{" "}
                      <strong>{slot.end_time}</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                      <EventIcon fontSize="small" sx={{ mr: 1, color: "warning.main" }} />
                      Valid: <strong style={{ marginLeft: 5 }}>{slot.valid_from}</strong> →{" "}
                      <strong>{slot.valid_until || "لا يوجد انتهاء"}</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                      <GroupIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
                      Seats Remaining: <strong style={{ marginLeft: 5 }}>{slot.remaining_seats}</strong>
                    </Typography>
                  </Stack>

                  {/* Progress + Feedback */}
                  <Box mt={2}>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      {/* Progress Section */}
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          📊 Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Progress: {slot.course_progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={slot.course_progress}
                          sx={{ height: 10, borderRadius: 5, mb: 1 }}
                          color={
                            slot.course_progress >= 70
                              ? "success"
                              : slot.course_progress >= 40
                                ? "warning"
                                : "error"
                          }
                        />
                        <Typography variant="body2">
                          👥 Enrolled: <strong>{slot.enrolled_count}</strong> | 📘 Lessons:{" "}
                          <strong>{slot.lessons_count}</strong>
                        </Typography>
                      </Paper>

                      {/* Feedback Section */}
                      {userType === "admin" && (
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            ⭐ Feedback
                          </Typography>

                          {slot.feedbackLoading ? (
                            <LinearProgress sx={{ mt: 1 }} />
                          ) : slot.feedback && slot.feedback.averages && Object.values(slot.feedback.averages).some(val => val > 0) ? (
                            <Stack spacing={1}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <SchoolIcon sx={{ color: "secondary.main" }} />
                                <Typography variant="body2">Teacher</Typography>
                                <Rating
                                  value={slot.feedback.averages.teacher_rating || 0}
                                  precision={0.5}
                                  readOnly
                                  size="small"
                                />
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <MenuBookIcon sx={{ color: "info.main" }} />
                                <Typography variant="body2">Material</Typography>
                                <Rating
                                  value={slot.feedback.averages.material_rating || 0}
                                  precision={0.5}
                                  readOnly
                                  size="small"
                                />
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <ApartmentIcon sx={{ color: "success.main" }} />
                                <Typography variant="body2">Facilities</Typography>
                                <Rating
                                  value={slot.feedback.averages.facilities_rating || 0}
                                  precision={0.5}
                                  readOnly
                                  size="small"
                                />
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <PhoneIphoneIcon sx={{ color: "warning.main" }} />
                                <Typography variant="body2">App</Typography>
                                <Rating
                                  value={slot.feedback.averages.app_rating || 0}
                                  precision={0.5}
                                  readOnly
                                  size="small"
                                />
                              </Stack>

                              <Divider sx={{ my: 1 }} />

                              <Stack direction="row" alignItems="center" spacing={1}>
                                <StarIcon sx={{ color: "#fbc02d" }} />
                                <Typography fontWeight="bold">
                                  Total: {slot.feedback.averages.total_rating?.toFixed(2) || "0.00"} / 5
                                </Typography>
                              </Stack>
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              لا يوجد تقييمات بعد
                            </Typography>
                          )}
                        </Paper>
                      )}

                    </Stack>
                  </Box>

                  {/* Days Section */}
                  <Box mt={3}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {slot.days_of_week.map((day, index) => (
                        <Chip
                          key={index}
                          label={day}
                          variant="filled"
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: dayColors[day] || "#3aad61ff",
                            color: "#fff",
                            borderRadius: "8px",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>

                {/* Actions */}
                <Box display="flex" justifyContent="flex-end" p={2}>
                  <CardActions>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        navigate(`/dashboard/courses/schedual/guest-enrollment/${slot.id}`)
                      }
                    >
                      Enroll Guest
                    </Button>
                  </CardActions>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ScheduleSlotsList;
