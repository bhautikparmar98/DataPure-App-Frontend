import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { initState, resetState } from 'src/redux/slices/classes/classes.slice';
import { useDispatch } from 'react-redux';
import axios from 'src/utils/axios';
import { resetEditor } from 'src/redux/slices/editor/editor.slice';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

const useFetchImage = (projId: string | undefined, imageId: string, take = 1) => {
  const router = useRouter();
  const { role } = useAuth();
  const totalProjectsIds = useSelector((state: RootState) => state.editor.projectsIds);
  const projectIds = projId ? totalProjectsIds[projId] : [];

  const dispatch = useDispatch();
  const [isAnnotatorRedo, setIsAnnotatorRedo] = useState(false);

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!images.length) getData();
  }, []);

  const getData = async (): Promise<void> => {
    try {
      let fetchedData = { data: { images: [] } };
      if (ROLES.CLIENT.value === role) {
        // * Fetch limited number of images annotations for client to review
        fetchedData = (await fetchLimitedReviewImages()) || fetchedData;
        // fetchedData = await axios.get(`/project/${projId}/${role.toLowerCase()}/review/images?take=${10000}`);
      } else {
        let redoQuery = '';
        if (ROLES.ANNOTATOR.value === role) {
          const item = localStorage.getItem('redo');
          if (item) {
            redoQuery = '&redo=true';
            setIsAnnotatorRedo(true);
          }
        }

        fetchedData = (await axios.get(
          `/project/${projId}/${role.toLowerCase()}/images?take=${take}${redoQuery}`
        )) as any;
      }

      if (fetchedData?.data!.images?.length > 0) {
        dispatch(
          initState({
            state: fetchedData.data,
          })
        );

        if (ROLES.CLIENT.value === role) setImages(fetchedData.data.images);
      } else {
        dispatch(resetState());
        dispatch(resetEditor());
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      dispatch(resetState());
      dispatch(resetEditor());
      router.push('/');
    }
  };

  const fetchLimitedReviewImages = async () => {
    if (projectIds?.length && imageId) {
      const imgToReviewIndex = projectIds.indexOf(imageId);

      // consider this: projectImages=[img1, img2, ..., currentImgToReview, ..., img30,]
      //we are taking 10 last images and 10 next images with respect to the currentImgToReview
      // take =  20 ==> this means we take some images before and after the current images as the client may review forward or backward in the projectImages array
      const firstImgToFetchIndex = Math.max(imgToReviewIndex - 10, 0);
      const skipCount = firstImgToFetchIndex;
      // !TODO: reset take to 20
      const take = 2;
      const fetchedData = await axios.get(
        `/project/${projId}/${role.toLowerCase()}/review?skip=${skipCount}&take=${take}`
      );
      return fetchedData;
    }
  };

  const removeImage = (imgId: string) => {
    const newImages = images.filter((img: any) => img._id !== imgId);
    setImages(newImages);
    return newImages;
  };

  return {
    images,
    removeImage,
    isAnnotatorRedo,
  };
};

export default useFetchImage;
