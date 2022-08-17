import { useEffect } from 'react';

import {
  initializeState,
  resetState,
} from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';
import axios from 'src/utils/axios';
import { useRouter } from 'next/router';

const useFetchImage = async (
  projId: string | undefined,
  role: string,
  take = 1
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getData = async (): Promise<void> => {
    try {
      const fetchedData = await axios.get(
        `/project/${projId}/${role.toLowerCase()}/images?take=${take}`
      );

      if (fetchedData?.data.images.length > 0) {
        dispatch(initializeState(fetchedData?.data));
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      dispatch(resetState());
      router.push('/');
    }
  };

  useEffect(() => {
    getData();
  }, [projId, take]);
};

export default useFetchImage;
