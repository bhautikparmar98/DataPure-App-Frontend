import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  Grid,
  IconButton,
  InputAdornment,
  Alert,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from 'src/components/Shared/Iconify';
import { FormProvider, RHFTextField } from 'src/components/Shared/hook-form';
//types
import { FormValuesProps } from './types/registerForm.Type';
//validation
import RegisterSchema from './validation/registerSchema.Validation';

// ----------------------------------------------------------------------

interface RegisterFormProps {
  onSubmit: (data: FormValuesProps) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Error');

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneno: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    termsofservice: false,
    privacyagreement: false,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
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
      reset();
      if (!error.success && error?.err) {
        setError('afterSubmit', error.err);
        setErrorMessage(error.err);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(submitHandler)}>
      <Stack spacing={2}>
        {!!errors.afterSubmit && <Alert severity="error">{errorMessage}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" required />
          <RHFTextField name="lastName" label="Last name" required />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="email" label="Email address" required />
          <RHFTextField name="phoneno" label="Phone Number" required />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField
            name="password"
            label="Password"
            required
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirmPassword"
            label="Confirm Password"
            required
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }} spacing={2}>
        <RHFTextField name="referralCode" label="Referral Code" />
      </Stack>
      <Stack color="text.secondary">
        <Typography variant="h6" sx={{ mt: 2, mb: 0 }}>
          Terms of Service*
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox name="termsofservice" required />}
            label="I have read and agree to the terms of service"
          />
          <FormControlLabel
            control={<Checkbox name="privacyagreement" required />}
            label="I have read and agree to the privacy statement"
          />
        </FormGroup>
      </Stack>
      <Grid container justifyContent="flex-end">
        <LoadingButton
          sx={{ direction: 'rtl', boxShadow: 'none' }}
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Sign up
        </LoadingButton>
      </Grid>
    </FormProvider>
  );
};

export default RegisterForm;
