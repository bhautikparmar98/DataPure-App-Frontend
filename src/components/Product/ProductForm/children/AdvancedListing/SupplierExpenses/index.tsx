//hooks
import useResponsive from 'src/hooks/useResponsive';
// @mui
import { Box, Card, Container, Typography, CardHeader, Grid, Badge } from '@mui/material';
//components
import { EditBlockVariant } from '../../BlockVariant';

// ----------------------------------------------------------------------
const SupplierExpenses: React.FC<any> = ({ productImagesList }) => {
  const isDesktop = useResponsive('up', 'lg');
  return (
    <Grid container>
      <Grid xs={12}>
        <EditBlockVariant key={'h5'} font={{ variant: 'h5', label: 'Supplier expenses' }} />
      </Grid>
    </Grid>
  );
};

export default SupplierExpenses;
