// src/Components/Courses/AddCourseDiscountForm.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Snackbar,
Alert
} from "@mui/material";
import { useAddCourseDiscount } from "../../Components/Hook/Courses/Discount/useAddCourseDiscount";

const AddCourseDiscountForm = ({ courseId, onSuccess }) => {
  const { mutate: addDiscount, isLoading } = useAddCourseDiscount();

  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // حالة الرسائل
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleSubmit = (e) => {
    e.preventDefault();

    addDiscount(
      {
        course: courseId,
        discount_type: discountType,
        discount_value: discountValue,
        start_date: startDate,
        end_date: endDate,
      },
      {
        onSuccess: () => {
          setSnackbar({ open: true, message: "Discount added successfully!", severity: "success" });
          setDiscountValue("");
          setStartDate("");
          setEndDate("");
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          setSnackbar({ open: true, message: `Failed to add discount: ${error.response?.data || error.message}`, severity: "error" });
        },
      }
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" mb={1}>Add Discount</Typography>

      <TextField
        select
        label="Discount Type"
        value={discountType}
        onChange={(e) => setDiscountType(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="percentage">Percentage (%)</MenuItem>
        <MenuItem value="fixed">Fixed ($)</MenuItem>
      </TextField>

      <TextField
        label="Discount Value"
        type="number"
        value={discountValue}
        onChange={(e) => setDiscountValue(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Discount"}
      </Button>

      {/* Snackbar للرسائل */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCourseDiscountForm;