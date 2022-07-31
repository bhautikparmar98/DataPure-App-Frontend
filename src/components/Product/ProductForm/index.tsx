// @mui
import { Container, Grid } from '@mui/material';
//components
import ProductTabs from 'src/components/Product/Listing/children/ProductTabs';
//hooks
import useSettings from 'src/hooks/useSettings';
import { useProductFormTabs } from './hooks';
//types
import { ProductTabsProps } from 'src/components/Product/Listing/types';
// utils
import useResponsive from 'src/hooks/useResponsive';
//children

import AdvancedListing from './children/AdvancedListing';
import BasicListing from './children/BasicListing';
import SupplierExpenses from './children/BasicListing/SupplierExpenses';

import { useBasicListing } from './hooks/useBasicListing';
//interface
import { EditProductProps } from './interfaces';
import ProductImages from './children/ProductImages';
import ProductHead from './children/ProductHead';

// ----------------------------------------------------------------------
const EditProduct: React.FC<EditProductProps> = ({ productId }) => {
  const { themeStretch } = useSettings();
  const isDesktop = useResponsive('up', 'lg');
  const { TABS, currentTab, handleTabChange }: ProductTabsProps = useProductFormTabs();
  const { marketPlaceChangeHandler, supplierExpensesHandler } = useBasicListing();

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Grid container spacing={8}>
        <Grid item xs={8}>
          <ProductHead productImages={[]} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ProductTabs TABS={TABS} currentTab={currentTab} handleTabChange={handleTabChange} />
              {currentTab === 'basic_listing' ? (
                <Grid>
                  <BasicListing listing={null} onMarketPlaceChange={marketPlaceChangeHandler} />
                </Grid>
              ) : (
                <Grid>
                  <AdvancedListing productImagesList={[]} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <ProductImages productImagesList={[]} />
          <SupplierExpenses listing={null} onSubmit={supplierExpensesHandler} />
          {/* <Button /> */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditProduct;
