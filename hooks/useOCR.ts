import axios from '../utils/axios';

import { useEffect, useState } from 'react';

type SetOCR = ({}) => void;

let reqCount = 0;

const useOCR = async (imgSnippet: File, setOcr: SetOCR) => {
  useEffect(() => {
    try {
      if (imgSnippet && reqCount === 0) {
        reqCount++;

        const imgData = new FormData();
        imgData.append('image', imgSnippet);

        const getOCR = async () =>
          axios
            .post('/ocr', imgData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(({ data }) => {
              if (data) {
                setOcr(data);
              }
            });

        getOCR();
      }
    } catch (err) {
      console.error('Axios error');
      console.error(err);
    }
  }, [imgSnippet]);

  return;
};
export default useOCR;
