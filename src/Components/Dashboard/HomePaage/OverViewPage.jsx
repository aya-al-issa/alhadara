import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';

const stats = [
    { title: 'Students', value: 1350, icon: <GroupRoundedIcon fontSize="large" />, color: '#1976d2' },
    { title: 'Courses', value: 45, icon: <LibraryBooksRoundedIcon fontSize="large" />, color: '#388e3c' },
    { title: 'Departments', value: 8, icon: <SchoolRoundedIcon fontSize="large" />, color: '#f57c00' },
    { title: 'Halls', value: 22, icon: <MeetingRoomRoundedIcon fontSize="large" />, color: '#7b1fa2' },
];

const courseChart = [
    { name: 'CS', value: 12 },
    { name: 'IT', value: 9 },
    { name: 'Math', value: 6 },
    { name: 'Physics', value: 5 },
    { name: 'Biology', value: 4 }
];

const studentChart = [
    { name: 'CS', value: 420 },
    { name: 'IT', value: 315 },
    { name: 'Math', value: 250 },
    { name: 'Physics', value: 210 },
    { name: 'Biology', value: 155 }
];

const OverViewPage = () => {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Dashboard
            </Typography>

            {/* Top Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((item, idx) => (
                    <Grid item xs={12} sm={6} md={6} key={idx}> {/* <-- توسعة الكروت */}
                        <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', borderRadius: 3 }}>
                            <Box sx={{ color: item.color, mr: 3 }}>
                                {/* أيقونة كبيرة */}
                                {React.cloneElement(item.icon, { sx: { fontSize: 50 } })}
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">{item.value}</Typography> {/* رقم كبير */}
                                <Typography variant="subtitle1" color="text.secondary">{item.title}</Typography> {/* عنوان أكبر */}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Charts */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>Courses per Department</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={courseChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>Students per Department</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={studentChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#f57c00" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default OverViewPage;
