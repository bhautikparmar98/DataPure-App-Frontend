import { paramCase } from 'change-case';
// next
import NextLink from 'next/link';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// @types
import { Product } from '../../../../@types/product';
// components
import Label from 'src/components/Shared/Label';
import Image from 'src/components/Shared/Image';
import { ColorPreview } from 'src/components/Shared/color-utils';
import { IImage } from '../types';
import { IMAGE_STATUS } from 'src/constants/ImageStatus';
import { fDate, fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

type DataSetCardProps = {
  image: IImage;
  index: number;
  totalLength: number;
};

export const DataSetCard: React.FC<DataSetCardProps> = ({
  image,
  index,
  totalLength,
}) => {
  const { fileName, src, status } = image;

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={
              IMAGE_STATUS[status as keyof typeof IMAGE_STATUS].color as any
            }
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {IMAGE_STATUS[status as keyof typeof IMAGE_STATUS].label}
          </Label>
        )}
        <Image alt={fileName} src={src} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 1, px: 2 }}>
        <Typography variant="subtitle2" noWrap>
          {fileName}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={0.5}>
            <Typography
              component="span"
              fontSize={12}
              sx={{ color: 'text.disabled' }}
            >
              {fDate(image.createdAt)}
            </Typography>
          </Stack>

          <Stack>
            <Typography
              component="span"
              fontSize={12}
              sx={{ color: 'text.disabled' }}
            >
              {index + 1} / {totalLength}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default DataSetCard;

