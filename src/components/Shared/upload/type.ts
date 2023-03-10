import { ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';
// @mui
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string;
  preview?: string;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  file: CustomFile | string | null;
  helperText?: ReactNode;
  sx?: SxProps<Theme>;
  minHeight: number;
  label?: string;
}

export interface UploadMultiFileProps extends DropzoneOptions {
  error?: boolean;
  files: (File | string)[];
  showPreview: boolean;
  onRemove: (file: File | string) => void;
  onRemoveAll: VoidFunction;
  sx?: SxProps<Theme>;
  helperText?: ReactNode;
  minHeight?: number;
  blockContent?: { icon: string; textUpload: string; textHint: string };
  uploading?: boolean;
  progress?: number;
  buffer?: number;
  label?: string;
}
