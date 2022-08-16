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
} from '@mui/material';

import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import Scrollbar from 'src/components/Shared/Scrollbar';
import axiosInstance from 'src/utils/axios';
import { IProject } from '../../types/project';

interface AssignAdminModalProps {
  open: boolean;
  onClose: () => void;
  admins: any[];
  selectedProject: IProject | null;
  onAssignFinish: (admin: any) => void;
}

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  open,
  onClose,
  admins,
  selectedProject,
  onAssignFinish,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const assignAdminHandler = async (admin: any) => {
    if (!selectedProject) return;
    try {
      setLoading(true);

      await axiosInstance.put(`/project/${selectedProject._id}/assign/admin`, {
        adminId: admin.id,
      });

      onAssignFinish(admin);
      enqueueSnackbar(
        `${admin.fullName} is assigned to ${selectedProject.name} successfully.`,
        { variant: 'success' }
      );
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong.', { variant: 'error' });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Assign Admin</DialogTitle>
      <DialogContent>
        <Box minWidth={800}>
          <Scrollbar>
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SNo.</TableCell>
                    <TableCell align="right">Admins</TableCell>
                    <TableCell align="right">No. of Projects</TableCell>
                    <TableCell align="right">Assign Project</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admins.map((admin, index) => {
                    const isAssigned = admin.id === selectedProject?.adminId;
                    return (
                      <TableRow key={admin.id}>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="right">{admin.fullName}</TableCell>
                        <TableCell align="right">
                          {admin.numberOfActiveProjects}
                        </TableCell>
                        <TableCell align="right">
                          {!isAssigned && (
                            <Button
                              variant="outlined"
                              disabled={loading}
                              onClick={() => assignAdminHandler(admin)}
                            >
                              Assign
                            </Button>
                          )}

                          {isAssigned && (
                            <Button variant="contained">Assigned</Button>
                          )}
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
    </Dialog>
  );
};

export default AssignAdminModal;
