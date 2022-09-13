import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Annotation } from 'src/constants';
import { useAppSelector } from 'src/redux/store';
import axios from 'src/utils/axios';

const useQaSubmit = () => {
  const { classes, imageId } = useAppSelector(({ classes }) => classes);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleQaSubmit = async (done = false) => {
    try {
      const annotations: Annotation[] = [];

      classes.forEach((cls) => {
        cls.annotations.forEach((anno) => {
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
