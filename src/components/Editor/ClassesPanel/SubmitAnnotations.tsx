import { Grid, Button, Box } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/Shared/Iconify';
// import useAnnotationSubmit from './hooks/useAnnotationSubmit';

function SubmitAnnotations() {
  // const { handleSubmit, handleReset } = useAnnotationSubmit();
  return (
    <Box>
      <Grid container justifyContent="space-around">
        {/* <Button
        variant="outlined"
        onClick={(e) => {}}
        startIcon={<Iconify icon={'ant-design:reload-outlined'} />}
      >
        Reset
      </Button> */}
        <Button
          variant="contained"
          onClick={(e) => {}}
          startIcon={<Iconify icon={'ic:outline-done'} />}
        >
          Save
        </Button>
      </Grid>
    </Box>
  );
}
export default SubmitAnnotations;
