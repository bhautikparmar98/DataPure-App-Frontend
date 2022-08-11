import { Box, Button, Typography } from '@mui/material';
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
    </Box>
  );
};

export default ProjectListHeader;
