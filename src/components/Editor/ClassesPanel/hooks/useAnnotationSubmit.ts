import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Annotation, ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { useAppSelector } from 'src/redux/store';
import { annotatorSubmitAnnotations } from '../../utils/annotatorRequests';
import {
  qaSubmitAnnotations,
  qaRequestRedo,
  qaApproveImage,
} from '../../utils/qaRequests';
import {
  clientApproveAnnotations,
  clientRequestRedo,
} from '../../utils/clientRequests';

import { resetState } from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';

const useAnnotationSubmit = () => {
  const { classes, imageId } = useAppSelector(({ classes }) => classes);
  const router = useRouter();
  const { role } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (ROLES.CLIENT.value !== role) {
      const interval = setInterval(() => {
        if (classes.length > 0) handleSubmit();
      }, 1000 * 60 * 5);

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
          delete anno.fill;
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
            imageId,
            done
          );
          break;
        default:
          throw new Error('Undefined user role');
      }
      if (response?.data?.success) {
        enqueueSnackbar('Annotation has been saved', {
          variant: 'success',
        });
        if (done && role !== ROLES.QA.value) {
          setTimeout(() => {
            router.reload();
          }, 3000);
        }
      } else if (done) {
        throw new Error(
          'User clicked submit and the request was not successful'
        );
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong with saving annotations..', {
        variant: 'warning',
      });
    }
  };

  const handleReset = () => {};

  const requestRedo = async () => {
    try {
      let response;
      if (role === ROLES.QA.value) {
        response = await qaRequestRedo(imageId);
      } else if (role === ROLES.CLIENT.value) {
        response = await clientRequestRedo(imageId);
      }

      if (response?.status === 200) {
        enqueueSnackbar('We will review the annotations again. Thank you', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
        dispatch(resetState());
        setTimeout(() => {
          router.reload();
        }, 2000);
      } else {
        throw new Error('Request has not been successful');
      }
    } catch (err) {
      enqueueSnackbar(
        `We couldn't process your request now. Please try again later`,
        {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        }
      );
    }
  };

  const handleApproveImage = async () => {
    const response = await qaApproveImage(imageId);
    if (response?.status === 200) {
      enqueueSnackbar('Annotations have been approved', {
        variant: 'success',
      });
      setTimeout(() => {
        dispatch(resetState());
        router.reload();
      }, 3000);
    } else {
      enqueueSnackbar(
        `We couldn't process your approval request now. Please try again later`,
        {
          variant: 'error',
        }
      );
    }
  };

  return {
    handleSubmit,
    handleReset,
    requestRedo,
    handleApproveImage,
    imageId,
  };
};

export default useAnnotationSubmit;
