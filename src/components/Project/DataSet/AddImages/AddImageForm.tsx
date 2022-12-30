import { useCallback, useMemo, useState } from 'react';

// form

// @mui
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFUploadMultiFile } from 'src/components/Shared/hook-form';
import { UploadMultiFile } from 'src/components/Shared/upload';
import { TOOLS } from 'src/constants';
import { IMAGE_DATA_TYPE } from 'src/constants/dataType';
import { IMAGE_STATUS } from 'src/constants/ImageStatus';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';
import { IProject } from '../../List/types/project';
import { IImage } from '../types';
import useJSONDrop from './useJSONDrop';

// ----------------------------------------------------------------------

interface ClassFormProps {
  onSubmit: (data: IImage[]) => void;
  onClose: () => void;
  projectId: string | string[];
  projectType: string | undefined;
}
interface FormValuesProps extends Partial<IProject> {
  images: string[];
  dataType?: string;
  reviewStatus?: string;
  annotationFile?: string;
}

const MAX_SIZE = 50_000_000; //50 MB

const ClassForm: React.FC<ClassFormProps> = ({ onSubmit, projectId, projectType, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);

  const { jsonData, handleJSONDrop, handleRemoveAllJSON, handleRemoveJSON } = useJSONDrop({
    onLoadingChange,
    onAnnotationFileChange,
  });

  function onLoadingChange(isLoading: boolean) {
    setLoading(isLoading);
  }
  function onAnnotationFileChange(newValue: any) {
    setValue('annotationFile', newValue);
  }

  const NewProjectSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    // dueAt: Yup.date().required('Due Date is required'),
    // type: Yup.string().required('Type is required'),
    images: Yup.array().min(1, 'Images is required'),
    statusType: Yup.string().optional(),
    dataType: Yup.string().optional(),
    annotationFile: Yup.array().optional(),
  });

  const defaultValues = useMemo(
    () => {
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

  const uploadHandler = async (urls: { url: string; presignedURL: string }[], files: any) => {
    setUploading(true);

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

  const submitHandler = async () => {
    setLoading(true);
    try {
      const imageList = images.map((i) => i.name);

      const signResponse = await axiosInstance.post('/image/sign', {
        files: imageList,
      });
      const { files } = signResponse.data;

      await uploadHandler(files, images);

      const imgAnnoMap: any = {};

      if (jsonData && jsonData.annotations && images) {
        const imgIdMap: any = {};
        const imagesWithNoData: any[] = [];
        let annotationsWithNoImages = 0;

        let imagesHaveAnnotations = false;
        images.forEach((img) => {
          const jsonImg = jsonData.images.filter((i: { file_name: string }) => i.file_name === img.name);

          if (jsonImg.length > 0) {
            // get annotations for that image and convert it to our system
            const imgAnnotations = jsonData.annotations
              .filter((a: any) => a.image_id === jsonImg[0].id)
              .map((anno: any) => ({
                x: anno.bbox[0],
                y: anno.bbox[1],
                width: anno.bbox[2],
                height: anno.bbox[3],
                id: anno.id,
                type: TOOLS.RECTANGLE,
                attributes: anno.attributes,
                classId: anno.category_id,
              }));

            imagesHaveAnnotations = imgAnnotations.length > 0;

            imgIdMap[jsonImg[0].id] = {
              uploadedImage: img,
              jsonImg: jsonImg[0],
              annotations: imgAnnotations,
              count: 0,
            };
          } else imagesWithNoData.push(img);
        });

        if (!imagesHaveAnnotations) {
          onClose();
          enqueueSnackbar(
            'The JSON file have no annotations for these images. Please, make sure to add a valid JSON file.',
            { variant: 'warning' }
          );

          return;
        }

        const newRows = Object.values(imgIdMap).map((i: any) => ({
          name: i.uploadedImage.name,
          image: i.uploadedImage,
          annotations: i.annotations,
          exist: true,
        }));

        jsonData.annotations.forEach((anno: any) => {
          if (!imgIdMap[anno.image_id]) annotationsWithNoImages++;
        });

        newRows.push(
          ...imagesWithNoData.map((k) => ({
            name: k.name,
            image: k.uploadedImage,
            // new images does not have pre-annotations
            annotations: [],
            exist: false,
          }))
        );

        newRows.forEach((element) => {
          imgAnnoMap[element.name] = element.annotations;
        });
      }

      // TODO: imgStatus should be driven by an input
      const response = await axiosInstance.post(`/project/${projectId}/images`, {
        images: files.map((f: any) => ({
          url: f.url,
          fileName: f.fileName,
          annotations: imgAnnoMap[f.fileName] || [],
        })),
        imgsStatus:
          jsonData && jsonData.annotations
            ? IMAGE_STATUS.PENDING_CLIENT_REVIEW.value
            : IMAGE_STATUS.PENDING_ANNOTATION.value,
      });

      const { imagesIds } = response.data;

      const results: IImage[] = imagesIds.map((i: any, index: number) => ({
        _id: i._id,
        src: files[index].url,
        fileName: files[index].fileName,
        createdAt: new Date(),
        status:
          jsonData && jsonData.annotations
            ? IMAGE_STATUS.PENDING_CLIENT_REVIEW.value
            : IMAGE_STATUS.PENDING_ANNOTATION.value,
      }));

      await onSubmit(results);
    } catch (error) {
      console.log('error ', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
    setLoading(false);
  };

  const handleDrop = useCallback(
    (acceptedFiles: any[]) => {
      setImages(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setImages]
  );

  const handleRemoveAll = () => {
    setImages([]);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = images?.filter((_file) => _file !== file);
    setImages(filteredItems);
  };

  return (
    <FormProvider methods={methods}>
      <Stack color="text.secondary" sx={{ mt: 2, display: 'flex' }}>
        <Box display="flex" gap="4px" sx={{p:0, minHeight:'auto'}}>
          <UploadMultiFile
            accept="image/*"
            files={images}
            minHeight={400}
            showPreview={false}
            maxSize={MAX_SIZE}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onRemoveAll={handleRemoveAll}
            uploading={uploading}
            progress={progress}
            buffer={progress + 5}
            label="Drop or Select Images files"
          />
          {projectType === IMAGE_DATA_TYPE.PRE_ANNOTATED_DATA.value ? (
            <RHFUploadMultiFile
              name="annotationFile"
              accept="application/json"
              minHeight={400}
              maxSize={31045728555}
              label="Drop or Select JSON files"
              onDrop={handleJSONDrop}
              onRemove={handleRemoveJSON}
              onRemoveAll={handleRemoveAllJSON}
              showPreview={false}
            />
          ) : null}
        </Box>
        {images.length !== 0 && <Typography variant="subtitle2">You have uploaded {images.length} images</Typography>}
      </Stack>

      <Box sx={{ mt: 4, display:'flex', justifyContent:'flex-end' }}>
        <Button sx={{backgroundColor:'white', border:'1px solid blue', color:'blue'}}
                        onClick={onClose}
                        variant="outlined">
                      Cancel
        </Button>
        <LoadingButton
          sx={{align:'right',ml:1}}
          type="submit"
          variant="contained"
          disabled={
            images.length === 0 ||
            loading ||
            (projectType === IMAGE_DATA_TYPE.PRE_ANNOTATED_DATA.value && jsonData.length === 0)
          }
          onClick={submitHandler}>
          Confirm
        </LoadingButton>
      </Box>
    </FormProvider>
  );
};

export default ClassForm;
