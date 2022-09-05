import React, { useEffect, useState } from 'react';

// @mui
import { Box, Button, Container, Menu, MenuItem, Stack } from '@mui/material';
// components
import { SkeletonProductItem } from 'src/components/Shared/skeleton';
//
import { yupResolver } from '@hookform/resolvers/yup';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import HeaderBreadcrumbs from 'src/components/Shared/HeaderBreadcrumbs';
import { FormProvider } from 'src/components/Shared/hook-form';
import Iconify from 'src/components/Shared/Iconify';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';
import AddClassDialog from '../Form/AddClass';
import { IProject } from '../List/types/project';
import AddImagesDialog from './AddImages';
import ClassesAccordion from './ClassesAccordion';
import DataSetCard from './DataSetCard';
import { IImage } from './types';

// ----------------------------------------------------------------------

interface ProjectDataSetComponentProps {
  projectId: string;
}

//------------------------------------------------------------------------

const LOAD_MORE_COUNT = 8;

export const ProjectDataSetComponent: React.FC<
  ProjectDataSetComponentProps
> = ({ projectId }) => {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),

    // statusType: Yup.string().optional(),
    // dataType: Yup.string().optional(),
    // annotationFile: Yup.array().optional(),
  });
  const methods = useForm({
    resolver: yupResolver(NewProjectSchema),
    defaultValues: {
      name: '',
    },
  });
  const [imagesList, setImagesList] = useState<IImage[]>([]);
  const [filteredImageList, setFilteredImageList] = useState<IImage[]>([]);
  const [numberOfLoaded, setNumberOfLoaded] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addImagesModalOpened, setAddImagesModalOpened] = useState(false);
  const [project, setProject] = useState<IProject | null>(null);
  const [getProjectLoading, setGetProjectLoading] = useState(false);
  const [rerenderProject, setRerenderProject] = useState(0);
  const [classAddOpen, setClassAddOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);
  const open = Boolean(anchorEl);

  const loadMoreHandler = () => {
    const arr = imagesList.slice(0, numberOfLoaded + LOAD_MORE_COUNT);
    setFilteredImageList(arr);
    setNumberOfLoaded(arr.length);
  };

  const addingImagesHandler = (data: any) => {
    setImagesList((prev) => [...data, ...prev]);
    setFilteredImageList((prev) => [...data, ...prev]);
    setNumberOfLoaded((prev) => prev + data.length);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getProject = async () => {
    if (!projectId)
      return enqueueSnackbar('Invalid Project', { variant: 'error' });

    try {
      setGetProjectLoading(true);

      const response = await axiosInstance.get(`/project/${projectId}`);
      const { project } = response.data;

      setProject(project);
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
    setGetProjectLoading(false);
  };

  const addClassHandler = async (data: { name: string; color: string }) => {
    try {
      await axiosInstance.put(`/project/${projectId}/addClasses`, {
        classes: [data],
      });

      setRerenderProject((prev) => prev + 1);
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong with adding class', {
        variant: 'error',
      });
    }
  };

  const selectImageHandler = (id: string) => {
    const index = selectedImages.findIndex((i) => i === id);
    let items = [];
    if (index > -1) items = selectedImages.filter((i) => i !== id);
    else items = [...selectedImages, id];

    setSelectedImages(items);
  };

  const isChecked = (id: string) => {
    const index = selectedImages.findIndex((i) => i === id);
    return index > -1;
  };

  const deleteImagesHandler = async () => {
    try {
      setDeleteImageLoading(true);
      await axiosInstance.put(`/project/${projectId}/images/delete`, {
        imageIds: selectedImages,
      });

      setImagesList((prev) =>
        prev.filter((img: any) => !selectedImages.includes(img._id))
      );
      setFilteredImageList((prev) =>
        prev.filter((img: any) => !selectedImages.includes(img._id))
      );
      setSelectedImages([]);
    } catch (error) {
      console.log('error');
      enqueueSnackbar('Something went wrong with deleting images', {
        variant: 'error',
      });
    }
    setDeleteImageLoading(false);
  };

  useEffect(() => {
    const getProjectImages = async () => {
      if (!projectId)
        return enqueueSnackbar('Invalid Project', { variant: 'error' });

      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `/project/${projectId}/images`
        );
        const { images } = response.data;

        setImagesList(images);
        setFilteredImageList(images.slice(0, LOAD_MORE_COUNT));
        setNumberOfLoaded(LOAD_MORE_COUNT);
      } catch (error) {
        console.log('error', error);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
      setLoading(false);
    };

    getProjectImages();
    getProject();
  }, [projectId]);

  useEffect(() => {
    if (rerenderProject) getProject();
  }, [rerenderProject]);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading="Data Set"
        links={[
          { name: 'Projects', href: PATH_DASHBOARD.project.root },

          { name: 'Dataset' },
        ]}
        action={
          <>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="akar-icons:trash-can" />}
              onClick={deleteImagesHandler}
              disabled={selectedImages.length === 0 || deleteImageLoading}
              color="error"
              sx={{ mx: 1 }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setAddImagesModalOpened(true)}
              sx={{ mx: 1 }}
            >
              Add Images
            </Button>
            <IconButton
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          </>
        }
      />

      <FormProvider methods={methods} onSubmit={() => console.log()}>
        <AddClassDialog
          open={classAddOpen}
          onClose={() => setClassAddOpen(false)}
          onFinishAddingClass={addClassHandler}
        />
      </FormProvider>

      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => setClassAddOpen(true)}>Add Class</MenuItem>
      </Menu>

      <AddImagesDialog
        open={addImagesModalOpened}
        onClose={() => setAddImagesModalOpened(false)}
        onFinishAddingImages={addingImagesHandler}
        projectId={projectId}
      />

      <ClassesAccordion project={project} loading={getProjectLoading} />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(4, 1fr)',
          },
        }}
      >
        {(loading ? [...Array(12)] : filteredImageList).map((image, index) =>
          image ? (
            <DataSetCard
              key={image._id}
              image={image}
              index={index}
              totalLength={imagesList.length}
              isChecked={isChecked}
              onSelectCard={selectImageHandler}
            />
          ) : (
            <SkeletonProductItem key={index} />
          )
        )}
      </Box>

      {numberOfLoaded < imagesList.length && (
        <Stack justifyContent="center" alignItems="center" marginY={3}>
          <Button variant="contained" color="primary" onClick={loadMoreHandler}>
            Load More
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default ProjectDataSetComponent;
