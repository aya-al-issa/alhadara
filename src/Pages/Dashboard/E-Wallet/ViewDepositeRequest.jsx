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
} from "@mui/material";
import { useDepositRequests } from "../../../Components/Hook/E-Wallet/useDepositRequests";
import { useApproveDeposit } from "../../../Components/Hook/E-Wallet/useApproveDeposit";
import { useRejectDeposit } from "../../../Components/Hook/E-Wallet/useRejectDeposit"; // Hook الرفض
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

  const handleChangePage = (event, value) => {
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
    setPage(1); // رجع لأول صفحة بعد الفلترة
  };



  return (
    <Box sx={{ p: 3, backgroundColor: "#f3f4f6", minHeight: "100vh" }}>

      <Box
         sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "stretch", sm: "center" },
    gap: 2,
    mb: 2,
  }}
      >
        {/* الفلاتر على اليسار */}
        <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      width: { xs: "100%", sm: "auto" },
    }}>
          <FilterSelect
            filters={[
              {
                label: "Status",
                name: "status",
                options: ["pending", "verified", "rejected"],
              },
              {
                label: "Deposit Method",
                name: "depositMethod",
                options: ["money_transfer", "bank_transfer"],
              },
            ]}
            onFilterChange={(selected) => {
              setFilters(selected);
            }}
            // ممكن تعطيها عرض ثابت أو نسوي flex داخلها حسب الحاجة
            sx={{ minWidth: 300 }}
          />
        </Box>

        {/* الأزرار على اليمين */}
        <Box sx={{
          display: "flex",
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          width: { xs: "100%", sm: "auto" },
          "& > button": {
            width: { xs: "100%", sm: "auto" },
          },
        }}>
          <Button variant="contained" onClick={applyFilters} sx={{ height: 40 }}>
            Filter
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setFilters({ status: "", depositMethod: "" });
              setFilteredData(data);
              setPage(1);
            }}
            sx={{ height: 40 }}
          >
            Reset
          </Button>
        </Box>
      </Box>


      <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Deposite Request        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Table view for larger screens */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Status</th>
                  <th>Phone Number</th>
                  <th>Amount</th>
                  <th>Transaction Number</th>
                  <th>Deposit Mesthod Type</th>
                  <th>Image</th>
                  <th>Acion</th>
                </tr>
              </thead>
              {filteredData.length === 0 ? (
                <Typography sx={{ textAlign: "center", mt: 4 }}>لا يوجد طلبات</Typography>
              ) : (
                <>
                  {/* Table + Cards + Pagination */}
                </>
              )}
              <tbody>
                {currentData.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <Chip
                        label={req.status}
                        color={statusColors[req.status.toLowerCase()] || "default"}
                        size="small"
                        variant="outlined"
                      />
                    </td>
                    <td>{req.user_phone}</td>
                    <td>${parseFloat(req.amount).toLocaleString()}</td>
                    <td>{req.transaction_number}</td>
                    <td>{req.deposit_method_name}</td>
                    <td>
                      <a href={req.screenshot_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={
                            req.screenshot_url.endsWith(".pdf")
                              ? "/pdf-icon.png"
                              : req.screenshot_url
                          }
                          alt="screenshot"
                          style={{ width: 40, borderRadius: 4 }}
                        />
                      </a>
                    </td>
                    <td>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          size="small"
                          disabled={isApproving}
                          onClick={() => handleApprove(req.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          disabled={isRejecting}
                          onClick={() => handleReject(req.id)}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        {/* Card view for small screens */}
        <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", gap: 2 }}>
          {currentData.map((req) => (
            <Card key={req.id} variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {req.user_phone}
                </Typography>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip
                    label={req.status}
                    color={statusColors[req.status.toLowerCase()] || "default"}
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Amount:</Typography>
                  <Typography>${parseFloat(req.amount).toLocaleString()}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Transaction Number :</Typography>
                  <Typography>{req.transaction_number}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Deposit Mesthod Type :</Typography>
                  <Typography>{req.deposit_method_name}</Typography>
                </Stack>

                <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
                  <a href={req.screenshot_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={
                        req.screenshot_url.endsWith(".pdf")
                          ? "/pdf-icon.png"
                          : req.screenshot_url
                      }
                      alt="screenshot"
                      style={{ width: 300, borderRadius: 4 }}
                    />
                  </a>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    size="small"
                    disabled={isApproving}
                    onClick={() => handleApprove(req.id)}
                    fullWidth={true}
                    sx={{ maxWidth: { xs: "100%", sm: "200px" } }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    disabled={isRejecting}
                    onClick={() => handleReject(req.id)}
                    fullWidth={true}
                    sx={{ maxWidth: { xs: "100%", sm: "200px" } }}
                  >
                    Reject
                  </Button>
                </Stack>
              </CardContent>
            </Card>
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
      </Paper>

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

export default ViewDepositRequests;
