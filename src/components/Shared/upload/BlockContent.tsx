// @mui
import { Box, Typography, Stack } from '@mui/material';
import Iconify from 'src/components/Shared/Iconify';

// ----------------------------------------------------------------------

export default function BlockContent({ icon, textUpload, textHint }: any) {
  return (
    <>
      <Stack
        alignItems="center"
        justifyContent="center"
        direction={{ xs: 'column' }}
        sx={{ width: 1, textAlign: { xs: 'center' } }}
      >
        <Iconify icon={icon} color="#688BB1" width={40} height={40} />

        <Box>
          <Typography variant="h5" component="span">
            {textUpload}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {textHint}&nbsp;
            <Typography
              variant="body2"
              component="span"
              sx={{ color: 'primary.main', textDecoration: 'underline' }}
            >
              browse
            </Typography>
            &nbsp;your machine
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
