import { Grid, Button, Box } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/Shared/Iconify';
import useAnnotationSubmit from './hooks/useAnnotationSubmit';

function SubmitAnnotations() {
  const { handleSubmit, handleReset } = useAnnotationSubmit();
  return (
    <Box alignSelf="flex-end" mt="auto" sx={{ width: '100%' }}>
      <Grid
        container
        justifyContent="space-around"
        mt={3}
        sx={{ display: 'flex' }}
      >
        <Button
          variant="outlined"
          onClick={(e) => {
            handleReset();
          }}
          startIcon={<Iconify icon={'ant-design:reload-outlined'} />}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={(e) => {
            handleSubmit(true);
          }}
          startIcon={<Iconify icon={'ic:outline-done'} />}
        >
          Save
        </Button>
      </Grid>
    </Box>
  );
}
export default SubmitAnnotations;
