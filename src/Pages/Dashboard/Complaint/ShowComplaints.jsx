import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, Stack, Avatar,
  CircularProgress, MenuItem, Select, Button, Paper, Grow,
  Snackbar, Alert
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useUserType } from '../../../Components/Context/UserTypeContext';
import { useQueryClient } from '@tanstack/react-query';
import useComplaints from '../../../Components/Hook/Complaints/useComplaints';
import useResolveComplaint from '../../../Components/Hook/Complaints/useResolveComplaint';
import ResolveComplaintDialog from './ResolveComplaintDialog';
dayjs.extend(relativeTime);

export default function ShowComplaints() {
  const { userType } = useUserType();
  const [filters, setFilters] = useState({ status: '', type: '', ordering: '' }); // أضفنا ordering
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentComplaint, setCurrentComplaint] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useComplaints(filters);
  const resolveMutation = useResolveComplaint();

  const handleOpenDialog = (complaint) => {
    setCurrentComplaint(complaint);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentComplaint(null);
  };

  const handleSaveDialog = (updateData) => {
    if (!currentComplaint) return;
    resolveMutation.mutate(
      { id: currentComplaint.id, ...updateData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['complaints', filters]);
          setSnackbarOpen(true);
          handleCloseDialog();
        },
      }
    );
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const statusConfig = {
    submitted: { color: '#ff9800', label: 'مقدمة', icon: <HourglassBottomIcon fontSize="small" /> },
    in_review: { color: '#2196f3', label: 'قيد المراجعة', icon: <HourglassBottomIcon fontSize="small" /> },
    resolved: { color: '#4caf50', label: 'تم الحل', icon: <CheckCircleIcon fontSize="small" /> },
    rejected: { color: '#f44336', label: 'مرفوضة', icon: <HighlightOffIcon fontSize="small" /> },
  };

  if (isLoading) return <CircularProgress sx={{ mt: 4 }} />;
  if (isError) return <Typography color="error">{error.message}</Typography>;

  return (
    <Box p={3} sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Filters */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold"> Complaints List</Typography>
        <Stack direction="row" spacing={2}>
          <Select
            size="small"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            displayEmpty
            sx={{ backgroundColor: '#fff', borderRadius: 2 }}
          >
            <MenuItem value="">  Status</MenuItem>
            <MenuItem value="submitted">submitted</MenuItem>
            <MenuItem value="in_review">in review</MenuItem>
            <MenuItem value="resolved">resolved </MenuItem>
            <MenuItem value="rejected">rejected</MenuItem>
          </Select>
          <Select
            size="small"
            value={filters.ordering}
            onChange={(e) => setFilters((f) => ({ ...f, ordering: e.target.value }))}
            displayEmpty
            sx={{ backgroundColor: '#fff', borderRadius: 2 }}
          >
            <MenuItem value="">Priority </MenuItem>
            <MenuItem value="priority">(low → high)</MenuItem>
            <MenuItem value="-priority">(high → low)</MenuItem>
          </Select>

          <Select
            size="small"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            displayEmpty
            sx={{ backgroundColor: '#fff', borderRadius: 2 }}
          >
            <MenuItem value=""> Types</MenuItem>
            <MenuItem value="general">general</MenuItem>
            <MenuItem value="course">course </MenuItem>
            <MenuItem value="teacher"> teacher</MenuItem>
            <MenuItem value="facility">facility</MenuItem>
            <MenuItem value="other">other</MenuItem>
          </Select>
        </Stack>

      </Stack>

      {/* Complaints List */}
      <Stack spacing={2}>
        {data.length === 0 ? (
          <Typography align="center">لا توجد شكاوي.</Typography>
        ) : (
          data.map((complaint, index) => {
            const statusItem = statusConfig[complaint.status] || {};
            return (
              <Grow
                key={complaint.id}
                in
                style={{ transformOrigin: '0 0 0' }}
                {...{ timeout: 500 + index * 200 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 4,
                    overflow: 'hidden',
                    borderLeft: `6px solid ${statusItem.color}`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { transform: 'scale(1.01)', boxShadow: 6 },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="flex-start" spacing={2}>
                      <Avatar sx={{ bgcolor: statusItem.color || '#888' }}>
                        {complaint.title.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {complaint.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(complaint.created_at).format('DD MMM, YYYY')} •{' '}
                          {dayjs(complaint.created_at).fromNow()}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" mt={1}>
                          {complaint.description}
                        </Typography>

                        {/* Complaint type */}
                        <Typography variant="body2" color="primary" mt={1}>
                          Complaint type: {complaint.type}
                        </Typography>

                        {/* Enrollment details */}
                        {complaint.enrollment_details && (
                          <Paper
                            elevation={0}
                            sx={{
                              mt: 1,
                              px: 2,
                              py: 1,
                              borderRadius: 3,
                              bgcolor: '#f1f8ff',
                              border: '1px solid #90caf9',
                            }}
                          >
                            <Typography variant="body2" fontWeight="500">
                              🎓 الطالب: {complaint.enrollment_details.student?.full_name || '---'}
                            </Typography>
                            <Typography variant="body2">
                              📘 الكورس: {complaint.enrollment_details.course?.name || '---'}
                            </Typography>
                          </Paper>
                        )}

                        {/* Resolution notes */}
                        {complaint.resolution_notes && (
                          <Paper
                            elevation={0}
                            sx={{
                              mt: 2,
                              px: 2,
                              py: 1,
                              borderRadius: 3,
                              bgcolor: '#e8f5e9',
                              border: '1px solid #c8e6c9',
                              display: 'inline-block',
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="success.main"
                              fontWeight="500"
                            >
                              ✨ Replay: {complaint.resolution_notes}
                            </Typography>
                          </Paper>
                        )}
                      </Box>

                      <Stack spacing={1} alignItems="flex-end">
                        {userType === 'admin' && complaint.status !== 'resolved' && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleOpenDialog(complaint)}
                          >
                            <SendIcon fontSize="small" />
                          </Button>
                        )}
                        <Chip
                          icon={statusItem.icon}
                          label={statusItem.label || complaint.status}
                          sx={{
                            bgcolor: statusItem.color,
                            color: '#fff',
                            fontWeight: 'bold',
                          }}
                          size="small"
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grow>
            );
          })
        )}
      </Stack>

      {/* Dialog */}
      <ResolveComplaintDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        complaint={currentComplaint}
        onSave={handleSaveDialog}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          تم تحديث الشكوى بنجاح!
        </Alert>
      </Snackbar>
    </Box>
  );
}
