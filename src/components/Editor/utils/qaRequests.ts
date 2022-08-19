import { Annotation } from 'src/constants';
import axios from 'src/utils/axios';

const qaSubmitAnnotations = async (
  annotations: Annotation[],
  imageId: string
) => {
  return await axios.post(`image/${imageId}/annotation`, {
    annotations,
  });
};

const qaRequestRedo = async (imageId: string) => {
  return await axios.put(`image/${imageId}/annotation/redo`);
};

const qaApproveImage = async (imageId: string) => {
  return await axios.put(`image/${imageId}/annotation/approve`);
};

export { qaSubmitAnnotations, qaRequestRedo, qaApproveImage };
