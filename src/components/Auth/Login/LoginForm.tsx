import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Alert, IconButton, InputAdornment, Link, Stack } from '@mui/material';
// next
import NextLink from 'next/link';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/Shared/hook-form';
// components
import Iconify from 'src/components/Shared/Iconify';
// routes
import { PATH_AUTH } from 'src/routes/auth/paths';
import * as Yup from 'yup';
// types
import { FormValuesProps } from './types';
//constants
import { ROLES } from 'src/constants';

// ----------------------------------------------------------------------

interface LoginFormProps {
  onSubmit: (values: FormValuesProps) => void;
  tab: string;
  isAdminLogin: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, tab, isAdminLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  //schema for clients and admins
  const DefaultSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const ClientSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required(),
    password: Yup.string().required('Password is required'),
  });

  const LoginSchema = ROLES.CLIENT.value === tab ? ClientSchema : DefaultSchema;

  if (isAdminLogin) {
    tab = ROLES.ADMIN.value;
  }

  const defaultValues = {
    email: '',
    username: '',
    password: '',
    remember: true,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const submitHandler = async (data: FormValuesProps) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2));
      reset();
      if (!error.success && error.error?.message) {
        setError('afterSubmit', error.error);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(submitHandler)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        {tab === ROLES.CLIENT.value ? (
          <RHFTextField key="emailAddressForLogin" name="email" label="Username" />
        ) : (
          <RHFTextField key="usernameForLogin" name="username" label="Username" />
        )}

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" color="text.secondary" />
        <NextLink href={PATH_AUTH.resetPassword} passHref>
          <Link variant="subtitle2" color="text.secondary">
            Forgot password?
          </Link>
        </NextLink>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ borderRadius: 3, boxShadow: 'none' }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
};

export default LoginForm;
