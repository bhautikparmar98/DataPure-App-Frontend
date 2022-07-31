import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from 'src/components/Shared/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
};

type Props = {
  onSent: VoidFunction;
  onGetEmail: (value: string) => void;
};

export default function ResetPasswordForm({ onSent, onGetEmail }: Props) {
  const isMountedRef = useIsMountedRef();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: 'demo@minimals.cc' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (isMountedRef.current) {
        onSent();
        onGetEmail(data.email);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Username" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ boxShadow: 'none' }}
        >
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
