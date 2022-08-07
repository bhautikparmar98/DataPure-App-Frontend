import { Box, LinearProgress, Typography } from '@mui/material';
import React from 'react';

const UploadingProgress = ({
  progress,
  buffer,
}: {
  progress: number;
  buffer: number;
}) => (
  <Box sx={{ my: 4 }}>
    <Box display="flex" justifyContent="flex-end">
      <Typography variant="subtitle2">{progress}</Typography>
    </Box>
    <LinearProgress
      variant="buffer"
      value={progress}
      valueBuffer={buffer}
      color="primary"
    />
  </Box>
);

export default UploadingProgress;
