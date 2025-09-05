// ViewBookings.jsx
import React, { useState } from "react";
import { Box, Stack, Typography, Snackbar, Alert, Select, MenuItem, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import BookingCard from "../../../Components/Card/BookingCard";
import { useGetBookings } from "../../../Components/Hook/Booking/useGetBookings";
import { useApproveBooking, useCancelBooking } from "../../../Components/Hook/Booking/useBookingActions";

export default function ViewBookings() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ status: "", search: "", ordering: "-date" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dialog, setDialog] = useState({ open: false, action: "", bookingId: null });

  const { data: bookings = [], isLoading, isError, error } = useGetBookings({ ...filters });
  const approveMutation = useApproveBooking();
  const cancelMutation = useCancelBooking();

  const handleApprove = (id) => setDialog({ open: true, action: "approve", bookingId: id });
  const handleCancel = (id) => setDialog({ open: true, action: "cancel", bookingId: id });

  const confirmAction = async () => {
    try {
      if (dialog.action === "approve") {
        await approveMutation.mutateAsync(dialog.bookingId);
        setSnackbar({ open: true, message: "تمت الموافقة!", severity: "success" });
      } else {
        await cancelMutation.mutateAsync(dialog.bookingId);
        setSnackbar({ open: true, message: "تم الإلغاء!", severity: "success" });
      }
      queryClient.invalidateQueries(["bookings"]);
    } catch {
      setSnackbar({ open: true, message: "حدث خطأ!", severity: "error" });
    } finally {
      setDialog({ open: false, action: "", bookingId: null });
    }
  };

  const handleSearchChange = (e) => setFilters((f) => ({ ...f, search: e.target.value }));

  const filteredBookings = bookings
    .filter(b => !filters.status || b.status === filters.status)
    .filter(b => !filters.search || (b.hall_name?.toLowerCase().includes(filters.search.toLowerCase()) || (b.booked_for?.name && b.booked_for.name.toLowerCase().includes(filters.search.toLowerCase()))))
    .sort((a,b) => filters.ordering === "-date" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography color="error">{error.message}</Typography>;

  return (
    <Box p={3} sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField label="بحث" size="small" value={filters.search} onChange={handleSearchChange} />
        <Select size="small" value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}>
          <MenuItem value="">الكل</MenuItem>
          <MenuItem value="pending">معلقة</MenuItem>
          <MenuItem value="approved">مؤكدة</MenuItem>
          <MenuItem value="cancelled">ملغية</MenuItem>
        </Select>
        <Select size="small" value={filters.ordering} onChange={(e) => setFilters(f => ({ ...f, ordering: e.target.value }))}>
          <MenuItem value="-date">الأحدث أولاً</MenuItem>
          <MenuItem value="date">الأقدم أولاً</MenuItem>
        </Select>
      </Stack>

      <Stack spacing={2}>
        {filteredBookings.length === 0 ? (
          <Typography align="center">لا توجد حجوزات مطابقة.</Typography>
        ) : (
          filteredBookings.map(b => (
            <BookingCard
              key={b.id}
              booking={b}
              onApprove={handleApprove}
              onCancel={handleCancel}
              loadingApprove={approveMutation.isLoading && dialog.bookingId === b.id && dialog.action === "approve"}
              loadingCancel={cancelMutation.isLoading && dialog.bookingId === b.id && dialog.action === "cancel"}
            />
          ))
        )}
      </Stack>

      {/* Dialog التأكيد */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, action: "", bookingId: null })}>
        <DialogTitle>تأكيد الإجراء</DialogTitle>
        <DialogContent>
          هل أنت متأكد أنك تريد {dialog.action === "approve" ? "الموافقة على" : "إلغاء"} هذا الحجز؟
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, action: "", bookingId: null })}>إلغاء</Button>
          <Button variant="contained" onClick={confirmAction}>
            {dialog.action === "approve" && approveMutation.isLoading
              ? <CircularProgress size={18} color="inherit" />
              : dialog.action === "cancel" && cancelMutation.isLoading
              ? <CircularProgress size={18} color="inherit" />
              : "تأكيد"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
