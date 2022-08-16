import { Divider, Stack, Typography, Button, Box } from '@mui/material';
import React from 'react';
import { IProject } from '../../types/project';

interface QAProjectStatisticsProps {
  pendingRedo: number;
  redoHandler: () => void;
}

const QAProjectStatistics: React.FC<QAProjectStatisticsProps> = ({
  pendingRedo,
  redoHandler,
}) => (
  <Box marginTop={2}>
    <Divider />
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      mt={2}
    >
      <Typography variant="caption">
        <strong>Pending Redo: </strong>
        {pendingRedo}
      </Typography>

      <Button onClick={redoHandler} variant="outlined" color="error">
        Re-do
      </Button>
    </Stack>
  </Box>
);

export default QAProjectStatistics;
