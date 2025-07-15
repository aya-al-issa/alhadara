import React, { useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    Modal,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useProfiles } from '../../../Components/Hook/Profile/useProfiles'; // تأكد من مسار الملف

const ViewProfileAdmin = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [tabIndex, setTabIndex] = useState(1);
    const [chipIndex, setChipIndex] = useState(0);

    const { data: users, isLoading, isError } = useProfiles();

    const handleOpenDetails = (user) => {
        setSelectedUser(user);
        setTabIndex(1); // إعادة تعيين التاب عند الفتح
        setChipIndex(0);
    };

    const handleCloseDetails = () => {
        setSelectedUser(null);
    };

    if (isLoading) {
        return <div>Loading users...</div>;
    }

    if (isError) {
        return <div>Error loading users</div>;
    }

    return (
        <div className="container mt-5">
            <h3>User Manager</h3>
            <table className="table table-striped table-bordered mt-4">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!users || users.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center text-danger">
                                No user found
                            </td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td className="d-flex align-items-center gap-2">
                                    <Avatar
                                        src={user?.image?.image || "https://via.placeholder.com/35"}
                                        alt={user.full_name}
                                        sx={{ width: 35, height: 35 }}
                                    />
                                    {user.full_name}
                                </td>
                                <td>{user.gender}</td>
                                <td>{user.address}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleOpenDetails(user)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Modal تفاصيل المستخدم */}
            {selectedUser && (
                <Modal
                    open
                    onClose={handleCloseDetails}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            bgcolor: "#fff",
                            borderRadius: 3,
                            width: 800,
                            p: 6,
                            pt: 8, // زيادة padding top
                            textAlign: "center",
                            boxShadow: 24,
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            overflow: 'visible', // حتى تظهر الصورة كاملة لو خارجة
                        }}
                    >
                        <Avatar
                            src={selectedUser?.image?.image || "https://via.placeholder.com/110"}
                            sx={{
                                width: 130,
                                height: 130,
                                position: "absolute",
                                top: -66,
                                left: "50%",
                                transform: "translateX(-50%)",
                                border: "4px solid white",
                                zIndex: 10,
                                backgroundColor: "white", // لتجنب الشفافية
                            }}
                        />

                        <IconButton
                            onClick={handleCloseDetails}
                            sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <Tabs
                            value={tabIndex}
                            onChange={(e, newValue) => setTabIndex(newValue)}
                            centered
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{
                                mb: 2,
                                "& .MuiTab-root": { fontWeight: "bold" },
                                "& .Mui-selected": { color: "#1e40af" },
                            }}
                        >
                            <Tab label="General Information" />
                            <Tab label="Study Status" />
                            <Tab label="Interests" />
                        </Tabs>

                        {tabIndex === 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    textAlign: "left",
                                    px: 4,
                                    mt: 2,
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mb: 2
                                }}
                            >
                                <Box sx={{ flex: "1 1 45%", mt: 2 }}>
                                    <Typography>
                                        <strong>Full Name:</strong> {selectedUser.full_name || "-"}
                                    </Typography>
                                    <Typography>
                                        <strong>Gender:</strong> {selectedUser.gender || "-"}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: "1 1 45%", mt: 2 }}>
                                    <Typography>
                                        <strong>Birthdate:</strong> {selectedUser.birth_date || "-"}
                                    </Typography>
                                    <Typography>
                                        <strong>Address:</strong> {selectedUser.address || "-"}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {tabIndex === 1 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    textAlign: "left",
                                    px: 4,
                                    mt: 2,
                                    flexWrap: "wrap",
                                    gap: 2,
                                }}
                            >
                                <Box sx={{ flex: "1 1 45%", mt: 2 }}>
                                    <Typography>
                                        <strong>Academic status:</strong> {selectedUser.academic_status || "-"}
                                    </Typography>
                                    <Typography>
                                        <strong>University Name:</strong> {selectedUser.university_name || selectedUser.university || "-"}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: "1 1 45%", mt: 2 }}>
                                    <Typography>
                                        <strong>Studyfield Name:</strong> {selectedUser.studyfield_name || selectedUser.studyfield || "-"}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {tabIndex === 2 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 2,
                                    mt: 4,
                                }}
                            >
                                <IconButton
                                    onClick={() => setChipIndex((prev) => Math.max(prev - 1, 0))}
                                    sx={{ bgcolor: "#f0f0f0", "&:hover": { bgcolor: "#ddd" } }}
                                >
                                    <ArrowBackIosNewIcon />
                                </IconButton>

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 3,
                                        overflow: "hidden",
                                        minHeight: "80px",
                                        alignItems: "center",
                                    }}
                                >
                                    {selectedUser.interests?.slice(chipIndex, chipIndex + 2).map((item, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                bgcolor: "#3f51b5",
                                                color: "white",
                                                px: 4,
                                                py: 2.5,
                                                borderRadius: "20px",
                                                fontWeight: "bold",
                                                fontSize: "20px",
                                                boxShadow: 3,
                                                minWidth: "160px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {item.interest_name} ({item.intensity})
                                        </Box>
                                    )) || <Typography>No interests</Typography>}
                                </Box>

                                <IconButton
                                    onClick={() =>
                                        setChipIndex((prev) =>
                                            Math.min(prev + 1, (selectedUser.interests?.length || 0) - 2)
                                        )
                                    }
                                    sx={{ bgcolor: "#f0f0f0", "&:hover": { bgcolor: "#ddd" } }}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default ViewProfileAdmin;
