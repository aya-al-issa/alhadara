import React, { useMemo } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";

import useCourses from "../../Hook/Courses/useCourses";
import useEnrollments from "../../Hook/Enrollment/useEnrollments";
import { useGetDepartments } from "../../Hook/Department/useGetDepartments";
import { useGetHalls } from "../../Hook/Hall/useGetHalls";
import Loading from "../../Loader/Loading";

const OverViewPage = () => {
    const { data: courses, isLoading: loadingCourses } = useCourses();
    const { data: enrollments, isLoading: loadingEnrollments } = useEnrollments();
    const { data: departments, isLoading: loadingDepartments } = useGetDepartments();
    const { data: halls, isLoading: loadingHalls } = useGetHalls();

    const isLoading =
        loadingCourses || loadingEnrollments || loadingDepartments || loadingHalls;

    // 🔥 بناء إحصائية "Course Types per Department"
    const courseTypesPerDept = useMemo(() => {
        if (!departments || !courses) return [];
        return departments.map((dept) => {
            const deptCourses = courses.filter(
                (c) => c.department?.id === dept.id
            );
            const groupedByType = deptCourses.reduce((acc, cur) => {
                const type = cur.course_type?.name || "Other";
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});
            return {
                department: dept.name,
                ...groupedByType,
            };
        });
    }, [departments, courses]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={6}>
                <Loading  />
            </Box>
        );
    }

    const stats = [
        {
            title: "Students",
            value: enrollments?.length || 0,
            icon: <GroupRoundedIcon />,
            color: "#1976d2",
        },
        {
            title: "Courses",
            value: courses?.length || 0,
            icon: <LibraryBooksRoundedIcon />,
            color: "#388e3c",
        },
        {
            title: "Departments",
            value: departments?.length || 0,
            icon: <SchoolRoundedIcon />,
            color: "#f57c00",
        },
        {
            title: "Halls",
            value: halls?.length || 0,
            icon: <MeetingRoomRoundedIcon />,
            color: "#7b1fa2",
        },
    ];



    return (
        <Box sx={{ p: 4 }}>
            {/* عنوان الصفحة */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Dashboard Overview
            </Typography>

            {/* الكروت العلوية */}
            {/* الكروت العلوية */}
            <Box
                sx={{
                    display: "flex",
                    gap: 3,
                    mb: 6,
                    width: "100%",
                }}
            >
                {stats.map((item, idx) => (
                    <motion.div
                        key={idx}
                        style={{ flex: 1 }} // 🔥 كل كارد ياخد نفس المساحة بالعرض
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.2 }}
                    >
                        <Paper
                            sx={{
                                p: 4,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 3,
                                boxShadow: 3,
                                border: "1px solid #e0e0e0",
                                backgroundColor: "#fff",
                                textAlign: "center",
                            }}
                        >
                            {/* الايقونة */}
                            <Box sx={{ color: item.color, mb: 2 }}>
                                {React.cloneElement(item.icon, { sx: { fontSize: 60 } })}
                            </Box>

                            {/* القيمة */}
                            <Typography variant="h4" fontWeight="bold" color="text.primary">
                                {item.value}
                            </Typography>

                            {/* العنوان */}
                            <Typography variant="subtitle1" color="text.secondary">
                                {item.title}
                            </Typography>
                        </Paper>
                    </motion.div>
                ))}
            </Box>


            {/* الشارتس */}
            <Grid container spacing={4}>
                {/* Chart: Courses Types per Department */}
                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Paper sx={{ p: 4, borderRadius: 5, boxShadow: 6 }}>
                            <Typography variant="h6" gutterBottom>
                                Courses Types per Department
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={courseTypesPerDept}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="department" />
                                    <YAxis />
                                    <Tooltip />
                                    {/* بشكل ديناميكي: كل course_type يصير عمود */}
                                    {courses &&
                                        Array.from(
                                            new Set(courses.map((c) => c.course_type?.name || "Other"))
                                        ).map((type, idx) => (
                                            <Bar
                                                key={idx}
                                                dataKey={type}
                                                stackId="a"
                                                fill={["#1976d2", "#388e3c", "#f57c00", "#7b1fa2", "#e91e63"][idx % 5]}
                                                radius={[6, 6, 0, 0]}
                                            />
                                        ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>


        </Box>
    );
};

export default OverViewPage;
