import { useRouter } from 'next/router';
import { Annotation } from 'src/constants';
import { useAppSelector } from 'src/redux/store';
import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import { useEffect } from 'react';

const useAnnotationSubmit = () => {
  const { classes, imageId } = useAppSelector(({ classes }) => classes);
  const router = useRouter();
  const { role } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const interval = setInterval(() => {
      if (role.toLowerCase() === 'qa') return;
      if (classes.length > 0) handleSubmit();
    }, 5 * 3600);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (done = false) => {
    try {
      const annotations: Annotation[] = [];

      classes.forEach((cls) => {
        cls.annotations.forEach((anno) => {
          delete anno.id;
          annotations.push(anno);
        });
      });

      let response;
      console.log('submitting');
      if (done) {
        response = await axios.put(`image/${imageId}/annotation/finish`, {
          annotations,
        });
      } else {
        response = await axios.post(`image/${imageId}/annotation`, {
          annotations,
        });
      }
      console.log(response);

      if (response?.data?.success)
        enqueueSnackbar('Annotation has been saved', {
          variant: 'success',
        });
      setTimeout(() => {
        done && router.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      // enqueueSnackbar('Something went wrong with saving annotations..', {
      //   variant: 'warning',
      // });
    }
  };

  const handleReset = () => {};
  return {
    handleSubmit,
    handleReset,
  };
};

export default useAnnotationSubmit;
