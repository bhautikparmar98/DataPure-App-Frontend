import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ROLES } from 'src/constants';
import {
  initializeState,
  resetState,
} from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';
import axios from 'src/utils/axios';

const useFetchImage = (projId: string | undefined, role: string, take = 1) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [images, setImages] = useState([]);

  useEffect(() => {
    getData();
  }, [projId, take]);

  const getData = async (): Promise<void> => {
    try {
      let fetchedData = { data: { images: [] } };
      if (ROLES.CLIENT.value === role) {
        fetchedData = await axios.get(
          `/project/${projId}/${role.toLowerCase()}/review/images`
        );
      } else {
        fetchedData = await axios.get(
          `/project/${projId}/${role.toLowerCase()}/images?take=${take}`
        );
      }

      if (fetchedData?.data!.images?.length > 0) {
        dispatch(initializeState(fetchedData?.data));
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

  return {
    images,
  };
};

export default useFetchImage;
