import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialog = ({ open, onClose, title, message, type = 'success' }) => {
  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color={type === 'success' ? 'primary' : 'error'}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;