import { useState } from 'react';

// form

// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, Checkbox, Grid, Stack, Typography } from '@mui/material';

import CircleCheckedFilled from '@mui/icons-material/CheckCircle';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';

// components
import { RHFTextField } from 'src/components/Shared/hook-form';
//types
//validation
import { availableColors } from 'src/constants/availableColors';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

interface ClassFormProps {
  onSubmit: (data: { name: string; color: string }) => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ onSubmit }) => {
  const [color, setColor] = useState('');
  const [name, setName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async () => {
    try {
      await onSubmit({ name, color });
    } catch (error) {
      console.log('error ', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const isColorChecked = (c: string) => color === c;

  return (
    <>
      <Stack spacing={2} sx={{ mt: 4, pr: 2 }}>
        <RHFTextField
          name="name"
          label="Class Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Stack>

      <Stack color="text.secondary" sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mt: 2, mb: 0 }}>
          Pick Class Color
        </Typography>

        <Grid container>
          {availableColors.map((c) => (
            <Grid item xs={2} sm={1} key={c}>
              <Checkbox
                checked={isColorChecked(c)}
                onClick={() => setColor(c)}
                icon={
                  <CircleUnchecked
                    sx={{
                      backgroundColor: c,
                      borderRadius: '50%',
                      color: 'white',
                    }}
                  />
                }
                checkedIcon={
                  <CircleCheckedFilled
                    sx={{
                      backgroundColor: c,
                      borderRadius: '50%',
                      color: 'white',
                    }}
                  />
                }
              />
            </Grid>
          ))}
        </Grid>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 6 }} spacing={2}>
        <LoadingButton
          type="submit"
          variant="contained"
          fullWidth
          disabled={color === '' || name === ''}
          onClick={submitHandler}
        >
          Add
        </LoadingButton>
      </Stack>
    </>
  );
};

export default ClassForm;
