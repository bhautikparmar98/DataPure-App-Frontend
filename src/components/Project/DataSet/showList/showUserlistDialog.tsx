import { ListProp } from '../index';
import _ from 'lodash';
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
    DialogActions
} from '@mui/material';
import Scrollbar from 'src/components/Shared/Scrollbar';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';


const ShowUserlistDialog: React.FC<ListProp> = ({ open, onClose, project, Users, setProject, typeofUser }) => {

    const [assignedUsersId, setassignedUsers] = useState<any>();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [initialUsers, setinitialUsers] = useState<any>();

    useEffect(() => {
        if (typeofUser === "QAs") {
            setassignedUsers(project?.assignedQAs);
            console.log("QA use effect is called")
        }
        else {
            setassignedUsers(project?.assignedAnnotators);
            console.log("Annotator use effect is called")
        }
        setinitialUsers(_.cloneDeep(Users))
    }, [project, typeofUser])

    const isSelected = (userId: number) => {
        if (assignedUsersId) {
            return assignedUsersId.some((id: number) => userId === id);
        }
        return false;
    }

    const assignQAHandler = async () => {
        try {
            setLoading(true);
            if (typeofUser === "QAs") {
                await axiosInstance.put(`/project/${project?._id}/assign/qa`, {
                    qaIds: assignedUsersId,
                });
            } else {
                await axiosInstance.put(`/project/${project?._id}/assign/annotator`, {
                    annotatorIds: assignedUsersId,
                });
            }
            if (typeofUser === "QAs" && project != null && project.assignedQAs != undefined) {
                project.assignedQAs = assignedUsersId;
                setProject(project);
                onClose();
            }
            else {
                if (project != null && project.assignedAnnotators != undefined) {
                    project.assignedAnnotators = assignedUsersId;
                    setProject(project);
                    onClose();
                }
            }
        } catch (error) {
            console.log('error', error);
            enqueueSnackbar('Something went wrong.', { variant: 'error' });
        }
        setLoading(false);
    };

    const toggleSelection = (user: any, index: number) => {
        const isExist = isSelected(user.id)
        if (!isExist) {
            setassignedUsers((prev: number[]) => [...prev, user.id]);
            if (initialUsers) {
                initialUsers[index].numberOfActiveProjects++;
            }
        }
        else {
            setassignedUsers((prev: number[]) =>
                prev.filter((id: number) => id !== user.id)
            );
            if (initialUsers) {
                initialUsers[index].numberOfActiveProjects--;
            }
        }
    };


    const closeHandler = () => {
        if (typeofUser === "QAs") {
            setassignedUsers(project?.assignedQAs);
        } else {
            setassignedUsers(project?.assignedAnnotators);
        }
        setinitialUsers(_.cloneDeep(Users))
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={closeHandler}
            sx={{
                width: '100%',
                '.MuiPaper-root': {
                    width: 'auto',
                    maxWidth: 'none',
                },
            }}>
            <DialogTitle>{typeofUser === "QAs" ? `QAs` : `Annotaros`} List</DialogTitle>
            <DialogContent>
                <Box minWidth={800}>
                    <Scrollbar>
                        {initialUsers?.length === 0 && `No Users users found`}
                        {initialUsers && initialUsers.length > 0 && <TableContainer sx={{ mt: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>SNo.</TableCell>
                                        <TableCell align="left">Names</TableCell>
                                        <TableCell align="center">Email</TableCell>
                                        <TableCell align="center">No. of Projects</TableCell>
                                        <TableCell align="right">Assign Task</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {initialUsers?.map((user: any, index: number) => {
                                        const isAssigned = isSelected(user.id);
                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell align="left">{user.fullName}</TableCell>
                                                <TableCell align="center">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {user.numberOfActiveProjects}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant={isAssigned ? 'contained' : 'outlined'}
                                                        onClick={() => toggleSelection(user, index)}
                                                        disabled={loading}
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
                        }
                    </Scrollbar>
                </Box>
            </DialogContent>
            <DialogActions>
                <Box flex={1} justifyContent="space-between" display="flex">
                    <Button onClick={closeHandler} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={assignQAHandler}
                        variant="contained"
                        disabled={loading}
                    >
                        Confirm
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default ShowUserlistDialog

