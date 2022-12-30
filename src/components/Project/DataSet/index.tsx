import React, { useEffect, useState } from 'react';

// @mui
import { Box, Button, Container, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';
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
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
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
import ShowUserlistDialog from './showList/showUserlistDialog';
import { f1Date } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

interface ProjectDataSetComponentProps {
  projectId: string | string[];
}

export interface ListProp {
  open: boolean;
  onClose: () => void;
  project: IProject | null;
  Users?:any[];
  setProject: any;
  typeofUser: string
}

//------------------------------------------------------------------------

const LOAD_MORE_COUNT = 8;

export const ProjectDataSetComponent: React.FC<
  ProjectDataSetComponentProps
> = ({ projectId }) => {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const { role } = useAuth();

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
  const [viewAnnotatorsModalOpened, setviewAnnotatorsModalOpened] = useState(false);
  const [viewQAsModalOpened, setviewQAsModalOpened] = useState(false);
  const [project, setProject] = useState<IProject | null>(null);
  const [getProjectLoading, setGetProjectLoading] = useState(false);
  const [rerenderProject, setRerenderProject] = useState(0);
  const [classAddOpen, setClassAddOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);
  const open = Boolean(anchorEl);
  const [QAs, setQAs] = useState<any[]>([]);
  const [annotators, setAnnotators] = useState<any[]>([]);
  
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
        classes: [{ name: data.name, color: data.color }],
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

  const canDelete = () => {
    if (role === ROLES.CLIENT.value) return true;
    if (role === ROLES.SUPER_ADMIN.value) return true;
    if (role === ROLES.ADMIN.value) return true;
    return false;
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
      enqueueSnackbar('Images is deleted successfully.', {
        variant: 'info',
      });
    } catch (error) {
      console.log('error');
      enqueueSnackbar('Something went wrong with deleting images', {
        variant: 'error',
      });
    }
    setDeleteImageLoading(false);
  };

  useEffect(() => {
    const getQAs = async () => {
      try {
        const response = await axiosInstance.get('/user/qa');
        const { qas } = response.data;

        setQAs(qas);
      } catch (error) {
        console.log('error', error);
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
    };

    const getAnnotators = async () => {
      try {
        const response = await axiosInstance.get('/user/annotator');
        const { annotators } = response.data;

        setAnnotators(annotators);
      } catch (error) {
        console.log('error getting annotators', error);
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
    };
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
    getQAs();
    getAnnotators();
  }, [projectId]);

  useEffect(() => {
    if (rerenderProject) getProject();
  }, [rerenderProject]);
  
  const options = [
    { title: 'Archive', icon: "bxs:file-archive" },
    { title: 'Edit Name', icon: "mdi:pencil" },
    { title: 'Delete', icon: "mdi:delete" }
  ];

  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false)

  const handleMenuClicked = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowFilterMenu(false)
  };

  const handleFilterMenuClicked = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowFilterMenu(true)
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    option: any = {}
  ) => {
    if (option.title === 'Delete') {
      deleteImagesHandler()
    }
    if (option.title === 'Edit') {
      //..
    }
    if (option.title === 'Archive') {
      //...
    }
    //onClick={() => a.action(project)
    setAnchorEl(null);
  };
  const handleClose = (e: any) => {
    setAnchorEl(null);
  };


  const handleMouseOver = (e: any, index: number) => {
    if (index !== 2) e.target.style.color = 'rgba(48,63,191,255)'
  }
  const handleMouseOut = (e: any, index: number) => {
    if (index !== 2) e.target.style.color = 'black'
  }

  const date : string = f1Date(new Date())

  const filterArray = ['Uploaded Succesfully', 'Ready for Review', 'Under Review', 'Completed' ]

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
            {/* {canDelete() && (
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
            )}
            {role === ROLES.CLIENT.value && <>
              <Button
              variant="contained"
              onClick={() => setviewAnnotatorsModalOpened(true)}
              sx={{ mx: 1 }}
             >View Annotators
            </Button>
            <Button variant="contained" sx={{ mx: 1 }} 
              onClick={() => {
                setviewQAsModalOpened(true)
                setProject(project)
              }}
              >View QAs
            </Button>
            </>
            }
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setAddImagesModalOpened(true)}
              sx={{ mx: 1 }}
            >
              Add Images
            </Button> */}
            <Box sx={{display:'flex',mt:5, justifyContent:'space-around',alignItems:'center'}}>
                <Iconify icon="simple-line-icons:calender" sx={{ mr:1,  color:'red'}}></Iconify>
                <Typography sx={{mr:1.5, color:'red'}}>{date}</Typography>  

                <Typography  onClick={() => setAddImagesModalOpened(true)} sx={{ bgcolor: 'transparent', color: 'rgba(48,63,191,255)', fontSize:'1.2rem', mr:1,
                          cursor: 'pointer', alignItems:'flex-start' }}>
                  {'+ Add More'}
                </Typography>
          
                <Tooltip title="Filter list">
                  <IconButton sx={{p:0}}>
                    <Iconify icon={'material-symbols:filter-alt'} 
                      aria-label="more"
                      id="long-filter"
                      aria-controls={open ? 'long-menu-filter' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleFilterMenuClicked}
                    width='2rem' height='2rem' style={{ color: 'rgba(48,63,191,255)' }} />
                  </IconButton>
                </Tooltip>    
                <IconButton>
                  <Iconify icon="carbon:overflow-menu-vertical"
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleMenuClicked}
                    width="1.5em" height="1.5em" color="#303fbf">
                  </Iconify>
                </IconButton>
            </Box>
          {!showFilterMenu && <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch',
              },
            }}
          >
            {options.map((option, index: number) => (
              <MenuItem key={option.title}
                onMouseEnter={(e) => handleMouseOver(e, index)} onMouseOut={(e) => handleMouseOut(e, index)}
                style={{ color: option.title === 'Delete' ? 'red' : 'black', backgroundColor: 'transparent' }}
                onClick={(e) => { handleMenuItemClick(e, index, option) }}>
                <Iconify icon={option.icon} style={{ marginRight: "7px" }} width="1em" height="1em"></Iconify> {option.title}
              </MenuItem>
            ))}
          </Menu>}
          {showFilterMenu && <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-filter',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch',
              },
            }}
          >
            {filterArray.map((option, index: number) => (
              <MenuItem key={option}
                onMouseEnter={(e) => handleMouseOver(e, index)} onMouseOut={(e) => handleMouseOut(e, index)}
                style={{ color:'black', backgroundColor: 'transparent' }}
                onClick={(e) => { handleMenuItemClick(e, index, option) }}>
                {option}
              </MenuItem>
            ))}
          </Menu>}
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

      <AddImagesDialog
        open={addImagesModalOpened}
        onClose={() => setAddImagesModalOpened(false)}
        onFinishAddingImages={addingImagesHandler}
        projectId={projectId}
        projectType={project?.type}
      />
      <ShowUserlistDialog 
        open={viewQAsModalOpened}
        onClose={() => setviewQAsModalOpened(false)}
        project={project}
        Users={QAs}
        setProject={setProject}
        typeofUser="QAs"
      />
      <ShowUserlistDialog
        open={viewAnnotatorsModalOpened}
        onClose={() => setviewAnnotatorsModalOpened(false)}
        project={project}
        Users={annotators}
        setProject={setProject}
        typeofUser="Annotators"
      />

      <ClassesAccordion project={project} loading={getProjectLoading} setClassAddOpen={setClassAddOpen} />

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
