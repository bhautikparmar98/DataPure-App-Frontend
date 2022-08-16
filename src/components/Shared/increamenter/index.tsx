import { Box, Grid, IconButton, Typography } from '@mui/material';
import Iconify from 'src/components/Shared/Iconify';

type IncrementerProps = {
  name: string;
  quantity: number;
  available?: number;
  onIncrementQuantity: VoidFunction;
  onDecrementQuantity: VoidFunction;
};

function Incrementer({ quantity, onIncrementQuantity, onDecrementQuantity }: IncrementerProps) {
  return (
    <Box
      sx={{
        py: 1,
        px: 1,
        height: '55px',
        border: 1,
        lineHeight: 0,
        borderRadius: 0.5,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'grey.50032',
        boxShadow: '0px 0px 4px 1px rgba(184, 184, 184, 0.15)',
      }}
    >
      <IconButton
        size="small"
        color="inherit"
        disabled={quantity <= 1}
        onClick={onDecrementQuantity}
      >
        <Iconify icon={'eva:minus-fill'} width={14} height={14} />
      </IconButton>

      <Typography variant="body2" component="span" sx={{ width: 40, textAlign: 'center' }}>
        {quantity}
      </Typography>

      <IconButton size="small" color="inherit" onClick={onIncrementQuantity}>
        <Iconify icon={'eva:plus-fill'} width={14} height={14} />
      </IconButton>
    </Box>
  );
}

export default Incrementer;
