import React, { useRef, useState } from "react";
import { Button, Snackbar, Alert, Grid, Box } from "@mui/material";
import imageCourse from '../../Assets/default.jpeg'; // الصورة الافتراضية
import { useAddCourseImages } from "../Hook/Courses/Image/useAddCourseImages";

const UploadCourseImages = ({ courseId, existingImages = [] }) => {
  const fileInputRef = useRef(null);
  const { mutate: addImages, isLoading } = useAddCourseImages();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [images, setImages] = useState(existingImages); // الصور الحالية للكورس

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files.length) return;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("course", courseId);
      formData.append("image", files[i]);

      addImages(formData, {
        onSuccess: (data) => {
          setSnackbar({ open: true, message: "Image uploaded successfully!", severity: "success" });
          setImages(prev => [...prev, data]); // أضف الصورة الجديدة لقائمة الصور
        },
        onError: (err) => {
          setSnackbar({ open: true, message: "Failed to upload image.", severity: "error" });
        },
      });
    }
  };

  const handleClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // إذا ما في صور، نعرض الصورة الافتراضية
  const displayImages = images.length > 0 ? images : [{ id: "default", image_url: imageCourse }];

  return (
    <Box sx={{ mb: 3 }}>
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        onClick={() => fileInputRef.current.click()}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? "Uploading..." : "Upload Images"}
      </Button>

      {/* عرض الصور */}
      <Grid container spacing={2}>
        {displayImages.map((img) => (
          <Grid item xs={4} sm={3} md={2} key={img.id}>
            <Box
              component="img"
              src={img.image_url}
              alt="course"
              sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1 }}
            />
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadCourseImages;
