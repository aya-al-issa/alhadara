import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useGetCourseTypes } from '../../../../Components/Hook/CourseType/useGetCourseType';
import { Delete as DeleteIcon, Edit, Add } from "@mui/icons-material";
import { useDeleteCourseType } from '../../../../Components/Hook/CourseType/useDeleteCourseType';

const CourseTypeList = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const navigate = useNavigate();
    const { data, isLoading, isError, error } = useGetCourseTypes();
    const { mutate: deleteCourseType, isLoading: isDeleting } = useDeleteCourseType();

    const handleConfirmDelete = () => {
        if (selectedId) {
            deleteCourseType(selectedId, {
                onSuccess: () => {
                    setAlertMessage('تم حذف نوع الكورس بنجاح.');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    handleCloseDialog();
                },
                onError: () => {
                    setAlertMessage('حدث خطأ أثناء حذف نوع الكورس.');
                    setAlertSeverity('error');
                    setAlertOpen(true);
                    handleCloseDialog();
                },
            });
        }
    };

    const handleOpenDialog = (id) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setAlertOpen(false);
    };

    return (
        <Box sx={{ p: 3, backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-2">
                    <h2 className="fw-bold">Course Types</h2>
                    <button
                        className="btn btn-primary rounded-pill"
                        onClick={() => navigate('/dashboard/course-type/create')}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        
                        Create Course Type
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center my-4">
                        <div className="spinner-border text-primary" role="status" />
                    </div>
                ) : isError ? (
                    <div className="alert alert-danger">
                        {error?.response?.data?.detail || error.message}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table
                            className="table table-striped table-hover"
                            style={{ minWidth: 700 }}
                        >
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((courseType) => (
                                    <tr key={courseType.id}>
                                        <td>{courseType.id}</td>
                                        <td>{courseType.name}</td>
                                        <td>{courseType.department_name}</td>
                                        <td>
                                            <Stack direction="row" spacing={1}>
                                                <Tooltip title="Update">
                                                    <IconButton
                                                        color="primary"
                                                            onClick={() => navigate(`/dashboard/course-type/edit/${courseType.id}`)}

                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleOpenDialog(courseType.id)}

                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </td>
                                    </tr>
                                ))}
                                {data?.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            No Course Types Found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
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
                        هل أنت متأكد أنك تريد حذف نوع الكورس هذا؟ لا يمكن التراجع عن هذه العملية.
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

export default CourseTypeList;
