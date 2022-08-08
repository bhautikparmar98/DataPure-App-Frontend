import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import useSettings from 'src/hooks/useSettings';
import useDatasetReview from './hooks/useDatasetReview';
import { useTheme } from '@mui/material/styles';
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
import HeaderBreadcrumbs from 'src/components/Shared/HeaderBreadcrumbs';
import ReviewHeaderToolBar from './ReviewHeaderToolBar';
import Scrollbar from 'src/components/Shared/Scrollbar';
import ReviewListHead from './ReviewListHead';
import Image from 'src/components/Shared/Image';
import { fDate } from 'src/utils/formatTime';
import Label from 'src/components/Shared/Label';
import { IMAGE_STATUS } from 'src/constants/ImageStatus';
import SearchNotFound from 'src/components/Shared/SearchNotFound';
import TablePaginationActionWithDense from 'src/components/Shared/TablePaginationActionWithDense';

interface ProjectDataSetReviewProps {
  projectId: string;
}

const ProjectDataSetReview: React.FC<ProjectDataSetReviewProps> = ({
  projectId,
}) => {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const {
    loading,
    imageList,
    page,
    order,
    selected,
    filterName,
    rowsPerPage,
    orderBy,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangeRowsPerPage,
    handleFilterByName,
    handleDeleteImage,
    handleDeleteImages,
    emptyRows,
    isNotFound,
    filteredImages,
    setPage,
    isDense,
    denseToggleHandler,
  } = useDatasetReview({ projectId });

  const reviewHandler = () => {
    // TODO: navigate to editor
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading="Project List"
        links={[
          { name: 'Projects', href: PATH_DASHBOARD.project.list },
          {
            name: 'Review',
          },
        ]}
        // action={
        //   <NextLink href={PATH_DASHBOARD.eCommerce.newProduct} passHref>
        //     <Button
        //       variant="contained"
        //       startIcon={<Iconify icon="eva:plus-fill" />}
        //     >
        //       New Product
        //     </Button>
        //   </NextLink>
        // }
      />

      <Card>
        <ReviewHeaderToolBar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteProducts={() => handleDeleteImages(selected)}
          dense={isDense}
          toggleDense={denseToggleHandler}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table size={isDense ? 'small' : 'medium'}>
              <ReviewListHead
                order={order}
                orderBy={orderBy}
                rowCount={imageList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />

              <TableBody>
                {filteredImages
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const { _id, fileName, src, createdAt, status } = row;

                    const isItemSelected = selected.indexOf(_id!) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onClick={() => handleClick(fileName)}
                          />
                        </TableCell>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell align="center">
                          <Image
                            disabledEffect
                            alt={fileName}
                            src={src}
                            sx={{
                              borderRadius: '50%',
                              width: isDense ? 32 : 54,
                              height: isDense ? 32 : 54,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {fileName.length > 30
                              ? fileName.slice(0, 30) + '...'
                              : fileName}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ minWidth: 160 }}>
                          {fDate(createdAt)}
                        </TableCell>
                        <TableCell align="center">_</TableCell>
                        <TableCell align="center" style={{ minWidth: 160 }}>
                          <Label
                            color={
                              IMAGE_STATUS[status as keyof typeof IMAGE_STATUS]
                                .color as any
                            }
                          >
                            {
                              IMAGE_STATUS[status as keyof typeof IMAGE_STATUS]
                                .label
                            }
                          </Label>
                        </TableCell>
                        <TableCell align="center" color="default">
                          <Button variant="text" onClick={reviewHandler}>
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      <Box sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={imageList.length}
          rowsPerPage={rowsPerPage}
          width="100%"
          colSpan={1}
          page={page}
          onPageChange={(event, value) => setPage(value)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default ProjectDataSetReview;
