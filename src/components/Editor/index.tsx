import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import Iconify from 'src/components/Shared/Iconify';
import useAuth from 'src/hooks/useAuth';
import ClassesPanel from './ClassesPanel';
import useFetchImage from './hooks/useFetchImage';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

const Editor = () => {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const { role } = useAuth();
  useFetchImage(id, role);
  return (
    <div id="editor">
      <Toolbar />
      <div style={{ marginLeft: 70 }}>
        <Workspace />
      </div>
      <ClassesPanel />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ fontSize: '1.2rem' }}
        pr={28.5}
      >
        <Iconify
          icon={'bi:arrow-left-circle'}
          sx={{ marginLeft: 5, cursor: 'pointer' }}
        />
        <span style={{ padding: '10px 15px' }}>1 of 2</span>
        <Iconify
          icon={'bi:arrow-right-circle'}
          sx={{ marginRight: 5, cursor: 'pointer' }}
        />
      </Grid>
    </div>
  );
};
export default Editor;
