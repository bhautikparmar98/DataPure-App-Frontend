import { useCallback, useState } from 'react';

// form

// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { UploadMultiFile } from 'src/components/Shared/upload';
import { IMAGE_STATUS } from 'src/constants/ImageStatus';
import axiosInstance from 'src/utils/axios';
import { IImage } from '../types';

// ----------------------------------------------------------------------

interface ClassFormProps {
  onSubmit: (data: IImage[]) => void;
  projectId: string;
}

const ClassForm: React.FC<ClassFormProps> = ({ onSubmit, projectId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const uploadHandler = async (
    urls: { url: string; presignedURL: string }[],
    files
  ) => {
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

      const response = await axiosInstance.post(
        `/project/${projectId}/images`,
        {
          images: files.map((f: any) => ({ url: f.url, fileName: f.fileName })),
        }
      );

      const { imagesIds } = response.data;

      const results: IImage[] = imagesIds.map((i, index) => ({
        _id: i._id,
        src: files[index].url,
        fileName: files[index].fileName,
        createdAt: new Date(),
        status: IMAGE_STATUS.ANNOTATION.value,
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
    <>
      <Stack color="text.secondary" sx={{ mt: 2 }}>
        <UploadMultiFile
          accept="image/*"
          files={images}
          minHeight={300}
          showPreview={false}
          maxSize={31045728}
          onDrop={handleDrop}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          uploading={uploading}
          progress={progress}
          buffer={progress + 5}
        />

        {images.length !== 0 && (
          <Typography variant="subtitle2">
            You have uploaded {images.length} images
          </Typography>
        )}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 6 }} spacing={2}>
        <LoadingButton
          type="submit"
          variant="contained"
          fullWidth
          disabled={images.length === 0 || loading}
          onClick={submitHandler}
        >
          Add
        </LoadingButton>
      </Stack>
    </>
  );
};

export default ClassForm;
