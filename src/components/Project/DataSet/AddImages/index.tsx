import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { IImage } from '../types';
import AddImageForm from './AddImageForm';

interface AddClassProps {
  open: boolean;
  onClose: () => void;
  onFinishAddingImages: (data: IImage[]) => void;
  projectId: string | string[];
}

const AddImagesDialog: React.FC<AddClassProps> = ({
  open,
  onClose,
  onFinishAddingImages,
  projectId,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = (images: IImage[]) => {
    try {
      onFinishAddingImages(images);
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
        <AddImageForm onSubmit={submitHandler} projectId={projectId} />
      </DialogContent>
    </Dialog>
  );
};

export default AddImagesDialog;
