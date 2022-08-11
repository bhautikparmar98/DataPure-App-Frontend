import { Container, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import useSettings from 'src/hooks/useSettings';
import axiosInstance from 'src/utils/axios';
import { IProject } from '../types/project';
import AssignAdminModal from './AssignAdminModal';
import SuperAdminClientProjects from './Body';
import ClientList from './ClientList';

const SuperAdminProjectsComponents = () => {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const [admins, setAdmins] = useState([]);

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const selectClientHandler = (clientId: number) => {
    setSelectedClientId(clientId);
  };

  useEffect(() => {
    const getAdmins = async () => {
      try {
        const response = await axiosInstance.get('/user/admins');
        const { admins } = response.data;
        setAdmins(admins);
      } catch (error) {
        console.log('error');
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
    };

    getAdmins();
  }, []);

  return (
    <Grid
      container
      spacing={2}
      component="div"
      sx={{ height: '100%', mt: 0, mb: 0 }}
    >
      <Grid item xs={6} md={2} style={{ paddingTop: 0, paddingBottom: 0 }}>
        <ClientList
          onSelectedClient={selectClientHandler}
          selectedClientId={selectedClientId}
        />
      </Grid>

      <Grid item xs={6} md={10}>
        <Container
          maxWidth={themeStretch ? false : 'lg'}
          // style={{ display: 'flex' }}
        >
          <SuperAdminClientProjects
            clientId={selectedClientId}
            admins={admins}
          />
        </Container>
      </Grid>
    </Grid>
  );
};

export default SuperAdminProjectsComponents;
