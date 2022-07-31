import { Grid, Button } from '@mui/material';
import { FormProvider, RHFTextField, RHFCheckbox } from 'src/components/Shared/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import BlockVariant from '../../BlockVariant';

export type SupplierExpensesValuesProps = {
  supplier: string;
  supplierPercentage: number;
  notes: string;
  delist: boolean;
};

interface SupplierExpensesProps {
  listing: any;
  onSubmit: (values: SupplierExpensesValuesProps) => void;
}

const SupplierExpenses: React.FC<SupplierExpensesProps> = ({ listing, onSubmit }) => {
  const defaultValues = {
    supplier: listing?.supplier || '',
    supplierPercentage: listing?.supplierPercentage || 0,
    notes: listing?.notes || '',
    delist: listing?.delist || '',
  };

  const SupplierExpensesSchema = Yup.object().shape({
    supplier: Yup.string().required(),
    supplierPercentage: Yup.number().required(),
    notes: Yup.string().optional(),
    delist: Yup.boolean().required(),
  });

  const methods = useForm<SupplierExpensesValuesProps>({
    resolver: yupResolver(SupplierExpensesSchema),
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

  const submitHandler = async (data: any) => {
    try {
      onSubmit(data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(submitHandler)}>
      <Grid container style={{ marginTop: 15 }}>
        <Grid xs={12}>
          <BlockVariant key={'h5'} font={{ variant: 'h5', label: 'Supplier Expenses' }} />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <RHFTextField name="supplier" upperLabel="Supplier" />
          </Grid>
          <Grid item xs={3}>
            <RHFTextField name="supplierPercentage" upperLabel="Supplier's %" />
          </Grid>
        </Grid>
        <RHFCheckbox name="delist" label="Delist once the item is SOLD" color="text.secondary" />
        <Grid container style={{ marginTop: 20 }}>
          <RHFTextField name="notes" upperLabel="Notes (optional)" fullWidth multiline rows={4} />
        </Grid>
        <Grid container style={{ marginTop: 20 }} spacing={1}>
          <Grid item xs={6}>
            <Button variant="outlined" fullWidth>
              Save Draft
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
export default SupplierExpenses;
