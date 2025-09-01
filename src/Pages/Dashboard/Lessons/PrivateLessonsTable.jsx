import React, { useState } from 'react';
import usePrivateLessons from '../../../Components/Hook/Lesson/usePrivateLessons';
import useConfirmLesson from '../../../Components/Hook/Lesson/useConfirmLesson'; // hook جديد
import useCancelLesson from '../../../Components/Hook/Lesson/useCancelLesson'; // ✅
import useProposeLesson from '../../../Components/Hook/Lesson/useProposeLesson'; // ✅
import { TextField } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    CircularProgress,
} from '@mui/material';


const PrivateLessonsTable = () => {
    const { data: lessons = [], isLoading, isError } = usePrivateLessons();
    const confirmLesson = useConfirmLesson();
    const cancelLesson = useCancelLesson(); // ✅ جديد

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false); // ✅
    const proposeLesson = useProposeLesson();

    const [proposeDialogOpen, setProposeDialogOpen] = useState(false);
    const [proposeData, setProposeData] = useState({
        date: '',
        time_from: '',
        time_to: '',
    });
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref}  {...props} />;
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success | error | warning | info

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleConfirmClick = (id) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };

    const handleDialogConfirm = () => {
        if (selectedId) {
            confirmLesson.mutate(selectedId, {
                onSuccess: () => {
                    showSnackbar('The lesson confirmed successfuly ', 'success');

                },
                onSettled: () => {
                    handleDialogClose();
                },
            });
        }
    };
    const handleCancelClick = (id) => {
        setSelectedId(id);
        setCancelDialogOpen(true);
    };

    const handleCancelDialogConfirm = () => {
        if (selectedId) {
            cancelLesson.mutate(selectedId, {
                onSuccess: () => {
                    showSnackbar('The lesson canecled successfuly', 'info');
                },
                onSettled: () => {
                    setCancelDialogOpen(false);
                    setSelectedId(null);
                },
            });
        }
    };

    const handleCancelDialogClose = () => {
        setCancelDialogOpen(false);
        setSelectedId(null);
    };
    const handleProposeClick = (id) => {
        setSelectedId(id);
        setProposeDialogOpen(true);
    };

    const handleProposeClose = () => {
        setProposeDialogOpen(false);
        setSelectedId(null);
        setProposeData({ date: '', time_from: '', time_to: '' });
    };

    const handleProposeSubmit = () => {
        if (!selectedId) return;

        const { date, time_from, time_to } = proposeData;

        // تحقق من أن جميع القيم موجودة
        if (!date || !time_from || !time_to) {
            showSnackbar('Please fill in all fields.', 'warning');
            return;
        }

        // تحقق من أن التاريخ ليس في الماضي
        const selectedDate = new Date(`${date}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // تجاهل الوقت

        if (selectedDate < today) {
            showSnackbar('The selected date cannot be in the past.', 'error');
            return;
        }

        // تحقق من أن وقت البداية أصغر من وقت النهاية
        const from = new Date(`${date}T${time_from}`);
        const to = new Date(`${date}T${time_to}`);

        if (from >= to) {
            showSnackbar('Start time must be earlier than end time.', 'error');
            return;
        }

        // إذا كلشي تمام، أرسل الطلب
        const payload = {
            options: [proposeData],
        };

        proposeLesson.mutate(
            { id: selectedId, data: payload },
            {
                onSuccess: () => {
                    showSnackbar('The proposed appointment has been sent successfully.', 'success');
                },
                onSettled: () => {
                    handleProposeClose();
                },
            }
        );
    };



    if (isLoading) return <CircularProgress />;
    if (isError) return <div>Error loading private lessons.</div>;

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Private Lesson Requests</h3>
            <table className="table table-striped table-hover" style={{ minWidth: 700 }}>
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Student </th>
                        <th> Course Name</th>
                        <th>Teacher </th>
                        <th> Date</th>
                        <th>Time From</th>
                        <th>Time To</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {[...lessons]
                        .sort((a, b) => a.id - b.id) 
                        .map((lesson) => (
                            <tr key={lesson.id}>
                                <td>{lesson.id}</td>
                                <td>{lesson.student_name}</td>
                                <td>{lesson.slot_course_name}</td>
                                <td>{lesson.slot_teacher_name}</td>
                                <td>{lesson.preferred_date}</td>
                                <td>{lesson.preferred_time_from?.slice(0, 5)}</td>
                                <td>{lesson.preferred_time_to?.slice(0, 5)}</td>
                                <td>
                                    <span
                                        className={`badge ${lesson.status === 'pending'
                                            ? 'bg-warning text-dark'
                                            : lesson.status === 'confirmed'
                                                ? 'bg-success'
                                                : 'bg-danger'
                                            }`}
                                    >
                                        {lesson.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => handleConfirmClick(lesson.id)}
                                            disabled={lesson.status !== 'pending'}
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleCancelClick(lesson.id)}
                                            disabled={lesson.status !== 'pending'}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleProposeClick(lesson.id)}
                                            disabled={lesson.status !== 'pending'}
                                        >
                                            Propose
                                        </Button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* 🔒 Dialog تأكيد */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>تأكيد الدرس</DialogTitle>
                <DialogContent>
                    <Typography>هل أنت متأكد أنك تريد تأكيد هذا الدرس؟</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>إلغاء</Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleDialogConfirm}
                        disabled={confirmLesson.isLoading}
                    >
                        {confirmLesson.isLoading ? 'جارٍ التأكيد...' : 'تأكيد'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={cancelDialogOpen} onClose={handleCancelDialogClose}>
                <DialogTitle>إلغاء الدرس</DialogTitle>
                <DialogContent>
                    <Typography>هل تريد إلغاء هذا الدرس؟</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDialogClose}>رجوع</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancelDialogConfirm}
                        disabled={cancelLesson.isLoading}
                    >
                        {cancelLesson.isLoading ? 'جارٍ الإلغاء...' : 'إلغاء'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={proposeDialogOpen} onClose={handleProposeClose}>
                <DialogTitle>Suggest another date
                </DialogTitle>
                <DialogContent className="d-flex flex-column gap-2 mt-2 m-4">
                    <Typography variant="body1" mb={1}>Date</Typography>
                    <TextField
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={proposeData.date}
                        onChange={(e) => setProposeData({ ...proposeData, date: e.target.value })}
                    />
                    <Typography variant="body1" mb={1}>Time From</Typography>

                    <TextField
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={proposeData.time_from}
                        onChange={(e) => setProposeData({ ...proposeData, time_from: e.target.value })}
                    />
                    <Typography variant="body1" mb={1}>Time To</Typography>

                    <TextField
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={proposeData.time_to}
                        onChange={(e) => setProposeData({ ...proposeData, time_to: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleProposeClose}>Cancle</Button>
                    <Button
                        variant="contained"
                        onClick={handleProposeSubmit}
                        disabled={proposeLesson.isLoading}
                    >
                        {proposeLesson.isLoading ? ' Sending...' : 'Send'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default PrivateLessonsTable;
