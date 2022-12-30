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
  Typography,
  DialogActions,
  IconButton,
} from '@mui/material';
import _ from 'lodash';

import { useSnackbar } from 'notistack';
import React, { useState, useRef, useEffect, useMemo} from 'react';
import { useWatch } from 'react-hook-form';
import BackgroundLetterAvatars from 'src/components/Shared/BackgroundLetterAvatars';
import Iconify from 'src/components/Shared/Iconify';
import Scrollbar from 'src/components/Shared/Scrollbar';
import axiosInstance from 'src/utils/axios';
import { IProject } from '../../types/project';

interface AssignAdminModalProps {
  open: boolean;
  onClose: () => void;
  admins: any[];
  selectedProject: IProject | null;
  onAssignFinish: (admin: any) => void;
  setAdmins:any;
}

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  open,
  onClose,
  admins,
  selectedProject,
  onAssignFinish,
  setAdmins
}) => {

  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<number>();
  const prevSelectedAdmin = useRef(selectedProject?.adminId)
  const [adminsClone, setAdminsClone ]= useState<any>()


  useEffect(()=>{
    setSelectedAdminId(selectedProject?.adminId)
    setAdminsClone(_.cloneDeep(admins))
  },[selectedProject])

  useEffect(()=>{
    console.log('before',prevSelectedAdmin.current)
    prevSelectedAdmin.current = selectedAdminId
    console.log('after',prevSelectedAdmin.current, selectedAdminId)
  },[selectedAdminId])

  
  if(prevSelectedAdmin.current !== selectedAdminId){
    adminsClone.forEach((admin:any)=>{
      if(admin.id === selectedAdminId) admin.numberOfActiveProjects++
      if(admin.id === prevSelectedAdmin.current) admin.numberOfActiveProjects--  
    })
  }

  const assignAdminHandler = async (adminId: any) => {
    if (!selectedProject) return;
    const admin = adminsClone.find((admin:any)=>admin.id === adminId)
    try {
      setLoading(true);
      if(admin){
        await axiosInstance.put(`/project/${selectedProject._id}/assign/admin`, {
          adminId: admin.id,
        });
  
        onAssignFinish(admin);
        enqueueSnackbar(
          `${admin.fullName} is assigned to ${selectedProject.name} successfully.`,
          { variant: 'success' }
        );
        onClose()
      }
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong.', { variant: 'error' });
    }
    setLoading(false);
  };

  const closeHandler = () => {
    setSelectedAdminId(selectedProject?.adminId)
    setAdminsClone(_.cloneDeep(admins))
    onClose()
  }

  return (
    <Dialog open={open} onClose={closeHandler} maxWidth="md">
      <Box sx={{display:'flex', width:'inherit', justifyContent:'space-between'}}>
        <DialogTitle sx={{backgroundColor:'rgba(243,245,254,255)'}}>Assign Admin</DialogTitle>
        <IconButton onClick={closeHandler} sx={{pb:0, mr:1}}>
            <Iconify icon={'ic:twotone-close'} width='2rem' height='2rem' color='error' style={{color: 'red'}} />
        </IconButton>
      </Box>
      <DialogContent sx={{p:0}}>
        <Box minWidth={800}>
          <Scrollbar>
            <TableContainer sx={{ mt: 3, p:0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SNo.</TableCell>
                    <TableCell align="center">Admins</TableCell>
                    <TableCell align="center">No. of Projects</TableCell>
                    <TableCell align="center">Assign Project</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{backgroundColor:'white', p:0}}>
                  {adminsClone && adminsClone.map((admin:any, index:number) => {
                    const isAssigned = selectedAdminId === admin.id
                    return (
                      <TableRow key={admin.id}>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="center">
                          <Box  sx={{ display: 'flex', pl:10, alignItems:'center'}}>
                            <BackgroundLetterAvatars name={admin.fullName} />
                            <Typography noWrap variant="subtitle2" sx={{ml:1}}>
                              {admin.fullName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {admin.numberOfActiveProjects}
                        </TableCell>
                        <TableCell align="center">
                          {!isAssigned && (
                            <Button
                              variant="outlined"
                              disabled={loading}
                              onClick={() => setSelectedAdminId(admin.id)}
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
      <DialogActions>
                <Box flex={1} sx={{justifyContent:'flex-end'}} display="flex">
                    <Button sx={{backgroundColor:'white', border:'1px solid blue', color:'blue'}}
                        onClick={closeHandler}
                        variant="outlined">
                      Cancel
                    </Button>
                    <Button
                      sx={{ml:2}}
                        onClick={()=>assignAdminHandler(selectedAdminId)}
                        variant="contained"
                        disabled={loading}>
                      Confirm
                    </Button>
                </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AssignAdminModal;
