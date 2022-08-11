import { useState } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, MenuItem, Stack } from '@mui/material';

// components
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from 'src/components/Shared/hook-form';
//types
import { FormValuesProps } from './types/registerForm.Type';
//validation
import { ROLES } from 'src/constants';
import RegisterSchema from './validation/registerSchema.Validation';

// ----------------------------------------------------------------------

interface RegisterFormProps {
  onSubmit: (data: FormValuesProps) => void;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading }) => {
  const [errorMessage, setErrorMessage] = useState('Error');

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    role: ROLES.CLIENT.value,
    company: '',
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
      <Stack spacing={2} sx={{ mt: 4, pr: 2 }}>
        {!!errors.afterSubmit && <Alert severity="error">{errorMessage}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" required />
          <RHFTextField name="lastName" label="Last name" required />
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ marginLeft: 0 }}
        >
          <RHFTextField name="email" label="Email address" required />
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ mt: 2, pl: 2 }}
          spacing={2}
        >
          <RHFSelect name="role" label="Role">
            {Object.keys(ROLES)
              .filter((key) => key !== ROLES.SUPER_ADMIN.value)
              .map((key) => (
                <MenuItem key={key} value={ROLES[key]?.value}>
                  {ROLES[key]?.label}
                </MenuItem>
              ))}
          </RHFSelect>
        </Stack>
      </Stack>

      <Stack color="text.secondary" sx={{ mt: 2, mr: 2, ml: 2 }}>
        <RHFTextField name="company" label="Company" required />
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ mt: 6, pl: 2, pr: 2 }}
        spacing={2}
      >
        <LoadingButton
          // sx={{ boxShadow: 'none' }}
          type="submit"
          variant="contained"
          fullWidth
          loading={isSubmitting || loading}
        >
          Send Invitation
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export default RegisterForm;
