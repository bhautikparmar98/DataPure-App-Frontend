// react
import React from 'react';
import { Typography, Box, Table, TableRow, Checkbox, TableCell } from '@mui/material';
// @mui
import { useTheme } from '@mui/material/styles';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// components
import Scrollbar from 'src/components/Shared/Scrollbar';
import Image from 'src/components/Shared/Image';
import Label from 'src/components/Shared/Label';
import SearchNotFound from 'src/components/Shared/SearchNotFound';
import Iconify from 'src/components/Shared/Iconify';
import ProductEdit from './ProductEdit';
import ProductListHead from './ProductListHead';
// styles
import { TableBodyStyle } from './styles';
// types
import { ListingTableProps } from './interfaces';

const ListingTable = ({
  filteredProducts,
  filterName,
  order,
  orderBy,
  rowCount,
  numSelected,
  currentTab,
  onRequestSort,
  onSelectAllClick,
  emptyRows,
  rowsPerPage,
  page,
  isNotFound,
  selected,
  handleClick,
}: ListingTableProps) => {
  const theme = useTheme();

  return (
    <Scrollbar>
      <Table size="small">
        <ProductListHead
          order={order}
          orderBy={orderBy}
          rowCount={rowCount}
          numSelected={numSelected}
          currentTab={currentTab}
          onRequestSort={onRequestSort}
          onSelectAllClick={onSelectAllClick}
        />
        <TableBodyStyle>
          {filteredProducts
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, i) => {
              const { id, name, image, price, date, sku, status } = row;
              const isItemSelected = selected.indexOf(name) !== -1;

              return (
                <TableRow
                  hover
                  key={id}
                  tabIndex={-1}
                  role="checkbox"
                  selected={isItemSelected}
                  aria-checked={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                  </TableCell>
                  <TableCell style={{ width: 40 }}>{i + 1}</TableCell>
                  <TableCell className="img-wrapper">
                    <Image
                      disabledEffect
                      alt={name}
                      src={image}
                      sx={{ display: 'inline-block', verticalAlign: 'middle' }}
                      className="img"
                    />
                    <Typography className="name" variant="inherit" noWrap>
                      {name}
                    </Typography>
                  </TableCell>
                  <TableCell>{sku}</TableCell>
                  {currentTab === 'listings' && (
                    <>
                      <TableCell>
                        <Typography variant="inherit" noWrap>
                          {typeof date === 'string' && date.slice(1).split('-').reverse().join('-')}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{fCurrency(price)}</TableCell>
                      <TableCell align="center">
                        <Iconify
                          icon={'bi:arrows-angle-expand'}
                          sx={{
                            cursor: 'pointer',
                            color: 'text.secondary',
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: 160 }}>
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          sx={theme.palette.label[status]}
                        >
                          {status}
                        </Label>
                      </TableCell>
                    </>
                  )}
                  <TableCell align="right">
                    <ProductEdit productName={name} onDelete={() => {}} />
                  </TableCell>
                </TableRow>
              );
            })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBodyStyle>
        {isNotFound && (
          <TableBodyStyle>
            <TableRow>
              <TableCell colSpan={12}>
                <Box sx={{ py: 3 }}>
                  <SearchNotFound searchQuery={filterName} />
                </Box>
              </TableCell>
            </TableRow>
          </TableBodyStyle>
        )}
      </Table>
    </Scrollbar>
  );
};

export default ListingTable;
