import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Iconify from 'src/components/Shared/Iconify';
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { initState, resetState } from 'src/redux/slices/classes/classes.slice';
import ClassesPanel from './ClassesPanel';
import axiosInstance from 'src/utils/axios';
import useFetchImage from './hooks/useFetchImage';
import useImageComments from './hooks/useImageComments';
import Toolbar from './Toolbar';
import Workspace from './Workspace';
import { RootState } from 'src/redux/store';
import _ from 'lodash';
import { addProjectIds, resetEditor } from 'src/redux/slices/editor/editor.slice';

const Editor = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { role } = useAuth();
  const imageId: string = useSelector((state: RootState) => state.classes.imageId);
  const [annotationId, setAnnotationId] = useState('');
  const projectImagesIds = useSelector((state: RootState) => state.editor.projectImagesIds);
  const [fetchingNewImages, setFetchingNewImages] = useState(false);
  const storedImgId = localStorage.getItem(id) || '';

  const { limitedImages, removeImage, isAnnotatorRedo, fetchLimitedReviewImages } = useFetchImage(id, storedImgId);

  const limitedImagesMap: { [imgId: string]: [] } = {};
  limitedImages.forEach((img: any) => {
    limitedImagesMap[img._id] = img;
  });

  const [imagesMap, setImagesMap] = useState<{ [imgId: string]: any[] }>(limitedImagesMap);

  useEffect(() => {
    setImagesMap(limitedImagesMap);
  }, [limitedImages]);

  // Fetch project images IDs if not exist
  useEffect(() => {
    const loadProjectImagesIds = async () => {
      const response = await axiosInstance.get(`/project/${id}/images`);
      const { images } = response.data;
      if (images) {
        const imagesIds = images.map((img: any) => img._id);
        dispatch(addProjectIds({ projectId: id, imagesIds }));
      }
    };
    if (!projectImagesIds[id]) {
      loadProjectImagesIds();
    }

    return () => {
      dispatch(resetState());
      dispatch(resetEditor());
    };
  }, []);

  //images count shall
  const imagesCount = projectImagesIds[id]?.length || limitedImages.length;

  const { addComment, deleteComment } = useImageComments({
    isAnnotatorRedo,
    imageId,
  });

  const dispatch = useDispatch();

  const [imgIndex, setImgIndex] = useState(0);

  let indicatorsHeight = ROLES.CLIENT.value === role ? 50 : 0;

  const fetchMoreImages = async (imgId: string) => {
    let fetchedImages = [];

    const currentImgIndex = projectImagesIds[id]?.indexOf(imgId);
    if (currentImgIndex >= 0) {
      setFetchingNewImages(true);
      const response = await fetchLimitedReviewImages(imgId);
      fetchedImages = response?.data?.images || [];

      if (fetchedImages.length) {
        const fetchedImagesMap: { [imgId: string]: [] } = {};
        fetchedImages.forEach((img: any) => {
          fetchedImagesMap[img._id] = img;
        });

        let newImages = _.merge(fetchedImagesMap, imagesMap);

        setImagesMap(newImages);

        if (newImages[imgId]) {
          dispatch(
            initState({
              state: {
                images: [newImages[imgId]],
              },
            })
          );
        }
      }
    }
    setFetchingNewImages(false);
  };

  useEffect(() => {
    //loading the selected image for `review`
    const getIndexedImage = () => {
      const imgId = localStorage.getItem(id);

      if (typeof imgId === 'string' && imgId?.length > 0) {
        const found = Object.entries(imagesMap).find(([id], i) => id === imgId);

        if (found) {
          const foundIndex = projectImagesIds[id]?.indexOf(imgId);
          setImgIndex(foundIndex > 0 ? foundIndex : 0);

          localStorage.removeItem(id);

          // initialize state with requested image
          dispatch(
            initState({
              state: {
                images: [found[1]],
              },
            })
          );
        }
      }
    };

    if (imagesCount) getIndexedImage();
  }, [id, imagesMap]);

  const getNextImg = () => {
    const newIndex = imgIndex + 1;
    if (newIndex < imagesCount) {
      const storedImages = Object.entries(imagesMap);
      const imageId: string = projectImagesIds[id] ? projectImagesIds[id][newIndex] : Object.keys(imagesMap)[newIndex];
      let index = -1;
      const nextImg = storedImages.find(([imgId], i) => {
        if (imgId === imageId) {
          index = i;
          return true;
        }
      });
      // image is fetched already
      if (nextImg && index >= 0) {
        // dispatch(resetState());
        dispatch(
          initState({
            state: {
              images: [nextImg[1]],
            },
          })
        );
      } else {
        fetchMoreImages(imageId);
      }
      setImgIndex(newIndex);
    }
  };

  const getPrevImg = () => {
    if (imgIndex > 0) {
      const newIndex = imgIndex - 1;

      const storedImages = Object.entries(imagesMap);
      const imageId: string = projectImagesIds[id] ? projectImagesIds[id][newIndex] : Object.keys(imagesMap)[newIndex];
      let index = -1;
      const newImg = storedImages.find(([imgId], i) => {
        if (imgId === imageId) {
          index = i;
          return true;
        }
      });

      // image is fetched already
      if (newImg && index >= 0) {
        // dispatch(resetState());
        dispatch(
          initState({
            state: {
              images: [newImg[1]],
            },
          })
        );
      } else {
        fetchMoreImages(imageId);
      }
      setImgIndex(newIndex);
    }
  };

  const requestRedoHandler = useCallback((imgId: string) => {
    if (limitedImages.length === 1) return router.push(`/project/${id}/review`);

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
  const LAYERS_PANEL_WIDTH = 330;
  const WIDTH = window.innerWidth - (TOOLBAR_WIDTH + LAYERS_PANEL_WIDTH);
  const HEIGHT = window.innerHeight - indicatorsHeight - 1;

  useEffect(() => {}, [annotationId]);
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
          fetchingNewImages={fetchingNewImages}
          setAnnotationId={(a: string) => {
            setAnnotationId(a);
          }}
        />
      </div>
      <ClassesPanel onRequestRedoFinish={requestRedoHandler} annotationId={annotationId} />
      {ROLES.CLIENT.value === role && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ fontSize: '1.2rem', cursor: fetchingNewImages ? 'progress' : 'default' }}
          pr={28.5}>
          <Iconify
            icon={'bi:arrow-left-circle'}
            sx={{
              marginLeft: 5,
              cursor: fetchingNewImages ? 'progress' : 'pointer',
              opacity: imgIndex <= 0 ? 0.2 : 1,
            }}
            onClick={(e) => getPrevImg()}
          />
          <span style={{ padding: '10px 15px' }}>
            {imgIndex + 1} of {imagesCount}
          </span>
          <Iconify
            icon={'bi:arrow-right-circle'}
            sx={{
              marginRight: 5,
              cursor: fetchingNewImages ? 'progress' : 'pointer',
              opacity: imgIndex + 1 < imagesCount ? 1 : 0.2,
            }}
            onClick={(e) => getNextImg()}
          />
        </Grid>
      )}
    </div>
  );
};
export default Editor;
