// form
import { useFormContext, Controller, useController } from 'react-hook-form';
// @mui
import {
  Box,
  Button,
  Grid,
  SvgIcon,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
} from '@mui/material';
import Iconify from '../Iconify';
import Label from '../Label';

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  type?: string;
  suggestions?: string[];
  upperLabel?: string;
  robot?: boolean;
}

export default function RHFTextField({
  name,
  type,
  suggestions,
  upperLabel,
  robot,
  ...other
}: IProps & TextFieldProps) {
  const { control } = useFormContext();
  const {
    field: { onChange },
  } = useController({ control, name });

  return (
    <>
      <Box display={'flex'} justifyContent="flex-start" alignItems="center">
        {robot && (
          <Tooltip
            placement="bottom-start"
            title="This information is auto-filled. You can always edit if something goes wrong."
          >
            <SvgIcon
              color="primary"
              sx={{ cursor: 'pointer' }}
              style={{ width: 16, height: 16, marginRight: 5 }}
            >
              <Iconify icon={'mdi:robot-outline'} />
            </SvgIcon>
          </Tooltip>
        )}
        {upperLabel && (
          <Typography gutterBottom variant="body2" style={{ margin: 0 }}>
            {upperLabel}
          </Typography>
        )}
      </Box>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            type={type || 'text'}
            {...field}
            fullWidth
            error={!!error}
            inputProps={{ style: { height: other.rows ? '' : '10px' } }}
            helperText={error?.message}
            {...other}
          />
        )}
      />

      {suggestions && (
        <Box marginTop={0.5}>
          {suggestions.map((suggestion, index) => (
            <Label
              sx={{ marginRight: 0.5, cursor: 'pointer', fontWeight: 'normal' }}
              color="info"
              variant="filled"
              onClick={() => onChange(suggestion)}
              key={`${suggestion} ${index}`}
            >
              {suggestion}
            </Label>
          ))}
        </Box>
      )}
    </>
  );
}
