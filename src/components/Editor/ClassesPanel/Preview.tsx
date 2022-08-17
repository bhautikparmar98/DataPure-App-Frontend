import { Grid } from '@mui/material';
import { useAppSelector } from 'src/redux/store';

const Preview = () => {
  const src = useAppSelector(({ classes }) => classes.src);
  return (
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
        src={src}
        alt="workspace preview"
        style={{ margin: 'auto', width: 'auto', maxHeight: 140 }}
      />
    </Grid>
  );
};
export default Preview;
