// src/Components/NotFound.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #680000ff, #dc8989ff)",
        textAlign: "center",
        color: "#fff",
        px: 2,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", sm: "10rem" },
            fontWeight: "bold",
            letterSpacing: "5px",
            textShadow: "2px 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          404
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            textShadow: "1px 1px 10px rgba(0,0,0,0.3)",
          }}
        >
          Ooops! الصفحة غير موجودة
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/home")}
          sx={{
            background: "#fff",
            color: "#ff4e50",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: "50px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            "&:hover": {
              background: "#f9d423",
              color: "#fff",
            },
          }}
        >
          العودة للصفحة الرئيسية
        </Button>
      </motion.div>
    </Box>
  );
};

export default NotFound;
