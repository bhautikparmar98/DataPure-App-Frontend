import { Alert, AlertTitle, Box } from '@mui/material';
import { Container } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import axiosInstance from 'src/utils/axios';
import ProjectListHeader from './Header';
import ProjectGrid from '../Shared/ProjectGrid';
import { IProject } from '../types/project';
import { useRouter } from 'next/router';

const ClientProjectsComponent = () => {
  const { themeStretch } = useSettings();
  const router = useRouter();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);

  const downloadOutputHandler = (id: string) => {
    // TODO: download Output file
  };

  const viewDataSetHandler = (id: string) => {
    router.push(`/project/${id}/dataset`);
  };

  const reviewHandler = (id: string) => {
    router.push(`/project/${id}/review`);
  };

  useEffect(() => {
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
          projects={projects}
          onDownloadOutput={downloadOutputHandler}
          actions={[
            {
              label: '',
              action: (project: IProject) =>
                downloadOutputHandler(project._id!),
              variant: 'icon',
              icon: 'ant-design:download-outlined',
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
        />
      </Box>
    </Container>
  );
};

export default ClientProjectsComponent;
