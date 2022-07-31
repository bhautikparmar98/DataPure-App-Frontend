import { LoadingButton } from '@mui/lab';
// @mui
import { Alert, Stack } from '@mui/material';
import { FormProvider, RHFTextField } from 'src/components/Shared/hook-form';
import { loadingBtnStyle } from '../List/styles';
// hooks
import useMvForm from './hooks/useMvForm';

// ----------------------------------------------------------------------

const MachineVisionForm: React.FC = () => {
  const { methods, submitHandler } = useMvForm();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(submitHandler)}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <RHFTextField
          key="classifierName"
          name="classifierName"
          label="Classifier Name"
          size="small"
        />
        <RHFTextField
          type="url"
          key="modalUrlGCB1"
          name="modalUrlGCB1"
          label="Modal GCB URL 1"
          size="small"
        />
        <RHFTextField
          type="url"
          key="modalUrlGCB2"
          name="modalUrlGCB2"
          label="Modal GCB URL 2"
          size="small"
        />
      </Stack>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={loadingBtnStyle}>
        Submit
      </LoadingButton>
    </FormProvider>
  );
};

export default MachineVisionForm;
