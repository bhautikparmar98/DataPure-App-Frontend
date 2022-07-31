import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormProvider,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/Shared/hook-form';
import { useSnackbar } from 'notistack';
import { Box, Grid, IconButton, Typography, MenuItem } from '@mui/material';
import Iconify from 'src/components/Shared/Iconify';
import Incrementer from 'src/components/Shared/increamenter';

import { CATEGORY, GENDER, CONDITION } from 'src/constants';

interface ProductDetailsProps {
  listing: any; // TODO: create a type for listing and use it here
}

type ProductDetailsFormValuesProps = {
  brand: string;
  quantity: number;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ listing }) => {
  const isEdit = listing ? true : false;

  const ProductDetailsSchema = Yup.object().shape({
    ProductDetailsFormValuesProps: Yup.string().required('Brand is required'),
  });

  const defaultValues = useMemo(
    () => ({
      brand: listing?.brand || '',
      quantity: listing?.quantity || 1,
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

  const methods = useForm<ProductDetailsFormValuesProps>({
    resolver: yupResolver(ProductDetailsSchema),
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

  const values = watch();

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
          <RHFTextField name="product_name" upperLabel="Product name" placeholder="Nike sneakers" />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSelect name="category" upperLabel="Category (dropdown)">
            {Object.values(CATEGORY).map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField name="sku" upperLabel="SKU" placeholder="5695656565" />
        </Grid>
        {/* //next */}
        <Grid item xs={12} md={4}>
          <RHFTextField name="brand" upperLabel="Brand" placeholder="Nike" />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField name="model" upperLabel="Model" placeholder="Blazer Mid 77" />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField name="country" upperLabel="Country" placeholder="Egypt" />
        </Grid>
        {/* //next */}
        <Grid item xs={12} md={4}>
          <RHFSelect name="condition" upperLabel="Condition">
            {Object.values(CONDITION).map((condition) => (
              <MenuItem key={condition.value} value={condition.value}>
                {condition.label}
              </MenuItem>
            ))}
          </RHFSelect>
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
          <Typography gutterBottom variant="body2" style={{ margin: 0 }}>
            Quantity
          </Typography>
          <Incrementer
            name="quantity"
            quantity={values.quantity}
            onIncrementQuantity={() => setValue('quantity', values.quantity + 1)}
            onDecrementQuantity={() => setValue('quantity', values.quantity - 1)}
          />
          <Typography
            variant="caption"
            component="div"
            sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}
          >
            Quantity: {values.quantity}
          </Typography>
        </Grid>
        {/* next */}
        <Grid item xs={12} md={12}>
          <RHFTextField
            name="description"
            upperLabel="Description (optional)"
            placeholder="This is a description"
            rows={4}
            fullWidth
            multiline
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ProductDetails;
