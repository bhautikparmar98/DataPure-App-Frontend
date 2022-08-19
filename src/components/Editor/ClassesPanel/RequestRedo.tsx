import { Grid, Button } from '@mui/material';
import useAnnotationSubmit from './hooks/useAnnotationSubmit';

const RequestRedo = () => {
  const { requestRedo } = useAnnotationSubmit();
  return (
    <Grid
      justifyContent="space-between"
      mt={3.5}
      mb={5}
      sx={{ display: 'flex' }}
    >
      <Button variant="contained" color="error" onClick={requestRedo}>
        Request Redo
      </Button>
      <Button variant="outlined" sx={{ color: '#313131' }}>
        Exit Canvas
      </Button>
    </Grid>
  );
};
export default RequestRedo;
