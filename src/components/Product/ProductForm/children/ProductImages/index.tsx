//React
import { useState, useCallback } from 'react';
//hooks
import useResponsive from 'src/hooks/useResponsive';
// @mui
import { Box, Card, Container, Typography, CardHeader, Grid, Badge } from '@mui/material';
//components
import Image from 'src/components/Shared/Image';
import BlockVariant from '../BlockVariant';
import { UploadMultiFile } from 'src/components/Shared/upload';
import Iconify from 'src/components/Shared/Iconify';

// ----------------------------------------------------------------------
const ProductImages: React.FC<any> = ({ productImagesList }) => {
  const isDesktop = useResponsive('up', 'lg');

  const [preview, setPreview] = useState(true);

  const [files, setFiles] = useState<(File | string)[]>([]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };

  return (
    <Grid container>
      <Grid xs={12}>
        <BlockVariant key={'h5'} font={{ variant: 'h5', label: 'Product Images' }} />
      </Grid>
      <Grid xs={12}>
        <UploadMultiFile
          showPreview={preview}
          files={files}
          accept="image/*"
          maxSize={3145728}
          onDrop={handleDropMultiFile}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          blockContent={{
            icon: 'carbon:add',
            textUpload: 'Add new product image',
            textHint: 'Drop images here or click',
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ProductImages;
