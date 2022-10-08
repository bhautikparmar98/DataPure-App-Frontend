import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { initState, resetState } from 'src/redux/slices/classes/classes.slice';
import { useDispatch } from 'react-redux';
import axios from 'src/utils/axios';

const useFetchImage = (projId: string | undefined, take = 1) => {
  const router = useRouter();
  const { role } = useAuth();

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
        fetchedData = await axios.get(
          `/project/${projId}/${role.toLowerCase()}/review/images?take=${10000}`
        );
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
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      dispatch(resetState());
      router.push('/');
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
