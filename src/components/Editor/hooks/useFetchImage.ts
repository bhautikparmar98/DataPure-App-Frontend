import { useEffect } from 'react';

import { ROLES } from 'src/constants';
import {
  initializeState,
  resetState,
} from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';
import axios from 'src/utils/axios';

const useFetchImage = async (
  projId: string | undefined,
  role: string,
  take = 1
) => {
  const dispatch = useAppDispatch();

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
        console.log(fetchedData?.data!.images);
        dispatch(initializeState(fetchedData?.data));
      } else {
        dispatch(resetState());
        // !uncomment this
        // router.push('/');
      }
    } catch (err) {
      console.error(err);
      dispatch(resetState());
      // !uncomment this
      // router.push('/');
    }
  };

  useEffect(() => {
    getData();
  }, [projId, take]);
};

export default useFetchImage;
