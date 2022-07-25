import axios from '../utils/axios';

import { useEffect, useState } from 'react';

const Ocr = async (imgSnippet, annoId, updateAnnoText) => {
  console.log({ annoId });
  const [description, setDescription] = useState('');

  useEffect(() => {
    try {
      if (imgSnippet && annoId?.length > 0) {
        const imgBase64 = imgSnippet
          .toDataURL('image/png')
          .split(';base64,')[1];
        const getDescription = async () =>
          axios
            .post('/ocr', {
              imgBase64,
            })
            .then(({ data }) => setDescription(data));

        getDescription();
      }
    } catch (err) {
      console.error('Axios error');
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgSnippet]);

  useEffect(() => {
    if (annoId && description) {
      updateAnnoText(description, annoId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  return { description, annoId };
};
export default Ocr;
