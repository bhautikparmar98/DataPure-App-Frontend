// @mui
import { Box, Typography, Stack } from '@mui/material';
// assets
import { UploadIllustration } from 'src/assets';
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

export default function BlockContent({
  minHeight,
  label,
}: {
  minHeight?: number;
  label?: string;
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
    >
      {/* <UploadIllustration label={label} sx={{ width: 290 }} /> */}
      <Box  sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Iconify icon="ic:round-cloud-upload" width="10rem" height="10rem" style={{color: "#616fe4"}}></Iconify>
        <Box sx={{ p: 3 }}>
          <Typography gutterBottom variant="h5">
            {`${label} to Upload`}
          </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{ color: 'primary.main', textDecoration: 'underline', textAlign:'center' }}
            >
              or browse
            </Typography>
            {label?.includes('Image') ? <Typography
              component="div"
              sx={{fontSize:'small',  textAlign:'center'}}
            >
              jpeg, png, svg, tiff or raw
            </Typography>:
            <Typography  sx={{fontSize:'small'}}>&nbsp;</Typography>
            }
        </Box>
      </Box>

      {/* <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          {label ? label : 'Drag and drop to Upload'}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Drop files here or click&nbsp;
          <Typography
            variant="body2"
            component="span"
            sx={{ color: 'primary.main', textDecoration: 'underline' }}
          >
            browse
          </Typography>
          &nbsp;thorough your machine
        </Typography>
      </Box> */}
    </Stack>
  );
}
