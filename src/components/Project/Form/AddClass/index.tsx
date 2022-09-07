import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import ClassForm from './ClassForm';

interface AddClassProps {
  open: boolean;
  onClose: () => void;
  onFinishAddingClass: (data: {
    name: string;
    color: string;
    id: string;
  }) => void;
}

const AddClassDialog: React.FC<AddClassProps> = ({
  open,
  onClose,
  onFinishAddingClass,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = (data: { name: string; color: string; id: string }) => {
    try {
      onFinishAddingClass(data);
      onClose();
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong.', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Class</DialogTitle>
      <DialogContent>
        <ClassForm onSubmit={submitHandler} />
      </DialogContent>
    </Dialog>
  );
};

export default AddClassDialog;
