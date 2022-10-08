import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Iconify from 'src/components/Shared/Iconify';
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { initState } from 'src/redux/slices/classes/classes.slice';
import ClassesPanel from './ClassesPanel';
import useFetchImage from './hooks/useFetchImage';
import useImageComments from './hooks/useImageComments';
import Toolbar from './Toolbar';
import Workspace from './Workspace';
import { RootState } from 'src/redux/store';

const Editor = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { role } = useAuth();
  const imageId: string = useSelector(
    (state: RootState) => state.classes.imageId
  );

  const { images, removeImage, isAnnotatorRedo } = useFetchImage(id);

  const { addComment, deleteComment } = useImageComments({
    isAnnotatorRedo,
    imageId,
  });

  const dispatch = useDispatch();

  const [imgIndex, setImgIndex] = useState(0);

  let indicatorsHeight = ROLES.CLIENT.value === role ? 50 : 0;

  useEffect(() => {
    const getIndexedImage = () => {
      const imgId = localStorage.getItem(id);

      if (typeof imgId === 'string' && imgId?.length > 0) {
        const foundIndex = images.findIndex((img: any) => img._id! === imgId);
        if (foundIndex >= 0) {
          setImgIndex(foundIndex);

          localStorage.removeItem(id);

          // initialize state with requested image
          dispatch(
            initState({
              state: {
                images: [images[foundIndex]],
              },
            })
          );
        }
      }
    };

    if (images?.length) getIndexedImage();
  }, [id, images?.length]);

  const getNextImg = () => {
    if (imgIndex < images.length - 1) {
      const newIndex = imgIndex + 1;
      setImgIndex(newIndex);
      // dispatch(resetState());
      dispatch(
        initState({
          state: {
            images: [images[newIndex]],
          },
        })
      );
    }
  };

  const getPrevImg = () => {
    if (imgIndex > 0) {
      const newIndex = imgIndex - 1;
      setImgIndex(newIndex);
      // dispatch(resetState());
      dispatch(
        initState({
          state: {
            images: [images[newIndex]],
          },
        })
      );
    }
  };

  const requestRedoHandler = useCallback((imgId: string) => {
    if (images.length === 1) return router.push(`/project/${id}/review`);

    let ind = imgIndex;
    if (imgIndex > 0) {
      ind = ind - 1;
      setImgIndex(ind);
    }

    const newImages = removeImage(imgId);

    dispatch(
      initState({
        state: {
          images: [newImages[ind]],
        },
      })
    );
  }, []);

  const TOOLBAR_WIDTH = 70;
  const LAYERS_PANEL_WIDTH = 300;
  const WIDTH = window.innerWidth - (TOOLBAR_WIDTH + LAYERS_PANEL_WIDTH);
  const HEIGHT = window.innerHeight - indicatorsHeight;
  return (
    <div id="editor">
      <Toolbar isAnnotatorRedo={isAnnotatorRedo} />
      <div style={{ marginLeft: 70 }}>
        <Workspace
          TOOLBAR_WIDTH={TOOLBAR_WIDTH}
          LAYERS_PANEL_WIDTH={LAYERS_PANEL_WIDTH}
          WIDTH={WIDTH}
          HEIGHT={HEIGHT}
          onAddComment={addComment}
          onDeleteComment={deleteComment}
        />
      </div>
      {/* //!Fix: This component children re-render with each redux state change */}
      <ClassesPanel onRequestRedoFinish={requestRedoHandler} />
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
            sx={{
              marginLeft: 5,
              cursor: 'pointer',
              opacity: imgIndex === 0 ? 0.2 : 1,
            }}
            onClick={(e) => getPrevImg()}
          />
          <span style={{ padding: '10px 15px' }}>
            {imgIndex + 1} of {images.length || 1}
          </span>
          <Iconify
            icon={'bi:arrow-right-circle'}
            sx={{
              marginRight: 5,
              cursor: 'pointer',
              opacity: imgIndex + 1 === images.length ? 0.2 : 1,
            }}
            onClick={(e) => getNextImg()}
          />
        </Grid>
      )}
    </div>
  );
};
export default Editor;
