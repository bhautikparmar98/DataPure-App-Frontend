import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';
import React from 'react';
import { IImage } from '../types';
import AddImageForm from './AddImageForm';

interface AddClassProps {
  open: boolean;
  onClose: () => void;
  onFinishAddingImages: (data: IImage[]) => void;
  projectId: string | string[];
  projectType: string | undefined;
}

const AddImagesDialog: React.FC<AddClassProps> = ({ open, onClose, onFinishAddingImages, projectId, projectType }) => {
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
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        width: '100%',
        '.MuiPaper-root': {
          width: 'auto',
          maxWidth: 'none',
        },
      }}>
      <Box width="100%">
        <DialogTitle>Add Class</DialogTitle>
        <DialogContent>
          <AddImageForm onSubmit={submitHandler} projectId={projectId} projectType={projectType} />
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AddImagesDialog;
