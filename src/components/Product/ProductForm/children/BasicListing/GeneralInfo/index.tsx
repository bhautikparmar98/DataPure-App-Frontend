import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/Shared/hook-form';
import { useSnackbar } from 'notistack';
import { Box, Grid, MenuItem } from '@mui/material';
import { GENDER } from 'src/constants';

interface GeneralInfoProps {
  listing: any; // TODO: create a type for listing and use it here
}

type GeneralInfoFormValuesProps = {
  brand: string;
};

const GeneralInfo: React.FC<GeneralInfoProps> = ({ listing }) => {
  const isEdit = listing ? true : false;
  const { enqueueSnackbar } = useSnackbar();
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>(['Nike']);
  const [modelSuggestions, setModelSuggestions] = useState<string[]>(['Blazer Mid 77']);
  const [countrySuggestions, setCountrySuggestions] = useState<string[]>(['Egypt']);

  const GeneralInfoSchema = Yup.object().shape({
    brand: Yup.string().required('Brand is required'),
    model: Yup.string().required('Model is required'),
    country: Yup.string().required('Country is required'),
    category: Yup.string().required('Category is required'),
    description: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      brand: listing?.brand || '',
      model: listing?.model || '',
      country: listing?.country || '',
      category: listing?.category || '',
      description: listing?.description || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listing]
  );

  const onSubmit = async (data: any) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const methods = useForm<GeneralInfoFormValuesProps>({
    resolver: yupResolver(GeneralInfoSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && listing) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing, isEdit]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RHFTextField name="brand" upperLabel="Brand" robot suggestions={brandSuggestions} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField name="model" upperLabel="Model" robot suggestions={modelSuggestions} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            name="country"
            upperLabel="Country"
            robot
            suggestions={countrySuggestions}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField name="category" upperLabel="Category" />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSelect name="gender" upperLabel="Gender">
            {Object.values(GENDER).map((gender) => (
              <MenuItem key={gender.value} value={gender.value}>
                {gender.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField name="quantity" upperLabel="Quantity" />
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} style={{ marginTop: 20 }}>
        <RHFTextField
          name="description"
          upperLabel="Description (optional)"
          fullWidth
          multiline
          rows={4}
        />
      </Grid>
    </FormProvider>
  );
};

export default GeneralInfo;
