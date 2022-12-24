import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import Iconify from 'src/components/Shared/Iconify';
import axiosInstance from 'src/utils/axios';
import { downloadFile } from 'src/utils/downloadFile';
import ProjectGrid from '../../Shared/ProjectGrid';
import { IProject } from '../../types/project';
import AssignAdminModal from '../AssignAdminModal';
import SuperAdminProjectStatistics from '../Statistics';

interface SuperAdminClientProjectsProps {
  clientId: number | null;
  admins: any[];
  setAdmins: any
}

const SuperAdminClientProjects: React.FC<SuperAdminClientProjectsProps> = ({
  clientId,
  admins,
  setAdmins
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [assignAdminModalOpened, setAssignAdminModalOpened] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const viewDataSetHandler = (id: string) => {
    router.push(`/project/${id}/dataset`);
  };

  const downloadOutputHandler = async (project: IProject) => {
    setDownloadLoading(true);
    try {
      await downloadFile(`/project/${project._id}/download`, project.name);
    } catch (error) {
      console.log('error', error);
    }
    setDownloadLoading(false);
  };

  const assignModalHandler = (project: IProject) => {
    setSelectedProject(project);
    setAssignAdminModalOpened(true);
  };

  const assignAdminToProjectFinishHandler = (admin: any) => {
    const updatedProjects = [...projects];
    const updatedAdmins = [...admins];

    const index = updatedProjects.findIndex(
      (p) => p._id === selectedProject?._id
    );
    const comingAdminIndex = updatedAdmins.findIndex((a) => a.id === admin.id);

    if (index < 0 || comingAdminIndex < 0) {
      return console.log('something went wrong');
    }

    if (updatedProjects[index].adminId) {
      const prevAdminIndex = updatedAdmins.findIndex(
        (a) => a.id === updatedProjects[index].adminId
      );

      // decrease the number of working project locally on the prev admin
      updatedAdmins[prevAdminIndex].numberOfActiveProjects =
        updatedAdmins[prevAdminIndex].numberOfActiveProjects - 1;
    }

    updatedProjects[index].adminId = admin.id;
    // increase the number of working projects on coming assigned admin
    updatedAdmins[comingAdminIndex].numberOfActiveProjects =
      updatedAdmins[comingAdminIndex].numberOfActiveProjects + 1;

    setSelectedProject((p: any) => ({ ...p, adminId: admin.id }));
    setProjects(updatedProjects);
  };

  const closeAssignAdminModalHandler = () => {
    setSelectedProject(null);
    setAssignAdminModalOpened(false);
  };

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get(`/user/${clientId}/project`);
        const { projects } = response.data;

        setProjects(projects);
      } catch (error) {
        console.log('error', error);
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
      setLoading(false);
    };

    if (clientId) getProjects();
  }, [clientId, enqueueSnackbar]);

  if (!clientId) {
    return (
      <Box
        flex={1}
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        sx={{pt:7}}
      >
        <Iconify icon='clarity:home-solid' width={100} height={100} />
        <Typography variant='subtitle2'>
          Please select client to get his projects
        </Typography>
      </Box>
    );
  }

  if (clientId && projects.length === 0 && !loading) {
    return (
      <Box
        flex={1}
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Iconify icon='cil:grid-slash' width={100} height={100} />
        <Typography variant='subtitle2'>Oops, It's Empty</Typography>
      </Box>
    );
  }

  return (
    <>
      <AssignAdminModal
        open={assignAdminModalOpened}
        onClose={closeAssignAdminModalHandler}
        admins={admins}
        selectedProject={selectedProject}
        onAssignFinish={assignAdminToProjectFinishHandler}
        setAdmins={setAdmins}
      />
      <ProjectGrid
        projects={projects}
        renderStatistics={(project: IProject) => (
          <SuperAdminProjectStatistics project={project} admins={admins} />
        )}
        actions={[
          {
            label: '',
            action: (project: IProject) => downloadOutputHandler(project),
            variant: 'icon',
            icon: 'material-symbols:download-for-offline-outline-rounded',
            disabled: downloadLoading,
          },
          {
            label: 'View Dataset',
            action: (project: IProject) => viewDataSetHandler(project._id!),
            variant: 'outlined',
          },
          {
            label: 'Assign Admin',
            action: (project: IProject) => assignModalHandler(project),
            variant: 'contained',
          },
        ]}
      />
    </>
  );
};

export default SuperAdminClientProjects; 
