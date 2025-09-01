import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function ResolveComplaintDialog({ open, onClose, complaint, onSave }) {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [priority, setPriority] = useState('low');
  const [status, setStatus] = useState('submitted');

  useEffect(() => {
    if (complaint) {
      setResolutionNotes(complaint.resolution_notes || '');
      setPriority(complaint.priority || 'low');
      setStatus(complaint.status || 'submitted');
    }
  }, [complaint]);

  const handleSave = () => {
    if (!resolutionNotes && status === 'resolved') {
      alert('يجب كتابة ملاحظات الحل قبل وضع الحالة كـ "تم الحل"');
      return;
    }
    onSave({ resolution_notes: resolutionNotes, priority, status });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>حل الشكوى</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
        <TextField
          label="ملاحظات الحل"
          fullWidth
          multiline
          minRows={3}
          value={resolutionNotes}
          onChange={(e) => setResolutionNotes(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>الأولوية</InputLabel>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)} label="الأولوية">
            <MenuItem value="low">منخفضة</MenuItem>
            <MenuItem value="medium">متوسطة</MenuItem>
            <MenuItem value="high">عالية</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>الحالة</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} label="الحالة">
            <MenuItem value="submitted">مقدمة</MenuItem>
            <MenuItem value="in_review">قيد المراجعة</MenuItem>
            <MenuItem value="resolved">تم الحل</MenuItem>
            <MenuItem value="rejected">مرفوضة</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSave} variant="contained" color="success">حفظ</Button>
      </DialogActions>
    </Dialog>
  );
}
