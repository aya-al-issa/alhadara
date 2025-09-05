import React from "react";
import { Card, CardContent, Stack, Avatar, Typography, Button, Chip, Grow, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const statusConfig = {
  pending: { color: "#ff9800", label: "معلقة", icon: <HourglassBottomIcon fontSize="small" /> },
  approved: { color: "#4caf50", label: "مؤكدة", icon: <CheckCircleIcon fontSize="small" /> },
  cancelled: { color: "#f44336", label: "ملغية", icon: <HighlightOffIcon fontSize="small" /> },
};

export default function BookingCard({ booking, onApprove, onCancel, loadingApprove, loadingCancel }) {
  const statusItem = statusConfig[booking.status] || {};

  return (
    <Grow in style={{ transformOrigin: "0 0 0" }}>
      <Card sx={{
        borderRadius: 3,
        boxShadow: 4,
        overflow: "hidden",
        borderLeft: `6px solid ${statusItem.color}`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": { transform: "scale(1.01)", boxShadow: 6 },
      }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar sx={{ bgcolor: statusItem.color || "#888" }}>
              {booking.hall_name?.charAt(0)}
            </Avatar>
            <Stack flex={1} spacing={0.5}>
              <Typography variant="h6" fontWeight="bold">{booking.hall_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {dayjs(booking.date).format("DD MMM, YYYY")} | {booking.start_time} - {booking.end_time}
              </Typography>
              <Typography variant="body2">Type: {booking.booking_type}</Typography>
              <Typography variant="body2">Person count: {booking.headcount}</Typography>
            </Stack>
            {/* إضافة معلومات الشخص الذي حجز */}
            {booking.booked_for && (
              <Stack mt={1} spacing={0.3}>
                <Typography variant="body2" color="text.secondary">
                   Booking for: {booking.booked_for.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                   Phone number: {booking.booked_for.phone}
                </Typography>
              </Stack>
            )}
            <Stack spacing={1} alignItems="flex-end">
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => onApprove(booking.id)}
                disabled={booking.status !== "pending" || loadingApprove}
              >
                {loadingApprove ? <CircularProgress size={18} /> : "موافقة"}
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => onCancel(booking.id)}
                disabled={booking.status !== "pending" || loadingCancel}
              >
                {loadingCancel ? <CircularProgress size={18} /> : "إلغاء"}
              </Button>
              <Chip
                icon={statusItem.icon}
                label={statusItem.label}
                sx={{ bgcolor: statusItem.color, color: "#fff", fontWeight: "bold" }}
                size="small"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grow>
  );
}
