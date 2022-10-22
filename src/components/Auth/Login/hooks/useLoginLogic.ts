import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import { FormValuesProps } from '../types';

const useLoginLogic = () => {
  const router = useRouter();
  const { method, login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async (data: FormValuesProps | any) => {
    try {
      await login(data.email?.trim(), data.password?.trim(), data.remember);
      // router.push('/');
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar(error.message ? error.message : 'Something went wrong.', {
        variant: 'error',
      });
    }
  };

  return { method, submitHandler };
};

export default useLoginLogic;
