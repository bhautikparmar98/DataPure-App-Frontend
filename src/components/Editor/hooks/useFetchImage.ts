import { useEffect } from 'react';
import { initializeState } from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';
import axios from 'src/utils/axios';

const useFetchImage = async (projId: string, take = 1) => {
  const dispatch = useAppDispatch();

  const getData = async (): Promise<void> => {
    const fetchedData = await axios.get(
      `/project/${projId}/annotator/images?take=${take}`
    );

    if (fetchedData?.data) {
      dispatch(initializeState(fetchedData?.data));
    }
  };

  useEffect(() => {
    getData();
  }, [projId, take]);
};

export default useFetchImage;
