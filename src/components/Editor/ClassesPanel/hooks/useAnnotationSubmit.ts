import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Annotation, ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { useAppSelector } from 'src/redux/store';
import { annotatorSubmitAnnotations } from '../../utils/annotatorRequests';
import { qaSubmitAnnotations, qaRequestRedo } from '../../utils/qaRequests';
import {
  clientApproveAnnotations,
  clientRequestRedo,
} from '../../utils/clientRequests';

const useAnnotationSubmit = () => {
  const { classes, imageId } = useAppSelector(({ classes }) => classes);
  const router = useRouter();
  const { role } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (ROLES.CLIENT.value !== role) {
      const interval = setInterval(() => {
        if (classes.length > 0) handleSubmit();
      }, 5 * 3600);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  const handleSubmit = async (done = false) => {
    try {
      const purifiedAnnotations: Annotation[] = [];
      classes.forEach((cls) => {
        cls.annotations.forEach((anno) => {
          delete anno.id;
          purifiedAnnotations.push(anno);
        });
      });

      let response;
      switch (role) {
        case ROLES.QA.value:
          response = await qaSubmitAnnotations(purifiedAnnotations, imageId);
          break;
        case ROLES.ANNOTATOR.value:
          response = await annotatorSubmitAnnotations(
            purifiedAnnotations,
            imageId,
            done
          );
          break;
        case ROLES.CLIENT.value:
          response = await clientApproveAnnotations(
            purifiedAnnotations,
            imageId
          );
          break;
        default:
          throw new Error('Undefined user role');
      }

      if (response?.data?.success)
        enqueueSnackbar('Annotation has been saved', {
          variant: 'success',
        });

      setTimeout(() => {
        // done && router.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong with saving annotations..', {
        variant: 'warning',
      });
    }
  };

  const handleReset = () => {};

  const requestRedo = async () => {
    if (role === ROLES.QA.value) {
      return await qaRequestRedo(imageId);
    }
    if (role === ROLES.CLIENT.value) {
      return clientRequestRedo(imageId);
    }
  };
  return {
    handleSubmit,
    handleReset,
    requestRedo,
  };
};

export default useAnnotationSubmit;
