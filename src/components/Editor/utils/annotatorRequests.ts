import axios from 'src/utils/axios';
import { Annotation } from 'src/constants';

const annotatorSubmitAnnotations = async (
  annotations: Annotation[],
  imageId: string,
  done: boolean
) => {
  return done
    ? await axios.put(`image/${imageId}/annotation/finish`, {
        annotations,
      })
    : await axios.post(`image/${imageId}/annotation`, {
        annotations,
      });
};

export { annotatorSubmitAnnotations };
