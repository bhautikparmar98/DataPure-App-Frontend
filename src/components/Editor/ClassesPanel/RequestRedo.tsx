import { Grid, Button, Link } from '@mui/material';
import Iconify from 'src/components/Shared/Iconify';
import useAnnotationSubmit from './hooks/useAnnotationSubmit';

import NextLink from 'next/link';

const RequestRedo = () => {
  const { requestRedo } = useAnnotationSubmit();
  return (
    <Grid
      justifyContent="space-between"
      alignItems="center"
      mt={3.5}
      mb={5}
      sx={{ display: 'flex' }}
    >
      <Button variant="contained" color="error" onClick={requestRedo}>
        Request Redo
      </Button>
      <NextLink href="/project/list" passHref style={{ color: '#313131' }}>
        <Link
          variant="body1"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none !important',
          }}
        >
          <Iconify icon="ic:baseline-logout" />
          <span style={{ paddingLeft: 5 }}>Exit Canvas</span>
        </Link>
      </NextLink>
    </Grid>
  );
};
export default RequestRedo;
