import { Stack, Typography } from '@mui/material';
import React from 'react';
import { IProject } from '../../types/project';

interface ClientProjectStatisticsProps {
  project: IProject;
}

const ClientProjectStatistics: React.FC<ClientProjectStatisticsProps> = ({
  project,
}) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="caption">
      <strong>QA:</strong>
      {project.assignedQAs.length}
    </Typography>

    <Typography variant="caption">
      <strong>Annotators:</strong>
      {project.assignedAnnotators.length}
    </Typography>
  </Stack>
);

export default ClientProjectStatistics;