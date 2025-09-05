// src/Pages/Dashboard/CourseType/ViewCourseTypes.jsx
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
    Chip
} from "@mui/material";
import { Search as SearchIcon, Add } from "@mui/icons-material";
import { useGetCourseTypes } from "../../../../Components/Hook/CourseType/useGetCourseType";
import { useDeleteCourseType } from "../../../../Components/Hook/CourseType/useDeleteCourseType";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FilterSelect from "../../../../Components/FilterSelect";
import { useGetDepartments } from "../../../../Components/Hook/Department/useGetDepartments";

// ألوان عشوائية للقسم
const colors = ["#ffd90086", "#ff634797", "#00ced1a7", "#7B68EE", "#ff69b4ac", "#32cd32b9"];

const CourseTypeList = () => {
    const { data: courseTypes = [], isLoading, isError } = useGetCourseTypes();
    const { data: departments = [] } = useGetDepartments();
    const { mutate: deleteCourseType } = useDeleteCourseType();
    const navigate = useNavigate();
    const location = useLocation();

    const [search, setSearch] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({});
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    // خريطة تربط كل قسم بلون ثابت
    const departmentColorMap = useMemo(() => {
        const map = {};
        departments.forEach((dep, idx) => {
            map[dep.name] = colors[idx % colors.length];
        });
        return map;
    }, [departments]);

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

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
    };

    const filterOptions = [
        {
            name: "department",
            label: "Filter by Department",
            options: departments.map((d) => d.name),
        },
    ];

    const filteredCourseTypes = useMemo(() => {
        return courseTypes.filter((ct) => {
            const matchesSearch = ct.name.toLowerCase().includes(search.toLowerCase());
            const matchesDept =
                !selectedFilters.department ||
                ct.department_name === selectedFilters.department;
            return matchesSearch && matchesDept;
        });
    }, [courseTypes, search, selectedFilters]);

    return (
        <Box sx={{ p: 3, backgroundColor: "#f1f1f1", minHeight: "100vh" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                    Course Types Manager
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/dashboard/course-type/create")}
                >
                    New Course Type
                </Button>
            </Stack>


            <Box sx={{ mb: 3, position: "relative", width: { xs: "100%", sm: 400 } }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Search course types..."
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
            <FilterSelect filters={filterOptions} onFilterChange={handleFilterChange} />

            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : isError ? (
                <Typography color="error">Error loading course types.</Typography>
            ) : filteredCourseTypes.length === 0 ? (
                <Typography color="text.secondary">No course types found.</Typography>
            ) : (
                <Grid container spacing={2}>
                    <AnimatePresence>
                        {filteredCourseTypes.map((ct) => (
                            <Grid item xs={12} sm={4} key={ct.id}>
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card
                                        sx={{
                                            height: 360,
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
                                                ct.icon?.image_url ||
                                                "https://tse1.mm.bing.net/th/id/OIP.j_11jWDTYZE86499BDjlNgHaE3?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
                                            }
                                            alt={ct.name}
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
                                                {ct.name}
                                            </Typography>
                                            <Chip
                                                label={ct.department_name || "NA"}
                                                size="small"
                                                sx={{
                                                    fontWeight: "bold",
                                                    backgroundColor: departmentColorMap[ct.department_name] || "#ccc",
                                                    color: "#fff", // ممكن تختار لون الخط حسب الخلفية
                                                }}
                                            />
                                        </CardContent>
                                        <Stack direction="row" spacing={1} p={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                size="small"
                                                onClick={() => navigate(`/dashboard/course-type/edit/${ct.id}`)}
                                            >
                                                EDIT
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                fullWidth
                                                size="small"
                                                onClick={() =>
                                                    deleteCourseType(ct.id, {
                                                        onSuccess: () => {
                                                            setAlertMessage("تم حذف نوع الكورس بنجاح.");
                                                            setAlertSeverity("success");
                                                            setAlertOpen(true);
                                                        },
                                                        onError: () => {
                                                            setAlertMessage("حدث خطأ أثناء حذف نوع الكورس.");
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

            <Snackbar
                open={alertOpen}
                autoHideDuration={4000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CourseTypeList;
