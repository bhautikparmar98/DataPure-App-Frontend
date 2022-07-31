//hooks
import useResponsive from 'src/hooks/useResponsive';
// @mui
import { Box, Card, Container, Typography, CardHeader, Grid, Badge } from '@mui/material';
//components
import BlockVariant from '../BlockVariant';
//Children
import ProductDetails from './ProductDetails';
import GeneralSettings from './GeneralSettings';
import ProductMarketPlaces from './ProductMarketPlaces';
import GeneralShipping from './GeneralShipping';
import ProductSize from './ProductSize';
import SupplierExpenses from './SupplierExpenses';

// ----------------------------------------------------------------------
interface BasicListingProps {
  listing: any; // TODO: create a type for listing and use it here
}
const AdvancedListing: React.FC<any> = ({ listing }) => {
  const isDesktop = useResponsive('up', 'lg');

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ProductDetails listing={listing} />
      </Grid>
      <Grid item xs={12}>
        <GeneralSettings listing={listing}></GeneralSettings>
      </Grid>
      {/* <ProductMarketPlaces productImagesList={[]}></ProductMarketPlaces>
      <GeneralShipping productImagesList={[]}></GeneralShipping>
      <ProductSize productImagesList={[]}></ProductSize>
      <SupplierExpenses productImagesList={[]}></SupplierExpenses> */}
    </Grid>
  );
};

export default AdvancedListing;
