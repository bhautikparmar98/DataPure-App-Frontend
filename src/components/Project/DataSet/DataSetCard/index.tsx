// next
// @mui
import { Box, Card, Checkbox, Stack, Typography } from '@mui/material';
// routes
// @types
// components
import Image from 'src/components/Shared/Image';
import Label from 'src/components/Shared/Label';
import { IMAGE_STATUS } from 'src/constants/ImageStatus';
import { fDate } from 'src/utils/formatTime';
import { IImage } from '../types';

// ----------------------------------------------------------------------

type DataSetCardProps = {
  image: IImage;
  index: number;
  totalLength: number;
  isChecked: (id: string) => boolean;
  onSelectCard: (id: string) => void;
};

export const DataSetCard: React.FC<DataSetCardProps> = ({
  image,
  index,
  totalLength,
  isChecked,
  onSelectCard,
}) => {
  const { fileName, src, status, _id } = image;

  const validStatusToDelete = () =>
    status === IMAGE_STATUS.PENDING_ANNOTATION.value;

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        {_id && validStatusToDelete() && (
          <Checkbox
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              backgroundColor: 'white',
              p:0,
              color:'blue',
              height:'1.1rem',
              width:'18px',
              '&:hover':{
                backgroundColor: 'white',
              }
            }}
            checked={isChecked(_id)}
            onClick={() => onSelectCard(_id)}
          />
        )}
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
              maxWidth: 200,
              textTransform: 'uppercase',
            }}
          >
            {IMAGE_STATUS[status as keyof typeof IMAGE_STATUS].label}
          </Label>
        )}
        <Image alt={fileName} src={src} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 1, px: 2 , color: '#015dd3'}}>
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
              sx={{ color: '#505050' }}
            >
              {fDate(image.createdAt)}
            </Typography>
          </Stack>

          <Stack>
            <Typography
              component="span"
              fontSize={12}
              sx={{ color: '#505050' }}
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
