import axios from '../utils/axios';

import { useEffect, useState } from 'react';

type SetOCR = ({}) => void;

const useOCR = async (imgSnippet: File, setOcr: SetOCR) => {
  const [fetchedOCR, setFetchedOCR] = useState({});

  useEffect(() => {
    try {
      if (imgSnippet) {
        console.log('use ocr');
        // const imgData = imgSnippet.toDataURL('image/png').split(';base64,')[1];

        const imgData = new FormData();
        imgData.append('image', imgSnippet);

        const getOCR = async () =>
          axios
            .post('/ocr', imgData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(({ data }) => setFetchedOCR(data));

        getOCR();
      }
    } catch (err) {
      console.error('Axios error');
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgSnippet]);

  useEffect(() => {
    if (fetchedOCR) {
      setOcr(fetchedOCR);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedOCR]);

  return { fetchedOCR };
};
export default useOCR;
