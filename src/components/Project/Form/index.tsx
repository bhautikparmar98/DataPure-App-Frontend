import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadMultiFile,
  RHFUploadSingleFile,
} from 'src/components/Shared/hook-form';
import RHFDatePicker from 'src/components/Shared/hook-form/RHFDatePicker';
import Iconify from 'src/components/Shared/Iconify';
import { ANNOTATION_TYPES } from 'src/constants';
import { AnnotationTypeKey } from 'src/constants/annotationTypes';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
import axiosInstance from 'src/utils/axios';
import { IProject, IProjectClass } from '../List/types/project';
import AddClassDialog from './AddClass';
import ClassItem from './ClassItem';
import { IMAGE_DATA_TYPE } from 'src/constants/dataType';
import { IMAGE_STATUS } from 'src/constants/ImageStatus';
import { parseJsonFile } from 'src/utils/parseJsonFile';
import { availableColors } from 'src/constants/availableColors';
import ImagesStatus from './ImagesStatus';
//Utils
import uniqid from 'uniqid';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

interface FormValuesProps extends Partial<IProject> {
  images: string[];
  dataType?: string;
  reviewStatus?: string;
  annotationFile?: string;
}

interface ProjectFormComponentProps {
  isEdit?: boolean;
}

const ProjectFormComponent: React.FC<ProjectFormComponentProps> = ({
  isEdit,
}) => {
  const { themeStretch } = useSettings();
  const { push } = useRouter();
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [classes, setClasses] = useState<IProjectClass[]>([]);
  const [addNewClassOpened, setAddNewClassOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isImageStatusModalOpened, setIsImageStatusModalOpened] =
    useState(false);
  const [jsonData, setJsonData] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    dueAt: Yup.date().required('Due Date is required'),
    type: Yup.string().required('Type is required'),
    images: Yup.array().min(1, 'Images is required'),
    // statusType: Yup.string().optional(),
    // dataType: Yup.string().optional(),
    // annotationFile: Yup.array().optional(),
  });

  const defaultValues = useMemo(
    () => {
      setClasses(currentProject?.classes || []);

      return {
        name: currentProject?.name || '',
        type: currentProject?.type || '',
        images: [],
        dueAt: currentProject?.dueAt || null,
        statusType: '',
        dataType: '',
        annotationFile: [],
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProject]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProjectSchema),
    defaultValues: defaultValues as any,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,

    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProject) {
      reset(defaultValues as any);
    }
    if (!isEdit) {
      reset(defaultValues as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProject]);

  const uploadHandler = async (
    urls: { url: string; presignedURL: string }[],
    files: any
  ) => {
    setUploading(true);

    // [[] , [] , []]
    let index = 0;
    const chunks: any[] = [];
    for (let i = 0; i < urls.length; i++) {
      if (!chunks[index]) chunks[index] = [];
      chunks[index].push(axiosInstance.put(urls[i].presignedURL, files[i]));

      if (chunks[index].length >= 5) index++;
    }

    let requests = 0;
    for (let i = 0; i < chunks.length; i++) {
      const promise = chunks[i];
      await Promise.all(promise);

      requests += promise.length;

      setProgress(Math.round((requests / urls.length) * 100));
    }

    setUploading(false);
  };

  const onSubmitPreAnnotatedConfirmed = async (rows: any[]) => {
    setLoading(true);
    setIsImageStatusModalOpened(false);

    try {
      const imageList = values.images.map((i: any) => i.name);

      const response = await axiosInstance.post('/image/sign', {
        files: imageList,
      });

      const { files } = response.data;

      await uploadHandler(files, values.images);

      const imgAnnoMap: any = {};
      rows.forEach((element) => {
        imgAnnoMap[element.name] = element.annotations;
      });

      await axiosInstance.post('/project/preAnnotated', {
        name: values.name,
        dueAt: values.dueAt,
        type: values.type,
        images: files.map((f: any) => ({
          url: f.url,
          fileName: f.fileName,
          annotations: imgAnnoMap[f.fileName],
        })),
        annotationType: values.reviewStatus,
        classes,
      });

      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      push(PATH_DASHBOARD.project.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong.', { variant: 'error' });
    }
    setLoading(false);
  };

  const onSubmitPreAnnotated = async (data: FormValuesProps) => {
    setIsImageStatusModalOpened(true);
  };

  const onSubmit = async (data: FormValuesProps) => {
    setLoading(true);

    try {
      const imageList = data.images.map((i: any) => i.name);

      const response = await axiosInstance.post('/image/sign', {
        files: imageList,
      });
      const { files } = response.data;

      await uploadHandler(files, data.images);

      const classesWithIds = classes.map((c) => ({ ...c, id: uniqid() }));

      await axiosInstance.post('/project', {
        name: data.name,
        dueAt: data.dueAt,
        type: data.type,
        images: files.map((f: any) => ({ url: f.url, fileName: f.fileName })),
        classes: classesWithIds,
      });

      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      push(PATH_DASHBOARD.project.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong.', { variant: 'error' });
    }
    setLoading(false);
  };

  const handleDrop = useCallback(
    (acceptedFiles: any[]) => {
      setValue(
        'images',
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleSingleDrop = useCallback(
    async (acceptedFiles: any) => {
      const file = acceptedFiles[0];

      const data = await parseJsonFile(file);

      if (!data.categories) {
        return enqueueSnackbar('Invalid file structure', { variant: 'error' });
      }

      if (!data.annotations)
        return enqueueSnackbar('There is no annotations in this file', {
          variant: 'error',
        });

      const newClasses = data.categories.map((cat: any, index: number) => ({
        id: cat.id,
        name: cat.name,
        color: availableColors[index % availableColors.length],
      }));

      setClasses(newClasses);
      setJsonData(data);

      if (file) {
        setValue(
          'annotationFile',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  const deleteImageHandler = (row: any) => {
    const filteredItems = values.images?.filter(
      (img: any) => img.name !== row.name
    );
    setValue('images', filteredItems);
  };

  const addClassHandler = () => {
    setAddNewClassOpened(true);
  };

  const finishAddingClassHandler = (data: { name: string; color: string }) => {
    setClasses((prev) => [...prev, data]);
  };

  const deleteClassHandler = (index: number) => {
    setClasses((prev) => prev.filter((c, i) => i !== index));
  };

  // on fly calc ---------------------------------------
  const isImageAnnotationSelected =
    values.type === ANNOTATION_TYPES.IMAGE_ANNOTATION.value;
  const gridMDValueForAnnotationSelect = isImageAnnotationSelected ? 3 : 4;
  const isReviewStatusShown =
    values.dataType === IMAGE_DATA_TYPE.PRE_ANNOTATED_DATA.value &&
    isImageAnnotationSelected;
  const gridXsValueForUploader = isReviewStatusShown ? 6 : 12;

  const isFormInvalid = () => {
    if (
      classes.length === 0 ||
      loading ||
      values.name === '' ||
      values.type === '' ||
      values.dueAt === null ||
      values.images.length === 0
    )
      return true;

    // selected image annotation and data type not selected should return true;
    if (isImageAnnotationSelected && values.dataType === '') return true;

    // if data type is pre-annotated and there is no review status should return true;
    if (isReviewStatusShown && !values.reviewStatus) return true;

    // if data type is pre-annotated and there is no json file uploaded return true;
    if (isReviewStatusShown && !values.annotationFile) return true;

    return false;
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <FormProvider
        methods={methods}
        onSubmit={
          isReviewStatusShown
            ? handleSubmit(onSubmitPreAnnotated)
            : handleSubmit(onSubmit)
        }
      >
        <ImagesStatus
          onDelete={deleteImageHandler}
          open={isImageStatusModalOpened}
          jsonData={jsonData}
          images={values.images}
          onApprove={onSubmitPreAnnotatedConfirmed}
          classes={classes}
          onClose={() => setIsImageStatusModalOpened(false)}
          loading={loading}
        />

        <Grid container spacing={3}>
          <AddClassDialog
            onFinishAddingClass={finishAddingClassHandler}
            onClose={() => setAddNewClassOpened(false)}
            open={addNewClassOpened}
          />
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <CardHeader title="Upload Files" />
              <CardContent>
                <Stack spacing={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={gridMDValueForAnnotationSelect}>
                      <RHFTextField name="name" label="Project Title" />
                    </Grid>
                    <Grid item xs={12} md={gridMDValueForAnnotationSelect}>
                      <RHFSelect name="type" label="Project Type">
                        {Object.keys(ANNOTATION_TYPES).map((key) => (
                          <MenuItem
                            key={key}
                            value={
                              ANNOTATION_TYPES[key as AnnotationTypeKey]?.value
                            }
                          >
                            {ANNOTATION_TYPES[key as AnnotationTypeKey]?.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </Grid>
                    {isImageAnnotationSelected && (
                      <Grid item xs={12} md={gridMDValueForAnnotationSelect}>
                        <RHFSelect name="dataType" label="Data Type">
                          {Object.keys(IMAGE_DATA_TYPE).map((key) => (
                            <MenuItem
                              key={key}
                              value={
                                IMAGE_DATA_TYPE[
                                  key as keyof typeof IMAGE_DATA_TYPE
                                ]?.value
                              }
                            >
                              {
                                IMAGE_DATA_TYPE[
                                  key as keyof typeof IMAGE_DATA_TYPE
                                ]?.label
                              }
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </Grid>
                    )}
                    <Grid item xs={12} md={gridMDValueForAnnotationSelect}>
                      <RHFDatePicker name="dueAt" label="Due Date" />
                    </Grid>
                  </Grid>
                </Stack>

                <Stack mt={4}>
                  <Grid container spacing={2}>
                    <Grid item md={8} xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={gridXsValueForUploader}>
                          <div>
                            <RHFUploadMultiFile
                              name="images"
                              showPreview={false}
                              accept="image/*"
                              minHeight={400}
                              maxSize={31045728555}
                              onDrop={handleDrop}
                              onRemove={handleRemove}
                              onRemoveAll={handleRemoveAll}
                              uploading={uploading}
                              label="Drop or Select Images file"
                              progress={progress}
                              buffer={progress + 5}
                            />
                          </div>
                        </Grid>
                        {isReviewStatusShown && (
                          <Grid item xs={gridXsValueForUploader}>
                            <div>
                              <RHFUploadSingleFile
                                name="annotationFile"
                                accept="application/json"
                                minHeight={400}
                                maxSize={31045728555}
                                label="Drop or Select JSON file"
                                onDrop={handleSingleDrop}
                              />
                            </div>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                    <Grid item md={4} xs={12} style={{ display: 'flex' }}>
                      <Box display="flex" flexDirection="column" flex={1}>
                        {isReviewStatusShown && (
                          <Box mb={3}>
                            <RHFSelect
                              name="reviewStatus"
                              label="Review Status"
                            >
                              {[
                                IMAGE_STATUS.PENDING_ANNOTATION.value,
                                IMAGE_STATUS.PENDING_CLIENT_REVIEW.value,
                              ].map((key) => (
                                <MenuItem
                                  key={key}
                                  value={
                                    IMAGE_STATUS[
                                      key as keyof typeof IMAGE_STATUS
                                    ]?.value
                                  }
                                >
                                  {
                                    IMAGE_STATUS[
                                      key as keyof typeof IMAGE_STATUS
                                    ]?.label
                                  }
                                </MenuItem>
                              ))}
                            </RHFSelect>
                          </Box>
                        )}
                        <Box mb={2}>
                          <Grid container>
                            <Grid item md={6} xs={12}>
                              <Typography variant="body1" fontWeight={700}>
                                Add Class
                              </Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <Box
                                flex={1}
                                display="flex"
                                justifyContent="flex-end"
                              >
                                <Button
                                  variant="contained"
                                  startIcon={<Iconify icon={'eva:plus-fill'} />}
                                  onClick={addClassHandler}
                                  fullWidth={false}
                                >
                                  Add Class
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="space-between"
                          flex={1}
                          position="relative"
                          style={{ overflowY: 'auto', overflowX: 'hidden' }}
                        >
                          <Box
                            minHeight="min-content"
                            display="flex"
                            flexDirection="column"
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                          >
                            {classes.map((c, index) => (
                              <Box
                                key={c.name + index}
                                sx={{ marginBottom: 1 }}
                              >
                                <ClassItem
                                  item={c}
                                  onDelete={() => deleteClassHandler(index)}
                                />
                              </Box>
                            ))}
                          </Box>
                        </Box>
                        <Box>
                          <LoadingButton
                            // sx={{ boxShadow: 'none' }}
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isFormInvalid()}
                            loading={isSubmitting || loading}
                          >
                            Save & Preview
                          </LoadingButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
};

export default ProjectFormComponent;
