import { Grid, Button, Box } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/Shared/Iconify';
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import useAnnotationSubmit from './hooks/useAnnotationSubmit';

function SubmitAnnotations({ newAnnotationData }: any) {
  const { role } = useAuth();

  const { handleSubmit, handleReset, handleApproveImage } =
    useAnnotationSubmit();
  return (
    <Box alignSelf='flex-end' mt='auto' sx={{ width: '100%' }}>
      <Grid
        container
        justifyContent='space-around'
        mt={3}
        sx={{ display: 'flex' }}
      >
        {ROLES.ANNOTATOR.value === role && (
          <Button
            variant='outlined'
            onClick={(e) => {
              handleReset();
            }}
            startIcon={<Iconify icon={'ant-design:reload-outlined'} />}
          >
            Reset
          </Button>
        )}
        <Button
          variant='contained'
          onClick={(e) => {
            handleSubmit(true, newAnnotationData);
          }}
          startIcon={<Iconify icon={'ic:outline-done'} />}
        >
          {ROLES.CLIENT.value === role ? 'Done' : 'Save'}
        </Button>
        {ROLES.QA.value === role && (
          <Button
            variant='contained'
            onClick={handleApproveImage}
            startIcon={<Iconify icon={'ic:outline-done'} />}
          >
            Approve
          </Button>
        )}
      </Grid>
    </Box>
  );
}
export default SubmitAnnotations;
