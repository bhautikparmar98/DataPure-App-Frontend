import axios from 'src/utils/axios';
import { Annotation } from 'src/constants';

const annotatorSubmitAnnotations = async (
  annotations: Annotation[],
  imageId: string,
  done: boolean
) => {
  let response = await axios.post(`image/${imageId}/annotation`, {
    annotations,
  });
  if (done)
    return await axios.put(`image/${imageId}/annotation/finish`, {
      annotations,
    });
  return response;
};

export { annotatorSubmitAnnotations };
