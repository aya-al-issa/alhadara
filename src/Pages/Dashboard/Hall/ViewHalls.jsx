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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Checkbox,
    ListItemText,
    CircularProgress,
    Chip
} from "@mui/material";
import { Delete as DeleteIcon, Edit, Add, Search } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

import { useGetHalls } from '../../../Components/Hook/Hall/useGetHalls';
import { useDeleteHall } from '../../../Components/Hook/Hall/useDeleteHall';
import { useGetHallServices } from '../../../Components/Hook/Booking/useGetHallServices';
import { useAddServicesToHall } from '../../../Components/Hook/Booking/useAddServicesToHall';
import { useSearchHallsForBooking } from '../../../Components/Hook/Booking/useSearchHallsForBooking';
import { useCreateGuestBooking } from '../../../Components/Hook/Booking/useCreateGuestBooking';

const ViewHalls = () => {
    const { data: halls = [], isLoading } = useGetHalls();
    const { mutate: deleteHall, isLoading: isDeleting } = useDeleteHall();
    const { data: services = [] } = useGetHallServices();

    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Dialog لإضافة خدمات
    const [openServiceDialog, setOpenServiceDialog] = useState(false);
    const [serviceHallId, setServiceHallId] = useState(null);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const { mutate: addServices, isLoading: addingService } = useAddServicesToHall(serviceHallId);

    // Dialog للبحث عن القاعات الفارغة
    const [openSearchDialog, setOpenSearchDialog] = useState(false);
    const [searchPayload, setSearchPayload] = useState({
        date: new Date().toISOString().slice(0, 10),
        start_time: "09:00",
        end_time: "11:00",
        booking_type: "public",
        headcount: 1,
        service_ids: []
    });
    const searchMutation = useSearchHallsForBooking();
    const [searchResults, setSearchResults] = useState([]);

    // Guest Booking Dialog
    const [openGuestDialog, setOpenGuestDialog] = useState(false);
    const [guestData, setGuestData] = useState({ name: '', phone: '' });
    const [hallToBook, setHallToBook] = useState(null);

    const createBookingMutation = useCreateGuestBooking();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.alert) {
            setAlertMessage(location.state.alert.message);
            setAlertSeverity(location.state.alert.severity);
            setAlertOpen(true);
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const pageCount = Math.ceil(halls.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentData = halls.slice(startIndex, startIndex + itemsPerPage);

    const handleChangePage = (event, value) => setPage(value);

    const handleEdit = (id) => navigate(`/dashboard/edit-hall/${id}`);

    const handleOpenDeleteDialog = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };
    const handleCloseDeleteDialog = () => {
        setSelectedId(null);
        setOpenDeleteDialog(false);
    };
    const handleConfirmDelete = () => {
        if (!selectedId) return;
        deleteHall(selectedId, {
            onSuccess: () => {
                setAlertMessage("تم حذف الصالة بنجاح.");
                setAlertSeverity("success");
                setAlertOpen(true);
                handleCloseDeleteDialog();
            },
            onError: () => {
                setAlertMessage("حدث خطأ أثناء حذف الصالة.");
                setAlertSeverity("error");
                setAlertOpen(true);
                handleCloseDeleteDialog();
            }
        });
    };

    // خدمات القاعة
    const openAddServiceDialog = (hallId) => {
        setServiceHallId(hallId);
        setSelectedServiceIds([]);
        setOpenServiceDialog(true);
    };
    const closeAddServiceDialog = () => {
        setServiceHallId(null);
        setOpenServiceDialog(false);
    };
    const handleAddServices = () => {
        addServices({ serviceIds: selectedServiceIds }, {
            onSuccess: (res) => {
                setAlertMessage(res.detail || "تمت إضافة الخدمات بنجاح");
                setAlertSeverity("success");
                setAlertOpen(true);
                closeAddServiceDialog();
            },
            onError: () => {
                setAlertMessage("حدث خطأ أثناء إضافة الخدمات");
                setAlertSeverity("error");
                setAlertOpen(true);
            }
        });
    };

    // بحث عن القاعات الفارغة
    const openSearchEmptyHallDialog = () => {
        setSearchResults([]);
        setOpenSearchDialog(true);
    };
    const handleSearchHalls = () => {
        const payload = {
            booking_type: searchPayload.booking_type,
            date: searchPayload.date,
            start_time: searchPayload.start_time.length === 5 ? `${searchPayload.start_time}:00` : searchPayload.start_time,
            end_time: searchPayload.end_time.length === 5 ? `${searchPayload.end_time}:00` : searchPayload.end_time,
            headcount: Number(searchPayload.headcount),
            service_ids: searchPayload.service_ids.map(Number)
        };

        console.log("SEARCH PAYLOAD:", payload);

        searchMutation.mutate(payload, {
            onSuccess: (data) => setSearchResults(data || []),
            onError: (err) => {
                console.error(err);
                setAlertMessage("حدث خطأ أثناء البحث");
                setAlertSeverity("error");
                setAlertOpen(true);
            }
        });
    };

    // فتح Dialog لإدخال معلومات الضيف
    const handleOpenGuestDialog = (hall) => {
        setHallToBook(hall);
        setGuestData({ name: '', phone: '' });
        setOpenGuestDialog(true);
    };
    const handleCloseGuestDialog = () => {
        setOpenGuestDialog(false);
        setHallToBook(null);
    };

    const handleConfirmGuestBooking = () => {
        if (!guestData.name || !guestData.phone) {
            setAlertMessage("يرجى إدخال الاسم ورقم الهاتف");
            setAlertSeverity("error");
            setAlertOpen(true);
            return;
        }

        const payload = {
            hall: hallToBook.hall.id,
            date: searchPayload.date,
            start_time: searchPayload.start_time.length === 5 ? `${searchPayload.start_time}:00` : searchPayload.start_time,
            end_time: searchPayload.end_time.length === 5 ? `${searchPayload.end_time}:00` : searchPayload.end_time,
            booking_type: searchPayload.booking_type,
            headcount: Number(searchPayload.headcount),
            guest_name: guestData.name,
            guest_phone: guestData.phone
        };

        createBookingMutation.mutate(payload, {
            onSuccess: (res) => {
                setAlertMessage(`تم الحجز بنجاح (#${res.id})`);
                setAlertSeverity("success");
                setAlertOpen(true);
                setOpenGuestDialog(false);
                setOpenSearchDialog(false);
                setSearchResults([]);
            },
            onError: (err) => {
                console.error(err);
                setAlertMessage("حدث خطأ أثناء الحجز");
                setAlertSeverity("error");
                setAlertOpen(true);
            }
        });
    };

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") return;
        setAlertOpen(false);
    };

    return (
        <Box sx={{ p: 3, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h6" fontWeight="bold">Halls Manager</Typography>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/create-hall")}>New Hall</Button>
                        <Button variant="outlined" startIcon={<Search />} onClick={openSearchEmptyHallDialog}>Search Empty Hall</Button>
                    </Stack>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                {/* جدول الصالات */}
                <Box sx={{ overflowX: "auto" }}>
                    <table className="table table-striped table-hover" style={{ minWidth: 700 }}>
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Capacity</th>
                                <th>Location</th>
                                <th>Hourly Rate</th>
                                <th>Services</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map(hall => (
                                <tr key={hall.id}>
                                    <td>{hall.name}</td>
                                    <td>{hall.capacity}</td>
                                    <td>{hall.location}</td>
                                    <td>{hall.hourly_rate}</td>
                                    <td>
                                        {hall.services?.map(s => <Chip key={s.id} label={s.name} size="small" sx={{ mr: 0.5 }} />)}
                                    </td>
                                    <td>
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="Update">
                                                <IconButton onClick={() => handleEdit(hall.id)} color="primary"><Edit /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleOpenDeleteDialog(hall.id)} color="error" disabled={isDeleting}><DeleteIcon /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Add Service">
                                                <Button variant="contained" size="small" onClick={() => openAddServiceDialog(hall.id)}>Add Service</Button>
                                            </Tooltip>
                                        </Stack>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <Stack direction="row" justifyContent="center" mt={3}>
                        <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" shape="rounded" size="medium" />
                    </Stack>
                </Box>
            </Paper>

            {/* Dialog حذف */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    <DialogContentText>هل أنت متأكد أنك تريد حذف هذه الصالة؟</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>إلغاء</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={isDeleting}>نعم، احذف</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog إضافة خدمات */}
            <Dialog open={openServiceDialog} onClose={closeAddServiceDialog} fullWidth maxWidth="sm">
                <DialogTitle>إضافة خدمات للصالة</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Services</InputLabel>
                        <Select
                            multiple
                            value={selectedServiceIds}
                            onChange={(e) => setSelectedServiceIds(e.target.value)}
                            input={<OutlinedInput label="Services" />}
                            renderValue={(selected) => selected.map(id => {
                                const s = services.find(s => s.id === id);
                                return s?.name;
                            }).join(', ')}
                        >
                            {services.map(s => (
                                <MenuItem key={s.id} value={s.id}>
                                    <Checkbox checked={selectedServiceIds.includes(s.id)} />
                                    <ListItemText primary={s.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddServiceDialog}>إلغاء</Button>
                    <Button onClick={handleAddServices} disabled={addingService} variant="contained">إضافة</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog البحث عن القاعات */}
            <Dialog open={openSearchDialog} onClose={() => setOpenSearchDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Search for Empty Halls</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField type="date" label="Date" value={searchPayload.date} onChange={(e) => setSearchPayload({ ...searchPayload, date: e.target.value })} fullWidth />
                        <Stack direction="row" spacing={2}>
                            <TextField type="time" label="Start Time" value={searchPayload.start_time} onChange={(e) => setSearchPayload({ ...searchPayload, start_time: e.target.value })} />
                            <TextField type="time" label="End Time" value={searchPayload.end_time} onChange={(e) => setSearchPayload({ ...searchPayload, end_time: e.target.value })} />
                        </Stack>
                        <TextField type="number" label="Headcount" value={searchPayload.headcount} onChange={(e) => setSearchPayload({ ...searchPayload, headcount: e.target.value })} />
                        <FormControl fullWidth>
                            <InputLabel>Services</InputLabel>
                            <Select
                                multiple
                                value={searchPayload.service_ids}
                                onChange={(e) => setSearchPayload({ ...searchPayload, service_ids: e.target.value })}
                                input={<OutlinedInput label="Services" />}
                                renderValue={(selected) => selected.map(id => {
                                    const s = services.find(s => s.id === id);
                                    return s?.name;
                                }).join(', ')}
                            >
                                {services.map(s => (
                                    <MenuItem key={s.id} value={s.id}>
                                        <Checkbox checked={searchPayload.service_ids.includes(s.id)} />
                                        <ListItemText primary={s.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={handleSearchHalls}>Search</Button>
                        {searchMutation.isLoading && <CircularProgress />}
                        {searchResults.map(hall => (
                            <Paper key={hall.hall.id} sx={{ p: 2, mt: 1 }}>
                                <Typography fontWeight="bold">{hall.hall.name}</Typography>
                                <Typography>Capacity: {hall.hall.capacity}</Typography>
                                <Typography>Location: {hall.hall.location}</Typography>
                                <Typography>Total Price: {hall.total_price}</Typography>
                                <Stack direction="row" spacing={1} mt={1}>
                                    <Button variant="contained" onClick={() => handleOpenGuestDialog(hall)}>Book</Button>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSearchDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog معلومات الضيف */}
            <Dialog open={openGuestDialog} onClose={handleCloseGuestDialog} fullWidth maxWidth="sm">
                <DialogTitle>Guest Information</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Guest Name"
                        fullWidth
                        margin="normal"
                        value={guestData.name}
                        onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                    />
                    <TextField
                        label="Guest Phone"
                        fullWidth
                        margin="normal"
                        value={guestData.phone}
                        onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseGuestDialog}>Cancel</Button>
                    <Button onClick={handleConfirmGuestBooking} variant="contained">Confirm Booking</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={alertOpen} autoHideDuration={4000} onClose={handleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ViewHalls;
