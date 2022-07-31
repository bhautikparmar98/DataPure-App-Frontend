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
import { Box, Grid, IconButton, Typography, MenuItem, Button } from '@mui/material';
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

const GeneralSettings: React.FC<ProductDetailsProps> = ({ listing }) => {
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
          <RHFTextField
            type="number"
            name="price"
            upperLabel="Price per item"
            placeholder="Input"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="cost_goods"
            upperLabel="Cost of goods(per item)"
            placeholder="Input"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="other_cost"
            upperLabel="Other Costs (per item)"
            placeholder="Input"
          />
        </Grid>
        {/* //next */}
        <Grid item xs={12} md={4} mt={1}>
          <Typography gutterBottom variant="body2" style={{ margin: 0 }}>
            Apply price
          </Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{
              width: '100%',
              boxShadow: 'none',
            }}
          >
            Calculate
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="compare_price"
            upperLabel="Compare price setting"
            placeholder="Input"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="promoted_listing"
            upperLabel="Promoted listing, %"
            placeholder="Input"
          />
        </Grid>

        {/* //next */}
        <Grid item xs={12} md={4}>
          <RHFTextField type="number" name="upc" upperLabel="UPC" placeholder="Input" />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField type="number" name="mrp" upperLabel="MRP" placeholder="Input" />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField type="number" name="msrp" upperLabel="MSRP" placeholder="Input" />
        </Grid>
        {/* //next */}
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="shipping_weight"
            upperLabel="Shipping weight, Lb/Kg"
            placeholder="Input"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="shipping_length"
            upperLabel="Shipping package length"
            placeholder="Input"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="shipping_height"
            upperLabel="Shipping package height"
            placeholder="Input"
          />
        </Grid>
        {/* //next */}
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="shipping_weight_oz"
            upperLabel="Shipping Weight, Oz/G"
            placeholder="Input"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="shipping_width"
            upperLabel="Shipping package width"
            placeholder="Input"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="profit"
            upperLabel="Profit (total)"
            placeholder="Input"
          />
        </Grid>
        {/* //next */}
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="zip_code"
            upperLabel="Shipping Zip or City code"
            placeholder="Input"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField
            type="number"
            name="campaign_list"
            upperLabel="Campaign list"
            placeholder="Input"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            size="small"
            variant="outlined"
            sx={{
              marginTop: '2rem',
              width: '100%',
              boxShadow: 'none',
            }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default GeneralSettings;
