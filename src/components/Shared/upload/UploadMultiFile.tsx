import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// type
import { UploadMultiFileProps } from './type';
//
import BlockContent from './BlockContent';
import RejectionFiles from './RejectionFiles';
import MultiFilePreview from './MultiFilePreview';
import UploadingProgress from './UploadingProgress';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3, 1),
  backgroundColor: theme.palette.background.neutral,
  border: `3px dashed #688BB1`,
  filter: `drop-shadow(0px 0px 33px rgba(0, 0, 0, 0.03)) drop-shadow(0px 0px 7.37098px rgba(0, 0, 0, 0.0178832)) drop-shadow(0px 0px 2.19453px rgba(0, 0, 0, 0.0121168));`,
  borderRadius: `10px`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ----------------------------------------------------------------------

export default function UploadMultiFile({
  error,
  showPreview = false,
  files,
  onRemove,
  onRemoveAll,
  helperText,
  sx,
  blockContent,
  minHeight,
  uploading,
  label,
  progress,
  buffer,
  ...other
}: UploadMultiFileProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    ...other,
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
        }}
      >
        <input {...getInputProps()} />

        <input {...getInputProps()} />

        <BlockContent minHeight={minHeight} label={label} />
      </DropZoneStyle>

      {uploading && (
        <UploadingProgress
          buffer={buffer ? buffer : progress! + 5}
          progress={progress || 0}
        />
      )}

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      {/* <MultiFilePreview
        files={files}
        showPreview={showPreview}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
      /> */}

      {helperText && helperText}
    </Box>
  );
}
