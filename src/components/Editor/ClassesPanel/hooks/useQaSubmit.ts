import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { Annotation } from 'src/constants';
import axios from 'src/utils/axios';
import { RootState } from 'src/redux/store';
const useQaSubmit = () => {
  const classes = useSelector((state: RootState) => state.classes.classes);
  const imageId = useSelector((state: RootState) => state.classes.imageId);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleQaSubmit = async (done = false) => {
    try {
      const annotations: Partial<Annotation>[] = [];

      classes.forEach((cls) => {
        cls.annotations.forEach((anno: Partial<Annotation>) => {
          delete anno.id;
          annotations.push(anno);
        });
      });

      let response;

      if (done) {
        response = await axios.put(`image/${imageId}/annotation/finish`, {
          annotations,
        });
      } else {
        response = await axios.post(`image/${imageId}/annotation`, {
          annotations,
        });
      }

      if (response?.data?.success)
        enqueueSnackbar('Annotation has been saved', {
          variant: 'success',
        });
      setTimeout(() => {
        done && router.reload();
      }, 5 * 3600);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong with saving annotations..', {
        variant: 'warning',
      });
    }
  };

  const handleQaReset = () => {};
  return {
    handleQaSubmit,
    handleQaReset,
  };
};

export default useQaSubmit;
