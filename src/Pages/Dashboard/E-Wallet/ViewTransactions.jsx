import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  Pagination,
  Chip,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Button
} from "@mui/material";
import { useTransactions } from "../../../Components/Hook/E-Wallet/useTransactions"; // عدّل المسار حسب مشروعك
import FilterSelect from "../../../Components/FilterSelect";

const statusColor = {
  completed: "success",
  pending: "warning",
  failed: "error",
  canceled: "default",
};

const ViewTransactions = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: "", transaction_type: "", created_at: "" });
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 10;

  const { data, isLoading, isError } = useTransactions();
  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 5, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography color="error">Failed to load transactions.</Typography>
      </Box>
    );
  }

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);




  const applyFilters = () => {
    let result = data;

    if (!filters.status && !filters.transaction_type && !filters.created_at) {
      setFilteredData(data);
      return;
    }

    if (filters.status) {
      result = result.filter(
        (item) => item.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.transaction_type) {
      result = result.filter(
        (item) =>
          item.transaction_type
            ?.toLowerCase()
            .includes(filters.transaction_type.toLowerCase())
      );
    }

    if (filters.created_at) {
      const now = new Date();

      result = result.filter((item) => {
        const createdAt = new Date(item.created_at);

        if (isNaN(createdAt)) return false; // لو التاريخ غير صالح

        if (filters.created_at === "Today") {
          return (
            createdAt.toDateString() === now.toDateString()
          );
        } else if (filters.created_at === "Past 7 days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return createdAt >= sevenDaysAgo && createdAt <= now;
        } else if (filters.created_at === "This month") {
          return (
            createdAt.getMonth() === now.getMonth() &&
            createdAt.getFullYear() === now.getFullYear()
          );
        }

        return true;
      });
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
        {/* الفلاتر */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <FilterSelect
            filters={[
              {
                label: "Status",
                name: "status",
                options: ["pending", "completed", "cancelled", "failed"],
              },
              {
                label: "Transaction Type",
                name: "transaction_type",
                options: ["Deposit", "Withdrawal", "Course Payment", "Course Refund", "Transfer"],
              },
              {
                label: "Created at",
                name: "created_at",
                options: ["Today", "Past 7 days", "This month"],
              },
            ]}
            onFilterChange={(selected) => {
              setFilters(selected);
            }}
            sx={{ minWidth: 300, width: { xs: "100%", sm: "300px" } }}
          />
        </Box>

        {/* الأزرار */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", sm: "auto" },
            "& > button": {
              width: { xs: "100%", sm: "auto" },
            },
          }}
        >
          <Button variant="contained" onClick={applyFilters} sx={{ height: 40 }}>
            Filter
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setFilters({ status: "", transaction_type: "", created_at: "" });
              setFilteredData(data);
              setPage(1);
            }}
            sx={{ height: 40 }}
          >
            Reset
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Transaction History
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Table View - Medium/Large Screens */}
        <Box sx={{ display: { xs: "none", sm: "block" }, overflowX: "auto" }}>
          <table className="table table-striped table-hover" style={{ minWidth: 600 }}>
            <thead className="table-dark">
              <tr>
                <th>Transaction ID</th>
                <th>Transaction Type</th>
                <th>Amount</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Status</th>
                <th>Created at</th>

              </tr>
            </thead>
            <tbody>
              {currentData.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.reference_id}</td>

                  <td>{tx.transaction_type}</td>
                  <td>${parseFloat(tx.amount).toLocaleString()}</td>
                  <td>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar src={`https://i.pravatar.cc/40?u=${tx.sender}`} />
                      <Typography>{tx.sender_name}</Typography>
                    </Stack>
                  </td>
                  <td>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar src={`https://i.pravatar.cc/40?u=${tx.receiver}`} />
                      <Typography>{tx.receiver_name}</Typography>
                    </Stack>
                  </td>
                  <td>
                    <Chip
                      label={tx.status}
                      color={statusColor[tx.status] || "default"}
                      variant="outlined"
                      size="small"
                    />
                  </td>
                  <td>{tx.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* Card View - Small Screens */}
        <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", gap: 2 }}>
          {currentData.map((tx) => (
            <Card key={tx.id} variant="outlined">
              <CardContent>
                <Typography variant="h5" fontWeight="bold" color="text.secondary">
                  {tx.transaction_type}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${parseFloat(tx.amount).toLocaleString()}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <Avatar src={`https://i.pravatar.cc/40?u=${tx.sender}`} />
                  <Box>
                    <Typography variant="body2">Sender</Typography>
                    <Typography variant="subtitle2">{tx.sender_name}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <Avatar src={`https://i.pravatar.cc/40?u=${tx.receiver}`} />
                  <Box>
                    <Typography variant="body2">Receiver</Typography>
                    <Typography variant="subtitle2">{tx.receiver_name}</Typography>
                  </Box>
                </Stack>

                <Chip
                  label={tx.status}
                  color={statusColor[tx.status] || "default"}
                  variant="outlined"
                  size="large"
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Pagination */}
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
    </Box>
  );
};

export default ViewTransactions;
