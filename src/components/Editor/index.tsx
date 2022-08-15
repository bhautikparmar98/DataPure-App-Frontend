import ClassesPanel from './ClassesPanel';
import useFetchImage from './hooks/useFetchImage';
import Toolbar from './Toolbar';
import Workspace from './Workspace';
import { useRouter } from 'next/router';
import useAuth from 'src/hooks/useAuth';
import Iconify from 'src/components/Shared/Iconify';
import { Grid } from '@mui/material';
const Editor = () => {
  const router = useRouter();
  const id: string = router.query.id;
  const { role } = useAuth();
  useFetchImage(id, role);

  return (
    <div>
      <Toolbar />
      <div style={{ marginLeft: 70 }}>
        <Workspace />
      </div>
      <ClassesPanel />
      <Grid container justifyContent="center" alignItems="center">
        <Iconify
          icon={'bi:arrow-left-circle'}
          sx={{ marginLeft: 5, cursor: 'pointer' }}
        />
        1 of 2
        <Iconify
          icon={'bi:arrow-right-circle'}
          sx={{ marginRight: 5, cursor: 'pointer' }}
        />
      </Grid>
    </div>
  );
};
export default Editor;
