import { Stack, Typography } from '@mui/material';
import React from 'react';
import { IProject } from '../../types/project';

interface SuperAdminProjectStatisticsProps {
  project: IProject;
  admins: any[];
}

const SuperAdminProjectStatistics: React.FC<
  SuperAdminProjectStatisticsProps
> = ({ project, admins }) => {
  const adminName =
    admins.find((a) => a.id === project.adminId)?.firstName || '';

  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="caption">
        <strong>Admin</strong>: {adminName}
      </Typography>

      <Typography variant="caption">
        <strong>QA:</strong>
        {'   '}
      </Typography>

      <Typography variant="caption">
        <strong>Annotators:</strong>
        {'   '}
      </Typography>
    </Stack>
  );
};

export default SuperAdminProjectStatistics;
