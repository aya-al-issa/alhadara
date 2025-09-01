import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Pagination,
  Button,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useDepositRequests } from "../../../Components/Hook/E-Wallet/useDepositRequests";
import { useApproveDeposit } from "../../../Components/Hook/E-Wallet/useApproveDeposit";
import { useRejectDeposit } from "../../../Components/Hook/E-Wallet/useRejectDeposit";
import FilterSelect from "../../../Components/FilterSelect";

const statusColors = {
  verified: "success",
  pending: "warning",
  rejected: "error",
};

const ViewDepositRequests = () => {
  const [page, setPage] = useState(1);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [filters, setFilters] = useState({ status: "", depositMethod: "" });
  const [filteredData, setFilteredData] = useState([]);

  const itemsPerPage = 10;

  const { data, isLoading, isError } = useDepositRequests();
  const { mutate: approveDeposit, isPending: isApproving } = useApproveDeposit();
  const { mutate: rejectDeposit, isPending: isRejecting } = useRejectDeposit();

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleChangePage = (_, value) => {
    setPage(value);
  };

  const handleApprove = (id) => {
    approveDeposit(id, {
      onSuccess: () => {
        setAlertMessage("تمت الموافقة على الطلب بنجاح.");
        setAlertSeverity("success");
        setAlertOpen(true);
      },
      onError: () => {
        setAlertMessage("فشل في الموافقة على الطلب.");
        setAlertSeverity("error");
        setAlertOpen(true);
      },
    });
  };

  const handleReject = (id) => {
    rejectDeposit(id, {
      onSuccess: () => {
        setAlertMessage("تم رفض الطلب بنجاح.");
        setAlertSeverity("success");
        setAlertOpen(true);
      },
      onError: () => {
        setAlertMessage("فشل في رفض الطلب.");
        setAlertSeverity("error");
        setAlertOpen(true);
      },
    });
  };

  const handleAlertClose = (_, reason) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  const applyFilters = () => {
    let result = data;
    if (!filters.status && !filters.depositMethod) {
      setFilteredData(data);
      return;
    }
    if (filters.status) {
      result = result.filter((item) => item.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.depositMethod) {
      result = result.filter((item) =>
        item.deposit_method_name.toLowerCase().includes(filters.depositMethod.toLowerCase())
      );
    }
    setFilteredData(result);
    setPage(1);
  };

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const openApproveDialog = (id) => {
    setSelectedRequestId(id);
    setApproveDialogOpen(true);
  };

  const openRejectDialog = (id) => {
    setSelectedRequestId(id);
    setRejectDialogOpen(true);
  };

  const closeDialogs = () => {
    setApproveDialogOpen(false);
    setRejectDialogOpen(false);
    setSelectedRequestId(null);
  };

  const confirmApprove = () => {
    if (selectedRequestId) handleApprove(selectedRequestId);
    closeDialogs();
  };

  const confirmReject = () => {
    if (selectedRequestId) handleReject(selectedRequestId);
    closeDialogs();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 5, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography color="error">فشل في تحميل طلبات الإيداع.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
      {/* فلاتر */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: { xs: "100%", sm: "auto" } }}>
          <FilterSelect
            filters={[
              { label: "Status", name: "status", options: ["pending", "verified", "rejected"] },
              { label: "Deposit Method", name: "depositMethod", options: ["money_transfer", "bank_transfer"] },
            ]}
            onFilterChange={(selected) => setFilters(selected)}
            sx={{ minWidth: 300 }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" }, "& > button": { width: { xs: "100%", sm: "auto" } } }}>
          <Button variant="contained" onClick={applyFilters} sx={{ height: 40 }}>Filter</Button>
          <Button variant="outlined" onClick={() => { setFilters({ status: "", depositMethod: "" }); setFilteredData(data); setPage(1); }} sx={{ height: 40 }}>Reset</Button>
        </Box>
      </Box>

      {/* جدول الطلبات */}
      <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Deposit Requests</Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Status</th>
                  <th>Phone Number</th>
                  <th>Amount</th>
                  <th>Transaction Number</th>
                  <th>Deposit Method Type</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: "center" }}>لا يوجد طلبات</td></tr>
                ) : currentData.map((req) => (
                  <tr key={req.id}>
                    <td><Chip label={req.status} color={statusColors[req.status.toLowerCase()] || "default"} size="small" variant="outlined" /></td>
                    <td>{req.user_phone}</td>
                    <td>${parseFloat(req.amount).toLocaleString()}</td>
                    <td>{req.transaction_number}</td>
                    <td>{req.deposit_method_name}</td>
                    <td>
                      <a href={req.screenshot_url} target="_blank" rel="noopener noreferrer">
                        <img src={req.screenshot_url.endsWith(".pdf") ? "/pdf-icon.png" : req.screenshot_url} alt="screenshot" style={{ width: 40, borderRadius: 4 }} />
                      </a>
                    </td>
                    <td>
                      <Stack direction="row" spacing={1}>
                        <Button variant="contained" size="small" disabled={isApproving} onClick={() => openApproveDialog(req.id)}>Approve</Button>
                        <Button variant="outlined" size="small" color="error" disabled={isRejecting} onClick={() => openRejectDialog(req.id)}>Reject</Button>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        {/* موبايل كارد */}
        <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", gap: 2 }}>
          {currentData.map((req) => (
            <Card key={req.id} variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>{req.user_phone}</Typography>
                <Stack direction="row" justifyContent="space-between" mb={1}><Typography variant="body2">Status:</Typography><Chip label={req.status} color={statusColors[req.status.toLowerCase()] || "default"} size="small" variant="outlined" /></Stack>
                <Stack direction="row" justifyContent="space-between" mb={1}><Typography variant="body2">Amount:</Typography><Typography>${parseFloat(req.amount).toLocaleString()}</Typography></Stack>
                <Stack direction="row" justifyContent="space-between" mb={1}><Typography variant="body2">Transaction Number:</Typography><Typography>{req.transaction_number}</Typography></Stack>
                <Stack direction="row" justifyContent="space-between" mb={1}><Typography variant="body2">Deposit Method Type:</Typography><Typography>{req.deposit_method_name}</Typography></Stack>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
                  <a href={req.screenshot_url} target="_blank" rel="noopener noreferrer">
                    <img src={req.screenshot_url.endsWith(".pdf") ? "/pdf-icon.png" : req.screenshot_url} alt="screenshot" style={{ width: 300, borderRadius: 4 }} />
                  </a>
                </Box>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="contained" size="small" disabled={isApproving} onClick={() => openApproveDialog(req.id)} fullWidth>Approve</Button>
                  <Button variant="contained" size="small" color="error" disabled={isRejecting} onClick={() => openRejectDialog(req.id)} fullWidth>Reject</Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Stack direction="row" justifyContent="center" mt={3}>
          <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" shape="rounded" />
        </Stack>

        {/* Dialog الموافقة */}
        <Dialog open={approveDialogOpen} onClose={closeDialogs}>
          <DialogTitle>تأكيد الموافقة</DialogTitle>
          <DialogContent>
            <Typography>هل أنت متأكد أنك تريد الموافقة على هذا الطلب؟</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialogs}>إلغاء</Button>
            <Button variant="contained" color="success" onClick={confirmApprove} disabled={isApproving}>
              {isApproving ? "جارٍ الموافقة..." : "موافقة"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog الرفض */}
        <Dialog open={rejectDialogOpen} onClose={closeDialogs}>
          <DialogTitle>تأكيد الرفض</DialogTitle>
          <DialogContent>
            <Typography>هل أنت متأكد أنك تريد رفض هذا الطلب؟</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialogs}>إلغاء</Button>
            <Button variant="contained" color="error" onClick={confirmReject} disabled={isRejecting}>
              {isRejecting ? "جارٍ الرفض..." : "رفض"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={handleAlertClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewDepositRequests;
