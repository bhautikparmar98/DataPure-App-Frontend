//types
import { BlockVariantProps } from '../../types';
//@mui
import { Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
// utils
import getFontValue from 'src/utils/getFontValue';

const BlockVariant = ({ font }: BlockVariantProps) => {
  const getValue = (variant: Variant) => getFontValue(variant);

  const { variant, label } = font;

  return (
    <Typography variant={variant} gutterBottom>
      {label}
    </Typography>
  );
};

export default BlockVariant;
