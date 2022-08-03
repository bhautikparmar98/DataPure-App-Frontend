import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import axiosInstance from 'src/utils/axios';
import RegisterForm from './RegisterForm';
import { FormValuesProps } from './types/registerForm.Type';

interface AddUserProps {
  open: boolean;
  onClose: (user: any) => void;
}

const AddUserDialog: React.FC<AddUserProps> = ({ open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (data: FormValuesProps) => {
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        role: data.role,
      };

      const response = await axiosInstance.post('/user/invite', payload);
      const { user } = response.data;

      enqueueSnackbar('User Added Successfully!');
      onClose(user);
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong.', { variant: 'error' });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <RegisterForm loading={loading} onSubmit={submitHandler} />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
