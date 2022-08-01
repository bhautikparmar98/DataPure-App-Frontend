import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import React from 'react';
import RegisterForm from './RegisterForm';
import { FormValuesProps } from './types/registerForm.Type';

interface AddUserProps {
  open: boolean;
  onClose: () => void;
}

const AddUserDialog: React.FC<AddUserProps> = ({ open, onClose }) => {
  const submitHandler = async (data: FormValuesProps) => {
    console.log(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <RegisterForm onSubmit={submitHandler} />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
