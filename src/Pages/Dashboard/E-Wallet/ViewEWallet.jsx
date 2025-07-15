import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  Avatar,
  Pagination,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useGetWallets } from "../../../Components/Hook/E-Wallet/useGetWallets.js";
// const { user } = useAuth();

const ViewEWallete = () => {
  const { data: wallets, isLoading, isError } = useGetWallets();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  console.log(wallets);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "red" }}>
        Error loading wallets.
      </Box>
    );
  }

  const pageCount = Math.ceil(wallets.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = wallets.slice(startIndex, startIndex + itemsPerPage);


  return (
    <Box sx={{ p: 3, backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Wallets Overview
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <> <Box
          sx={{
            backgroundColor: "#e0f7fa",
            px: 3,
            py: 1,
            borderRadius: 2,
            boxShadow: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            Number of Wallet: {wallets.length}
          </Typography>
        </Box>
        </>
        <Divider sx={{ mb: 2, mt: 2 }} />

        {/* Table for medium and large screens */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th></th>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>Phone Number</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <Typography align="center" sx={{ py: 3, color: "gray" }}>
                        No wallets found.
                      </Typography>
                    </td>
                  </tr>
                ) : (
                  currentData.map((wallet) => (
                    <tr key={wallet.id}>
                      <td><Checkbox /></td>
                      <td>{wallet?.id}</td>
                      <td>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            src={`https://randomuser.me/api/portraits/men/75.jpg`}
                            alt=""
                            sx={{ width: 32, height: 32 }}
                          />
                          {wallet.user_full_name}
                        </Box>
                      </td>
                      <td>{wallet?.user_phone}</td>
                      <td>$ {wallet?.current_balance}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Box>

        {/* Card view for small screens */}
        <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", gap: 2 }}>
          {currentData.map((wallet) => (
            <Box
              key={wallet.id}
              sx={{
                p: 2,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Avatar
                  src={`https://randomuser.me/api/portraits/men/75.jpg`}
                  sx={{ width: 40, height: 40 }}
                />
                <Typography fontWeight="bold">{wallet.user_full_name}</Typography>
              </Stack>
              <Typography variant="body2">User ID: {wallet.id}</Typography>
              <Typography variant="body2">Phone: {wallet.user_phone}</Typography>
              <Typography variant="body2" fontWeight="bold" mt={1}>
                Balance: ${wallet.current_balance}
              </Typography>
            </Box>
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

export default ViewEWallete;
