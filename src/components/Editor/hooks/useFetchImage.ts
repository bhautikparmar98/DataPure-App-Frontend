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
import cloneDeep from 'lodash/cloneDeep';

const useFetchImage = (projId: string | undefined, imageId: string, take = 20) => {
  const router = useRouter();
  const { role } = useAuth();
  const totalProjectImagesIds = useSelector((state: RootState) => state.editor.projectImagesIds);
  const imagesIds = projId ? totalProjectImagesIds[projId] : [];

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

  // fetch limited number of images according to the clicked `image` to review. Taking 20 only if we know the image to be reviewed (the rest will be fetched when `next` or `previous` arrows of review are clicked)
  const fetchLimitedReviewImages = async (id?: string) => {
    let step = 10,
      firstImgToFetchIndex = 0;
    let imgId = id || imageId;
    //imageId will be empty string if the client opens the page without being redirected to it from the `/review` page
    if (imgId) {
      let validImagesIds = imagesIds;
      //fetch the project IDs to know the count and then update the `step` and firstImageToFetchIndex accordingly
      if (!imagesIds?.length || !validImagesIds) {
        const response = await axios.get(`/project/${projId}/images`);
        const images = response?.data?.images;
        if (images.length > 0) {
          validImagesIds = images.map((img: { _id: string }) => img._id);
        }
      }

      const imgToReviewIndex = validImagesIds.indexOf(imgId);

      // consider this: projectImages=[img1, img2, ..., currentImgToReview, ..., img30,]
      //we are taking 10 last images and 10 next images with respect to the currentImgToReview
      // step =  20 ==> this means we take 10 images before and 10 after the current images as the client may review forward or backward in the projectImages array

      firstImgToFetchIndex = Math.max(imgToReviewIndex - step, 0);
    }

    const fetchedData = await axios.get(
      `/project/${projId}/${role.toLowerCase()}/review?skip=${firstImgToFetchIndex}&take=${step * 2}`
    );
    const imagesToStore = cloneDeep(fetchedData.data.images);
    setImages(imagesToStore);

    //return only the image that needs to be loaded for the 1st time. others are stored in the `images` state
    if (fetchedData.data.images?.length && imgId) {
      fetchedData.data.images = fetchedData.data.images.filter((img: any) => img._id === imgId);
    }

    return fetchedData;
  };

  const removeImage = (imgId: string) => {
    const newImages = images.filter((img: any) => img._id !== imgId);
    setImages(newImages);
    return newImages;
  };

  return {
    limitedImages: images,
    removeImage,
    isAnnotatorRedo,
    fetchLimitedReviewImages,
  };
};

export default useFetchImage;
