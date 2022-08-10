import { Stack, Typography } from '@mui/material';
import React from 'react';
import { IProject } from '../../types/project';

interface QAProjectStatisticsProps {
  pendingQA: number;
  submitted: number;
}

const QAProjectStatistics: React.FC<QAProjectStatisticsProps> = ({
  pendingQA,
  submitted,
}) => (
  <Stack direction="column" spacing={1}>
    <Typography variant="caption">
      <strong>Submitted for QA: </strong>
      {pendingQA}
    </Typography>

    <Typography variant="caption">
      <strong>Reviewed by QA: </strong>
      {submitted}
    </Typography>
  </Stack>
);

export default QAProjectStatistics;
