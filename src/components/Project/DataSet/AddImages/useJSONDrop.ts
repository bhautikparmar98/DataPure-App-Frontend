import { useSnackbar } from 'notistack';
import { useState } from 'react';
import mergeMultiAnnotations from 'src/utils/mergeMultipleAnnotations';
import { parseJsonFile } from 'src/utils/parseJsonFile';

interface Props {
  onLoadingChange: (loading: boolean) => void;
  onAnnotationFileChange: (newFile: any) => void;
}

const useJSONDrop = ({ onLoadingChange, onAnnotationFileChange }: Props) => {
  const [jsonData, setJsonData] = useState<any>([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleJSONDrop = async (acceptedFiles: any) => {
    let file = acceptedFiles[0];
    let data;
    if (acceptedFiles.length > 0) {
      onLoadingChange(true);
      data = await mergeMultiAnnotations(acceptedFiles);
      onLoadingChange(false);
    } else {
      file = acceptedFiles[0];
      data = await parseJsonFile(file);
    }

    if (!data.categories) {
      return enqueueSnackbar('Invalid JSON structure', { variant: 'error' });
    }

    if (!data.annotations)
      return enqueueSnackbar('There are no annotations in the JSON schema', {
        variant: 'error',
      });

    setJsonData(data);

    if (file) {
      onAnnotationFileChange(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }
  };

  const handleRemoveAllJSON = () => {
    onAnnotationFileChange([]);
  };
  const handleRemoveJSON = (file: File | string) => {
    onAnnotationFileChange([]);
  };
  return {
    jsonData,
    handleJSONDrop,
    handleRemoveAllJSON,
    handleRemoveJSON,
  };
};

export default useJSONDrop;
