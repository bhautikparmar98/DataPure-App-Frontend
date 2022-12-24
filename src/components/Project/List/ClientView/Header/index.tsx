import { Box, Button, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import Iconify from 'src/components/Shared/Iconify';
import useAuth from 'src/hooks/useAuth';

const ProjectListHeader = () => {
  const { user } = useAuth();
  const router = useRouter();

  const newProjectHandler = () => {
    router.push('/project/add');
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h3">Hey, {user?.fullName}</Typography>
        <Typography variant="body2">Good to have you back!</Typography>
      </Box>

      <Box>
        <IconButton>
          <Iconify  icon="material-symbols:filter-alt" width="2rem" height="2rem" style={{color: '#2065d1'}}></Iconify>
        </IconButton>
        <IconButton>
          <Iconify  icon="system-uicons:side-menu" width="2rem" height="2rem" style={{color: 'blue', marginRight:'#2065d1'}}></Iconify>
        </IconButton>
        <Button
          variant="contained"
          startIcon={<Iconify icon={'eva:plus-fill'} />}
          onClick={newProjectHandler}
          sx={{borderRadius:4}}
        >
          New Project
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectListHeader;
