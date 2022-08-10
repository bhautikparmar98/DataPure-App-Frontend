import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  Box,
  DialogActions,
  Divider,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import Scrollbar from 'src/components/Shared/Scrollbar';
import { ROLES } from 'src/constants';
import axiosInstance from 'src/utils/axios';
import { IProject } from '../../types/project';

interface EditTeamModalProps {
  open: boolean;
  onClose: () => void;
  users: any[];
  selectedProject: IProject | null;
  onAssignFinish: (qaIds: number[], annotatorsIds: number[]) => void;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  open,
  onClose,
  users,
  selectedProject,
  onAssignFinish,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const assignUserHandler = async () => {
    if (!selectedProject) return;

    try {
      setLoading(true);

      const annotatorsIds = selectedUsers
        .filter((user) => user.role === ROLES.ANNOTATOR.value)
        .map((an) => an.id);
      const qaIds = selectedUsers
        .filter((user) => user.role === ROLES.QA.value)
        .map((q) => q.id);

      await axiosInstance.put(
        `/project/${selectedProject._id}/assign/annotator`,
        { annotatorIds: annotatorsIds }
      );

      await axiosInstance.put(`/project/${selectedProject._id}/assign/qa`, {
        qaIds: qaIds,
      });

      onAssignFinish(qaIds, annotatorsIds);
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong.', { variant: 'error' });
    }
    setLoading(false);
  };

  const isSelected = (userId: number) =>
    selectedUsers.some((user) => userId === user.id);

  const toggleSelection = (user: any) => {
    const isExist = selectedUsers.some((selected) => user.id === selected.id);
    if (!isExist) setSelectedUsers((prev) => [...prev, user]);
    else
      setSelectedUsers((prev) =>
        prev.filter((selected) => selected.id !== user.id)
      );
  };

  const closeHandler = () => {
    setSelectedUsers([]);
    onClose();
  };

  useEffect(() => {
    if (selectedProject) {
      const assignedQAs = users.filter((user) =>
        selectedProject.assignedQAs?.includes(user.id)
      );
      const assignedAnnotators = users.filter((user) =>
        selectedProject.assignedAnnotators?.includes(user.id)
      );

      setSelectedUsers([...assignedQAs, ...assignedAnnotators]);
    }
  }, [selectedProject, users]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Assign Task</DialogTitle>
      <DialogContent>
        <Box minWidth={800}>
          <Scrollbar>
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SNo.</TableCell>
                    <TableCell align="left">Names</TableCell>
                    <TableCell align="center">Role</TableCell>
                    <TableCell align="center">No. of Projects</TableCell>
                    <TableCell align="right">Assign Task</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => {
                    const isAssigned = isSelected(user.id);
                    return (
                      <TableRow key={user.id}>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">{user.fullName}</TableCell>
                        <TableCell align="center">
                          {ROLES[user.role as keyof typeof ROLES].label}
                        </TableCell>
                        <TableCell align="center">
                          {user.numberOfActiveProjects}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant={isAssigned ? 'contained' : 'outlined'}
                            disabled={loading}
                            onClick={() => toggleSelection(user)}
                          >
                            {isAssigned ? 'Selected' : 'Select'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box flex={1} justifyContent="space-between" display="flex">
          <Button onClick={closeHandler} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={assignUserHandler}
            variant="contained"
            disabled={loading}
          >
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditTeamModal;
