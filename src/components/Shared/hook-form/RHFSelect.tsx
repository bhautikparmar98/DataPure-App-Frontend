// form
import { useFormContext, Controller, FieldValues, Control } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  children: any;
  native?: boolean;
  upperLabel?: string;
  control?: Control<FieldValues, object>;
}

export default function RHFSelect({ name, children, upperLabel, native, control, ...other }: IProps & TextFieldProps) {
  const context = useFormContext();

  const fieldControl = control || context?.control;

  return (
    <>
      {upperLabel && (
        <Typography gutterBottom variant="body2" style={{ margin: 0 }}>
          {upperLabel}
        </Typography>
      )}

      <Controller
        name={name}
        control={fieldControl}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            select
            fullWidth
            SelectProps={{ native: native }}
            error={!!error}
            helperText={error?.message}
            {...other}>
            {children}
          </TextField>
        )}
      />
    </>
  );
}
