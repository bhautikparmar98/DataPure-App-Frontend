// @mui
import { TablePagination } from '@mui/material';
// styles
import { ContainerStyle } from './styles/index.style';
// hooks
import useSettings from 'src/hooks/useSettings';
import useResponsive from 'src/hooks/useResponsive';
import useListings from './hooks/useListings';
import usePage from 'src/hooks/usePage';
import useListingsTabs from './hooks/useListingsTabs';
// components
import ProductListToolbar from './children/ProductListToolbar';
import ListingTable from './children/ListingTable';
import ProductTabs from './children/ProductTabs';
import Page from 'src/components/Shared/Page';

// types
import { ProductTabsProps } from './types';

const Listings = () => {
  const { themeStretch } = useSettings();

  const {
    order,
    orderBy,
    filterName,
    handleFilterByName,
    handleDeleteProducts,
    productList,
    selected,
    handleRequestSort,
    handleSelectAllClick,
    filteredProducts,
    handleClick,
    isNotFound,
  } = useListings();

  const { page, handleChangeRowsPerPage, setPage, emptyRows, rowsPerPage } = usePage(productList);
  const { TABS, currentTab, handleTabChange }: ProductTabsProps = useListingsTabs();
  const isDesktop = useResponsive('up', 'lg');

  return (
    <Page title="My Listings">
      <ProductTabs TABS={TABS} currentTab={currentTab} handleTabChange={handleTabChange} />
      <ContainerStyle
        maxWidth={themeStretch ? false : 'xl'}
        className={!isDesktop ? 'small-screen' : ''}
      >
        <ProductListToolbar
          numSelected={selected.length}
          filterName={filterName}
          currentTab={currentTab}
          onFilterName={handleFilterByName}
          onDeleteProducts={() => handleDeleteProducts(selected)}
        />
        <ListingTable
          filteredProducts={filteredProducts}
          order={order}
          orderBy={orderBy}
          rowCount={productList.length}
          numSelected={selected.length}
          currentTab={currentTab}
          onRequestSort={handleRequestSort}
          onSelectAllClick={handleSelectAllClick}
          emptyRows={emptyRows}
          page={page}
          rowsPerPage={rowsPerPage}
          isNotFound={isNotFound}
          selected={selected}
          handleClick={handleClick}
          filterName={filterName}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={productList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, value) => setPage(value)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ContainerStyle>
    </Page>
  );
};
export default Listings;
