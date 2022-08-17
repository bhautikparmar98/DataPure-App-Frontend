import { Annotation } from 'src/constants';
import axios from 'src/utils/axios';

const approveImage = async () => {};

const qaSubmitAnnotations = async (
  annotations: Annotation[],
  imageId: string
) => {
  return await axios.put(`image/${imageId}/annotation/approve`, {
    annotations,
  });
};

export { qaSubmitAnnotations };
