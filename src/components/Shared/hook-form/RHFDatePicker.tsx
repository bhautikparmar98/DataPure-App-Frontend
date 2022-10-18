// @ts-nocheck

// form
import { useFormContext, Controller, FieldValues, Control } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// ----------------------------------------------------------------------
interface IProps {
  name: string;

  native?: boolean;
  upperLabel?: string;
  control?: Control<FieldValues, object>;
}

export default function RHFDatePicker({
  name,

  upperLabel,
  native,
  control,
  ...other
}: IProps & TextFieldProps) {
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
          <DesktopDatePicker
            {...field}
            inputFormat="MM/dd/yyyy"
            error={!!error}
            helperText={error?.message}
            fullWidth
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        )}
      />
    </>
  );
}
