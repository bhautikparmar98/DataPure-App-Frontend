import { Box } from '@mui/material';
import { Container } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import axiosInstance from 'src/utils/axios';
import ProjectListHeader from './Header';
import ProjectBodyList from './List';
import { IProject } from '../types/project';

const ClientProjectsComponent = () => {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);

  const downloadOutputHandler = (id: string) => {
    // TODO: download Output file
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
        <ProjectBodyList
          projects={projects}
          onDownloadOutput={downloadOutputHandler}
        />
      </Box>
    </Container>
  );
};

export default ClientProjectsComponent;
