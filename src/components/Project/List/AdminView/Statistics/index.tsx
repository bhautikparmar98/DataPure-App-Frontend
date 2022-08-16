import { Stack, Typography } from '@mui/material';
import React from 'react';
import { IProject } from '../../types/project';

interface AdminProjectStatisticsProps {
  project: IProject;
}

const AdminProjectStatistics: React.FC<AdminProjectStatisticsProps> = ({
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

export default AdminProjectStatistics;
