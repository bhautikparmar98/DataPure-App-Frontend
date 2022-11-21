import { Alert, AlertTitle, Box } from '@mui/material';
import { Container } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useEffect, useState, useCallback } from 'react';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';

import _ from 'lodash';
import { useRouter } from 'next/router';
import axiosInstance from 'src/utils/axios';
import { downloadFile } from 'src/utils/downloadFile';
import ProjectGrid from '../Shared/ProjectGrid';
import { IProject } from '../types/project';
import DeleteProjectModal from './DeleteProjectModal';
import ProjectListHeader from './Header';
import ClientProjectStatistics from './Statistics';

const ClientProjectsComponent = () => {
  const { themeStretch } = useSettings();
  const router = useRouter();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectId, setProjectId] = useState('');

  const onCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setProjectId('');
  }, []);

  const downloadOutputHandler = async (project: IProject) => {
    setDownloadLoading(true);
    try {
      await downloadFile(`/project/${project._id}/download`, project.name);
    } catch (error) {
      console.log('error', error);
    }
    setDownloadLoading(false);
  };

  const deleteProject = useCallback(
    (project: IProject) => {
      console.log(project);
      if (project._id) {
        setProjectId(project._id);
        setDeleteModalOpen(true);
      }
    },
    [projectId]
  );

  const onFinishDeleteProject = useCallback(
    (id: string) => {
      let newProjects = _.cloneDeep(projects);
      newProjects = newProjects.filter((project) => project._id !== id);
      setProjects(newProjects);
    },
    [projectId]
  );

  const viewDataSetHandler = (id: string) => {
    router.push(`/project/${id}/dataset`);
  };

  const reviewHandler = (id: string) => {
    router.push(`/project/${id}/review`);
  };

  const getProjects = async () => {
    setLoading(true);

    if (user === null) throw new Error('Client can not be null');

    try {
      const response = await axiosInstance.get(`/user/${user.id}/project`);
      const { projects } = response.data;
      setProjects(projects);
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong.', { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <ProjectListHeader />

      <Box sx={{ mt: 4 }}>
        {!loading && projects.length === 0 && (
          <Alert severity="info">
            <AlertTitle>No Projects</AlertTitle>
            You don't have any projects yet, please create one.
          </Alert>
        )}

        <ProjectGrid
          renderStatistics={(project) => (
            <ClientProjectStatistics project={project} />
          )}
          projects={projects}
          syncProjectData={() => getProjects()}
          actions={[
            {
              label: '',
              action: (project: IProject) => downloadOutputHandler(project),
              variant: 'icon',
              icon: 'ant-design:download-outlined',
              disabled: downloadLoading,
            },
            {
              label: '',
              action: (project: IProject) => deleteProject(project),
              variant: 'icon',
              icon: 'ant-design:delete-outlined',
              color: 'error',
            },
            {
              label: 'View Dataset',
              action: (project: IProject) => viewDataSetHandler(project._id!),
              variant: 'outlined',
            },
            {
              label: 'Review',
              action: (project: IProject) => reviewHandler(project._id!),
              variant: 'contained',
            },
          ]}
          metaButton={true}
        />
        {deleteModalOpen && (
          <DeleteProjectModal
            projectId={projectId}
            onClose={onCloseDeleteModal}
            onFinishDeleteProject={(id) => onFinishDeleteProject(id)}
          />
        )}
      </Box>
    </Container>
  );
};

export default ClientProjectsComponent;
