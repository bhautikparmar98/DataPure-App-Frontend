import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';
import React from 'react';
import Iconify from 'src/components/Shared/Iconify';
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
        <Box  sx={{display:'flex', width:'inherit', justifyContent:'space-between', backgroundColor:'white'}}>
          <DialogTitle sx={{color:'blue', p:2}}> Add More Images</DialogTitle>
          <IconButton onClick={onClose} sx={{pb:0, mr:1}}>
            <Iconify icon={'ic:twotone-close'} width='2rem' height='2rem' color='error' style={{color: 'red'}} />
          </IconButton>
        </Box>
        <DialogContent sx={{m:1, width:'500px'}}>
          <AddImageForm onSubmit={submitHandler} projectId={projectId} projectType={projectType} onClose={onClose} />
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AddImagesDialog;
