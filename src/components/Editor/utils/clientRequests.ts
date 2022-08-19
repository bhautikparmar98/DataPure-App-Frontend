import axios from 'src/utils/axios';
import { Annotation } from 'src/constants';

const clientApproveAnnotations = async (
  annotations: Annotation[],
  imageId: string
) => {
  return await axios.put(`image/${imageId}/annotation/approve`, {
    annotations,
  });
};

const clientRequestRedo = async (imageId: string) => {
  // !logic here
};

export { clientApproveAnnotations, clientRequestRedo };
