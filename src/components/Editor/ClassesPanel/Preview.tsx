import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

const Preview = () => {
  const src = useSelector((state: RootState) => state.classes.src);
  return src?.length > 0 ? (
    <Grid
      sx={{
        border: '5px solid rgba(48,63,191,255)',
        background: '#C6C6C6',
        height: 150,
      }}
      alignItems="center"
      container>
      <img src={src} alt="workspace preview" style={{ margin: '0px', width: 'inherit', maxHeight: 140 }} />
    </Grid>
  ) : null;
};
export default Preview;
