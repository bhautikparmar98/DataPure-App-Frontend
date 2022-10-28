import { useState } from 'react';
import { Typography, Box, Modal, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import React from 'react';
import { IProject } from '../../types/project';
import axiosInstance from 'src/utils/axios';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface DeleteProjectProps {
  projectId: string;
  onFinishDeleteProject: (projectId: string) => void;
  onClose: VoidFunction;
}

const DeleteProjectModal: React.FC<DeleteProjectProps> = ({ projectId, onClose, onFinishDeleteProject }) => {
  const [deleting, setDeleting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const deleteHandler = async () => {
    try {
      setDeleting(true);
      const response = await axiosInstance.delete(`/project/${projectId}`);

      if (!response.data.success) throw new Error(response.data.message);
      setDeleting(false);

      onFinishDeleteProject(projectId);
      onClose();
      enqueueSnackbar(response?.data.message || 'Project deleted successfully', { variant: 'success' });
    } catch (error) {
      setDeleting(false);
      return enqueueSnackbar(error?.message || "We couldn't delete the project now. Please, try again later.", {
        variant: 'error',
      });
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="body2" mb={2}>
          Are you sure you want to delete this project?
        </Typography>
        <Box justifyContent="center" display="flex" pt={2}>
          <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
            Cancel
          </Button>

          <LoadingButton
            loading={deleting}
            onClick={deleteHandler}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}>
            Delete
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteProjectModal;
