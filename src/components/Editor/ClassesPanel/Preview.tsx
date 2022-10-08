import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

const Preview = () => {
  const src: string = useSelector(({ classes }: RootState) => classes.src);
  return src?.length > 0 ? (
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
  ) : null;
};
export default Preview;
