import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Annotation, ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { annotatorSubmitAnnotations } from '../../utils/annotatorRequests';
import { clientApproveAnnotations } from '../../utils/clientRequests';
import { qaApproveImage, qaSubmitAnnotations } from '../../utils/qaRequests';
import { RootState } from 'src/redux/store';
import { resetState } from 'src/redux/slices/classes/classes.slice';
import { useDispatch } from 'react-redux';

const useAnnotationSubmit = () => {
  const imageId = useSelector((state: RootState) => state.classes.imageId);
  const classes = useSelector((state: RootState) => state.classes.classes);
  const router = useRouter();
  const { role } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  useEffect(() => {
    if (ROLES.CLIENT.value !== role) {
      const interval = setInterval(() => {
        if (classes.length > 0) handleSubmit();
      }, 1000 * 60 * 5);

      return () => {
        clearInterval(interval);
      };
    }
  }, [classes]);

  const handleSubmit = async (done = false, newAnnotationData?: any) => {
    try {
      const updatedClasses = [...classes];
      const purifiedAnnotations: Annotation[] = [];
      updatedClasses.forEach((cls) => {
        const newAnnotations = [...cls.annotations];
        newAnnotations.forEach((anno) => {
          let newAnno = { ...anno };
          if (newAnnotationData?.shapes[0]?.id === newAnno.shapes[0].id) {
            newAnno = newAnnotationData;
          }
          delete newAnno.fill;
          delete (newAnno as any).id;
          purifiedAnnotations.push(newAnno);
        });
      });

      let response;
      switch (role) {
        case ROLES.QA.value:
          response = await qaSubmitAnnotations(purifiedAnnotations, imageId);
          break;
        case ROLES.ANNOTATOR.value:
          response = await annotatorSubmitAnnotations(purifiedAnnotations, imageId, done);
          break;
        case ROLES.CLIENT.value:
          response = await clientApproveAnnotations(purifiedAnnotations, imageId, done);
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
        throw new Error('User clicked submit and the request was not successful');
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong with saving annotations..', {
        variant: 'warning',
      });
    }
  };

  const handleReset = () => {};

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
      enqueueSnackbar(`We couldn't process your approval request now. Please try again later`, {
        variant: 'error',
      });
    }
  };

  return {
    handleSubmit,
    handleReset,
    handleApproveImage,
    imageId,
  };
};

export default useAnnotationSubmit;
