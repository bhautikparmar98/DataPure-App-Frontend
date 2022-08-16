import { Grid } from '@mui/material';

const Preview = () => (
  // const src = useAppSelector(({ classes }) => classes.src);

  <Grid
    sx={{
      border: '5px solid yellow',
      background: '#C6C6C6',
      height: 150,
    }}
    alignItems="center"
    container
  >
    <img
      src={'/images/3-compressed.jpg'}
      alt="workspace preview"
      style={{ margin: 'auto', width: '100%' }}
    />
  </Grid>
);
export default Preview;
