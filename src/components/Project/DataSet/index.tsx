import React, { useEffect, useState } from 'react';

// @mui
import { Box, Button, Container, Stack } from '@mui/material';
// components
import { SkeletonProductItem } from 'src/components/Shared/skeleton';
//
import { useSnackbar } from 'notistack';
import HeaderBreadcrumbs from 'src/components/Shared/HeaderBreadcrumbs';
import Iconify from 'src/components/Shared/Iconify';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
import axiosInstance from 'src/utils/axios';
import AddImagesDialog from './AddImages';
import DataSetCard from './DataSetCard';
import { IImage } from './types';

// ----------------------------------------------------------------------

interface ProjectDataSetComponentProps {
  projectId: string;
}

//------------------------------------------------------------------------

const LOAD_MORE_COUNT = 5;

export const ProjectDataSetComponent: React.FC<
  ProjectDataSetComponentProps
> = ({ projectId }) => {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const [imagesList, setImagesList] = useState<IImage[]>([]);
  const [filteredImageList, setFilteredImageList] = useState<IImage[]>([]);
  const [numberOfLoaded, setNumberOfLoaded] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addImagesModalOpened, setAddImagesModalOpened] = useState(false);

  const loadMoreHandler = () => {
    const arr = imagesList.slice(0, numberOfLoaded + LOAD_MORE_COUNT);
    setFilteredImageList(arr);
    setNumberOfLoaded(arr.length);
  };

  const addingImagesHandler = (data) => {
    setImagesList((prev) => [...data, ...prev]);
    setFilteredImageList((prev) => [...data, ...prev]);
    setNumberOfLoaded((prev) => prev + data.length);
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
  }, [projectId]);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading="Data Set"
        links={[
          { name: 'Projects', href: PATH_DASHBOARD.project.root },

          { name: 'Dataset' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setAddImagesModalOpened(true)}
          >
            Add Images
          </Button>
        }
      />

      <AddImagesDialog
        open={addImagesModalOpened}
        onClose={() => setAddImagesModalOpened(false)}
        onFinishAddingImages={addingImagesHandler}
        projectId={projectId}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
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
