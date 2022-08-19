import { Annotation } from 'src/constants';
import axios from 'src/utils/axios';

const approveImage = async () => {};

const qaSubmitAnnotations = async (
  annotations: Annotation[],
  imageId: string
) => {
  console.log({ imageId });
  return await axios.put(`image/${imageId}/annotation/approve`, {
    annotations,
  });
};

const qaRequestRedo = async (imageId: string) => {
  // !logic here
};

export { qaSubmitAnnotations, qaRequestRedo };
