import { Button, Grid, Link } from '@mui/material';
import Iconify from 'src/components/Shared/Iconify';

import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { clientRequestRedo } from 'src/components/Editor/utils/clientRequests';
import { qaRequestRedo } from 'src/components/Editor/utils/qaRequests';
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { resetState } from 'src/redux/slices/classes/classes.slice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/redux/store';
interface RequestRedoProps {
  onRequestRedoFinish: (imgId: string) => void;
}

const RequestRedo: React.FC<RequestRedoProps> = ({ onRequestRedoFinish }) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();

  const imageId = useSelector((state: RootState) => state.classes.imageId);
  const { role } = useAuth();

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
      enqueueSnackbar(`We couldn't process your request now. Please try again later`, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
    }
  };

  const requestRedoHandler = async (imgId: string) => {
    await requestRedo();
    onRequestRedoFinish(imgId);
  };

  return (
    <Grid justifyContent="space-between" alignItems="center" mt={3.5} mb={5} sx={{ display: 'flex' }}>
      {(ROLES.QA.value === role || ROLES.CLIENT.value === role) && (
        <Button variant="contained" color="error" onClick={() => requestRedoHandler(imageId)}>
          Request Redo
        </Button>
      )}
      <NextLink href="/project/list" passHref style={{ color: '#313131' }}>
        <Link
          variant="body1"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none !important',
          }}>
          <Iconify icon="ic:baseline-logout" />
          <span style={{ paddingLeft: 5 }}>Exit Canvas</span>
        </Link>
      </NextLink>
    </Grid>
  );
};
export default RequestRedo;
