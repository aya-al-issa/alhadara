import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { Search as SearchIcon, Add } from "@mui/icons-material";
import { useGetDepartments } from "../../../Components/Hook/Department/useGetDepartments";
import { useDeleteDepartment } from "../../../Components/Hook/Department/useDeleteDepartment";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ViewDepartments = () => {
  const { data: departments = [], isLoading, isError } = useGetDepartments();
  const { mutate: deleteDepartment } = useDeleteDepartment();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  useEffect(() => {
    if (location.state && location.state.alert) {
      setAlertMessage(location.state.alert.message);
      setAlertSeverity(location.state.alert.severity);
      setAlertOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  // فلترة الأقسام حسب السيرش
  const filteredDepartments = useMemo(
    () =>
      departments.filter((dept) =>
        dept.name.toLowerCase().includes(search.toLowerCase())
      ),
    [departments, search]
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "#f1f1f1", minHeight: "100vh" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Departments Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/dashboard/create-department")}
        >
          New Department
        </Button>
      </Stack>

      {/* Creative Search */}
      <Box sx={{ mb: 3, position: "relative", width: { xs: "100%", sm: 400 } }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                <SearchIcon sx={{ color: "gray" }} />
              </Box>
            ),
            sx: {
              borderRadius: "25px",
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
                boxShadow: "0 0 5px rgba(25, 118, 210, 0.5)",
              },
              transition: "all 0.3s ease",
            },
          }}
        />
      </Box>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : isError ? (
        <Typography color="error">Error loading departments.</Typography>
      ) : filteredDepartments.length === 0 ? (
        <Typography color="text.secondary">No departments found.</Typography>
      ) : (
        <Grid container spacing={2}>
          <AnimatePresence>
            {filteredDepartments.map((dept) => (
              <Grid
                item
                xs={12}
                sm={4} // 3 كروت في الصف على الشاشات الكبيرة
                key={dept.id}
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      height: 350,
                      borderRadius: 2,
                      boxShadow: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:hover": { transform: "scale(1.03)", transition: "0.3s" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        dept.icon?.image_url ||
                        "https://via.placeholder.com/300x140.png?text=No+Image"
                      }
                      alt={dept.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {dept.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {dept.description || "No description"}
                      </Typography>
                    </CardContent>
                    <Stack direction="row" spacing={1} p={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="small"
                        onClick={() =>
                          navigate(`/dashboard/edit-department/${dept.id}`)
                        }
                      >
                        EDIT
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        size="small"
                        onClick={() =>
                          deleteDepartment(dept.id, {
                            onSuccess: () => {
                              setAlertMessage("تم حذف القسم بنجاح.");
                              setAlertSeverity("success");
                              setAlertOpen(true);
                            },
                            onError: () => {
                              setAlertMessage("حدث خطأ أثناء حذف القسم.");
                              setAlertSeverity("error");
                              setAlertOpen(true);
                            },
                          })
                        }
                      >
                        DELETE
                      </Button>
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* رسالة التنبيه */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewDepartments;
