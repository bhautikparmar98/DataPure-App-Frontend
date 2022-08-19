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
  return await axios.put(`image/${imageId}/client/disapprove`);
};

export { clientApproveAnnotations, clientRequestRedo };
