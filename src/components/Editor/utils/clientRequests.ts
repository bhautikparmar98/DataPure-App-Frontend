import axios from 'src/utils/axios';
import { Annotation } from 'src/constants';

const clientApproveAnnotations = async (
  annotations: Annotation[],
  imageId: string,
  done: boolean
) => {
  let response = await axios.post(`image/${imageId}/annotation`, {
    annotations,
  });

  if (done) return await axios.put(`image/${imageId}/client/approve`);

  return response;
};

const clientRequestRedo = async (imageId: string) => {
  return await axios.put(`image/${imageId}/client/disapprove`);
};

export { clientApproveAnnotations, clientRequestRedo };
