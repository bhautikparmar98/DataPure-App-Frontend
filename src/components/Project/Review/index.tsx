import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import BasicTimeline from 'src/components/Shared/BasicTimeLine';
import HeaderBreadcrumbs from 'src/components/Shared/HeaderBreadcrumbs';
import Image from 'src/components/Shared/Image';
import Label from 'src/components/Shared/Label';
import Scrollbar from 'src/components/Shared/Scrollbar';
import SearchNotFound from 'src/components/Shared/SearchNotFound';
import { IMAGE_STATUS } from 'src/constants/ImageStatus';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { addProjectIds } from 'src/redux/slices/editor/editor.slice';
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
import axiosInstance from 'src/utils/axios';
import { fDate, f1Date } from 'src/utils/formatTime';
import useDatasetReview from './hooks/useDatasetReview';
import ReviewHeaderToolBar from './ReviewHeaderToolBar';
import ReviewListHead from './ReviewListHead';
import { IProject } from '../List/types/project';
import _ from 'lodash';
import { current } from '@reduxjs/toolkit';


interface ProjectDataSetReviewProps {
  projectId: string;
}

const ProjectDataSetReview: React.FC<ProjectDataSetReviewProps> = ({ projectId }) => {
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

  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [projects, setProjects] = useState<IProject[]>([]);


  const getProjects = async () => {
    if (user === null) throw new Error('Client can not be null');
    try {
      const response = await axiosInstance.get(`/user/${user.id}/project`);
      const { projects } = response.data;
      setProjects(projects);
    } catch (error) {
      console.log('error', error)
    }
  };
  const currentProject = projects.find((p:IProject)=> p._id === projectId)

  useEffect(() => {
    getProjects();
  }, []);

  const reviewHandler = (imageId: string | undefined) => {
    if (typeof imageId === 'string') {
      localStorage.setItem(projectId, imageId);
      const imagesIds = imageList
        .filter((img) => img.status === IMAGE_STATUS.PENDING_CLIENT_REVIEW.value)
        .map((img) => img._id);
      dispatch(addProjectIds({ projectId, imagesIds }));
    }
    router.push(`/editor/${projectId}`);
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
    
      <HeaderBreadcrumbs
        heading={currentProject?.name !== undefined ? currentProject?.name : '' }
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
          project={currentProject}
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
                {filteredImages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  const { _id, fileName, src, createdAt, status, dateAnnotated } = row;

                  const isItemSelected = selected.indexOf(_id!) !== -1;

                  return (
                    <TableRow
                      hover
                      key={_id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onClick={() => handleClick(_id!)} />
                      </TableCell>
                      <TableCell align='center'>{page * rowsPerPage + index + 1}</TableCell>
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
                      <TableCell sx={{  alignItems: 'center' }}>
                          {fileName.length > 30 ? fileName.slice(0, 30) + '...' : fileName}
                      </TableCell>
                      <TableCell style={{ minWidth: 160 }}>{fDate(createdAt)}</TableCell>
                      <TableCell align="center">{dateAnnotated ? f1Date(dateAnnotated) : '_'}</TableCell>
                      <TableCell align="center" style={{ minWidth: 160 }}>
                        <BasicTimeline value={IMAGE_STATUS[status as keyof typeof IMAGE_STATUS].value as any}/>
                        {/* <Label color={IMAGE_STATUS[status as keyof typeof IMAGE_STATUS].color as any}>
                          {IMAGE_STATUS[status as keyof typeof IMAGE_STATUS].label}
                        </Label> */}
                      </TableCell>
                      <TableCell align="center" color="default">
                        <Button
                          disabled={status !== IMAGE_STATUS.PENDING_CLIENT_REVIEW.value}
                          variant="text"
                          onClick={(e) => reviewHandler(_id)}>
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
