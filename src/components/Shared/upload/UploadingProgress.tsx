import { LinearProgress } from '@mui/material';
import React from 'react';

const UploadingProgress = ({
  progress,
  buffer,
}: {
  progress: number;
  buffer: number;
}) => (
  <LinearProgress
    variant="buffer"
    value={progress}
    valueBuffer={buffer ? buffer : undefined}
    color="primary"
  />
);

export default UploadingProgress;
