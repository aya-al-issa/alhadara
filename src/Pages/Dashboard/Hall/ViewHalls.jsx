import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Stack,
    Pagination,
    Divider,
    IconButton,
    Button,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert,
} from "@mui/material";

import { useGetHalls } from '../../../Components/Hook/Hall/useGetHalls';
import { useDeleteHall } from '../../../Components/Hook/Hall/useDeleteHall';

import { Delete as DeleteIcon, Edit, Add } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const ViewHalls = () => {
    const { data: halls = [], isLoading, isError } = useGetHalls();
    const { mutate: deleteHall, isLoading: isDeleting } = useDeleteHall();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.alert) {
            setAlertMessage(location.state.alert.message);
            setAlertSeverity(location.state.alert.severity);
            setAlertOpen(true);

            // نزيل الرسالة من التاريخ حتى لا تظهر عند العودة للصفحة
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const pageCount = Math.ceil(halls.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentData = halls.slice(startIndex, startIndex + itemsPerPage);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/edit-hall/${id}`);
    };

    const handleOpenDialog = (id) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = () => {
        if (selectedId) {
            deleteHall(selectedId, {
                onSuccess: () => {
                    setAlertMessage('تم حذف الصالة بنجاح.');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    handleCloseDialog();
                },
                onError: () => {
                    setAlertMessage('حدث خطأ أثناء حذف الصالة.');
                    setAlertSeverity('error');
                    setAlertOpen(true);
                    handleCloseDialog();
                }
            });
        }
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setAlertOpen(false);
    };

    return (
        <Box>
            <Box
                sx={{
                    p: { xs: 1.5, sm: 2, md: 3 },
                    backgroundColor: "#f9fafb",
                    minHeight: "100vh",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{ borderRadius: 2, p: 2 }}
                >
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        gap={2}
                        mb={2}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
                        >
                            Halls Manager
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            // sx={{ maxWidth: { xs: "100%", sm: "200px" } }}
                            className="btn btn-primary rounded-pill"

                            onClick={() => navigate("/dashboard/create-hall")}
                        >
                            <i className="bi bi-plus-circle me-2"></i>

                            New Hall
                        </Button>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />

                    {/* ✅ جدول للشاشات المتوسطة والكبيرة */}
                    <Box sx={{ display: { xs: "none", sm: "block" }, overflowX: "auto" }}>
                        <table
                            className="table table-striped table-hover"
                            style={{ minWidth: 700 }}
                        >
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Capacity</th>
                                    <th>Location</th>
                                    <th>Hourly Rate</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((hall) => (
                                    <tr key={hall.id}>
                                        <td>{hall.name}</td>
                                        <td>{hall.capacity}</td>
                                        <td>{hall.location}</td>
                                        <td>{hall.hourly_rate}</td>
                                        <td>
                                            <Stack direction="row" spacing={1}>
                                                <Tooltip title="Update">
                                                    <IconButton
                                                        onClick={() => handleEdit(hall.id)}
                                                        color="primary"
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => handleOpenDialog(hall.id)}
                                                        color="error"
                                                        disabled={isDeleting}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>

                    {/* ✅ بطاقات بديلة على الجوال */}
                    <Box sx={{ display: { xs: "block", sm: "none" } }}>
                        {currentData.map((hall) => (
                            <Paper
                                key={hall.id}
                                variant="outlined"
                                sx={{ p: 2, mb: 3, borderRadius: 2 }}
                            >
                                <Typography fontWeight="bold">{hall.name}</Typography>
                                <Typography variant="body2">Capacity: {hall.capacity}</Typography>
                                <Typography variant="body2">Location: {hall.location}</Typography>
                                <Typography variant="body2">
                                    Hourly Rate: {hall.hourly_rate}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEdit(hall.id)}
                                        fullWidth
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleOpenDialog(hall.id)}
                                        fullWidth
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            </Paper>
                        ))}
                    </Box>

                    {/* ✅ Pagination */}
                    <Stack direction="row" justifyContent="center" mt={3}>
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={handleChangePage}
                            color="primary"
                            shape="rounded"
                            size="medium"
                        />
                    </Stack>
                </Paper>
            </Box>


            {/* Dialog حذف الصالة */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">تأكيد الحذف</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        هل أنت متأكد أنك تريد حذف هذه الصالة؟ لا يمكن التراجع عن هذه العملية.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>إلغاء</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        autoFocus
                        disabled={isDeleting}
                    >
                        نعم، احذف
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar للرسائل */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={4000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ViewHalls;
