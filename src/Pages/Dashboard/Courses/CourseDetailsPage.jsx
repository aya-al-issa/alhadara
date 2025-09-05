import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Button,
  Grid,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import useCourseDetails from '../../../Components/Hook/Courses/useCourseDetails';
import UploadCourseImages from '../../../Components/image/UploadCourseImages';
import AddCourseDiscountForm from '../../../Components/Form/AddCourseDiscountForm';
import { useCourseDiscounts } from '../../../Components/Hook/Courses/Discount/useCourseDiscounts';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { data: course, isLoading: loadingCourse, error: courseError } = useCourseDetails(id);
  const { data: discounts, isLoading: loadingDiscounts } = useCourseDiscounts(id);

  const [openDialog, setOpenDialog] = useState(false);

  if (loadingCourse) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (courseError) {
    return <Typography color="error">خطأ في تحميل بيانات الكورس: {courseError.message}</Typography>;
  }

  if (!course) {
    return <Typography> Course Not Found .</Typography>;
  }

  return (
    <Box sx={{ p: 4 }} >
      <Typography variant="h4" fontWeight="bold" mb={2}>
        {course.title}
      </Typography>

      <UploadCourseImages courseId={id} existingImages={course.images || []} />

      <Typography variant="body1" sx={{ mb: 2 }}>
        {course.description}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Chip label={`Department: ${course.department_name}`} color="primary" />
        <Chip label={`Course Type: ${course.course_type_name}`} variant="outlined" />
        <Chip label={`Duration: ${course.duration} Hours`} />
        <Chip
          label={course.certification_eligible ? 'Certification Eligible ✅' : ' Certification Eligible ❌'}
          color={course.certification_eligible ? 'success' : 'default'}
        />
      </Box>



      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Discount</DialogTitle>
        <DialogContent>
          <AddCourseDiscountForm
            courseId={id}
            onSuccess={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Divider sx={{ mb: 3 }} />
      <Box sx={{display:"flex" , alignItems:"center" , justifyContent:"space-between"}}>
        <Typography variant="h4" fontWeight="bold" mb={2}>Discounts of this course </Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 1 }}>
          Add Discount
        </Button>
      </Box>
      {loadingDiscounts ? (
        <CircularProgress />
      ) : discounts && discounts.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {discounts.map((discount) => {
              const timeRemaining = discount.time_remaining;
              return (
                <Grid item key={discount.id} xs={12} sm={6} md={4}>
                  <Paper
                    sx={{
                      p: 3,
                      borderLeft: discount.status ? '5px solid #4caf50' : '5px solid #f44336',
                      boxShadow: 3,
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.03)' },
                    }}
                  >
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      {discount.course_title}
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {discount.discount_type === "percentage"
                        ? `${discount.discount_value}% Off`
                        : `$${discount.discount_value} Off`}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mr: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Original: ${discount.original_price}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
                        Now: ${discount.discounted_price}
                      </Typography>
                    </Box>

                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      Start: {new Date(discount.start_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      End: {new Date(discount.end_date).toLocaleDateString()}
                    </Typography>

                    <Chip
                      label={discount.status ? "Active" : "Inactive"}
                      color={discount.status ? "success" : "default"}
                      size="small"
                      sx={{ mb: 1 }}
                    />

                    {timeRemaining && discount.is_active && (
                      <Typography variant="caption" color="secondary">
                        Time Remaining: {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ) : (
        <Typography>No discounts available</Typography>
      )}

    </Box>
  );
};

export default CourseDetailsPage;
