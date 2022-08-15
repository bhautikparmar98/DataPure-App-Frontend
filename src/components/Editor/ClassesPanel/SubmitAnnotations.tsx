import { Grid, Button } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/Shared/Iconify';
import useAnnotationSubmit from './hooks/useAnnotationSubmit';

const SubmitAnnotations = () => {
  const { handleSubmit, handleReset } = useAnnotationSubmit();
  return (
    <Grid container justifyContent="space-around" mt={4}>
      <Button
        variant="outlined"
        onClick={handleReset}
        startIcon={<Iconify icon={'ant-design:reload-outlined'} />}
      >
        Reset
      </Button>
      <Button
        variant="contained"
        onClick={(e) => handleSubmit(true)}
        startIcon={<Iconify icon={'ic:outline-done'} />}
      >
        Done
      </Button>
    </Grid>
  );
};
export default SubmitAnnotations;
