import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/Shared/Iconify';
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import {
  initializeState,
  resetState,
} from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';
import ClassesPanel from './ClassesPanel';
import useFetchImage from './hooks/useFetchImage';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

const Editor = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { role } = useAuth();
  const { images } = useFetchImage(id, role);

  const dispatch = useAppDispatch();
  let indicatorsHeight = ROLES.CLIENT.value === role ? 50 : 0;

  const imgId = localStorage.getItem(id);
  let initialIndex = 0;
  useEffect(() => {
    if (typeof imgId === 'string' && imgId?.length > 0) {
      const foundIndex = images.findIndex((img: any) => img._id! === imgId);
      if (foundIndex >= 0) initialIndex = foundIndex;
    }
  }, [imgId, id]);

  const [imgIndex, setImgIndex] = useState(initialIndex);

  const getNextImg = () => {
    if (imgIndex < images.length - 1) {
      setImgIndex((prev) => prev + 1);
      // dispatch(resetState());
      dispatch(
        initializeState({
          images: [images[imgIndex]],
        })
      );
    }
  };
  const getPrevImg = () => {
    if (imgIndex > 0) {
      setImgIndex((prev) => prev - 1);
      // dispatch(resetState());
      dispatch(
        initializeState({
          images: [images[imgIndex]],
        })
      );
    }
  };

  const TOOLBAR_WIDTH = 70;
  const LAYERS_PANEL_WIDTH = 300;
  const WIDTH = window.innerWidth - (TOOLBAR_WIDTH + LAYERS_PANEL_WIDTH);
  const HEIGHT = window.innerHeight - indicatorsHeight;
  return (
    <div id="editor">
      <Toolbar />
      <div style={{ marginLeft: 70 }}>
        <Workspace
          TOOLBAR_WIDTH={TOOLBAR_WIDTH}
          LAYERS_PANEL_WIDTH={LAYERS_PANEL_WIDTH}
          WIDTH={WIDTH}
          HEIGHT={HEIGHT}
        />
      </div>
      <ClassesPanel />
      {ROLES.CLIENT.value === role && (
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
            onClick={(e) => getPrevImg()}
          />
          <span style={{ padding: '10px 15px' }}>
            {imgIndex + 1} of {images.length}
          </span>
          <Iconify
            icon={'bi:arrow-right-circle'}
            sx={{ marginRight: 5, cursor: 'pointer' }}
            onClick={(e) => getNextImg()}
          />
        </Grid>
      )}
    </div>
  );
};
export default Editor;
