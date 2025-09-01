import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography,
  Paper,
  Stack,
  Pagination,
  Divider,
  IconButton,
  Button,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useGetDepartments } from '../../../Components/Hook/Department/useGetDepartments';
import { useDeleteDepartment } from '../../../Components/Hook/Department/useDeleteDepartment';

import { Delete as DeleteIcon, Edit, Add } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const ViewDepartments = () => {
  const { data: departments = [], isLoading, isError } = useGetDepartments();
  const { mutate: deleteDepartment, isPending: isDeleting } = useDeleteDepartment();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();

  // عند تحميل الصفحة، إذا كانت هناك رسالة في location.state نعرضها
  useEffect(() => {
    if (location.state && location.state.alert) {
      setAlertMessage(location.state.alert.message);
      setAlertSeverity(location.state.alert.severity);
      setAlertOpen(true);

      // نزيل الرسالة من التاريخ حتى لا تظهر عند العودة للصفحة
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const pageCount = Math.ceil(departments.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = departments.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-department/${id}`);
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
      deleteDepartment(selectedId, {
        onSuccess: () => {
          setAlertMessage('تم حذف القسم بنجاح.');
          setAlertSeverity('success');
          setAlertOpen(true);
          handleCloseDialog();
        },
        onError: () => {
          setAlertMessage('حدث خطأ أثناء حذف القسم.');
          setAlertSeverity('error');
          setAlertOpen(true);
          handleCloseDialog();
        },
      });
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  return (
    <Box sx={{
      p: { xs: 1.5, sm: 2, md: 3 },
      backgroundColor: "#f1f1f1",
      minHeight: "100vh",
    }}>
      <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
>
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
        <Divider sx={{ mb: 2 }} />

        {isLoading ? (
          <Typography>جاري التحميل...</Typography>
        ) : isError ? (
          <Typography color="error">حدث خطأ أثناء تحميل الأقسام.</Typography>
        ) : departments.length === 0 ? (
          <Typography color="text.secondary">لا يوجد أقسام حالياً.</Typography>
        ) : (
          <>
            <Box sx={{ display: { xs: "none", sm: "block" }, overflowX: "auto" }}>
              <table className="table table-striped table-hover" style={{ minWidth: 600 }}>
                <thead className="table-dark">
                  <tr>
                    <th>Department Name</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.name}</td>
                      <td>{dept.description}</td>
                      <td>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="تعديل">
                            <IconButton onClick={() => handleEdit(dept.id)} color="primary">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="حذف">
                            <IconButton
                              onClick={() => handleOpenDialog(dept.id)}
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
              {currentData.map((dept) => (
                <Paper
                  key={dept.id}
                  variant="outlined"
                  sx={{ p: 2, mb: 3, borderRadius: 2 }}
                >
                  <Typography fontWeight="bold">{dept.name}</Typography>
                  <Typography variant="body2">Desc: {dept.description}</Typography>

                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(dept.id)}
                      fullWidth
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDialog(dept.id)}
                      fullWidth
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Box>

            <Stack direction="row" justifyContent="center" mt={3}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handleChangePage}
                color="primary"
                shape="rounded"
              />
            </Stack>
          </>
        )}



      </Paper>

      {/* Dialog تأكيد الحذف */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            هل أنت متأكد أنك تريد حذف هذا القسم؟ لا يمكن التراجع عن هذه العملية.
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

      {/* رسالة التنبيه */}
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

export default ViewDepartments;
