// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Rating,
  CardHeader,
  Typography,
  Stack,
} from '@mui/material';
// utils
import { fCurrency, fShortenNumber } from 'src/utils/formatNumber';
// components
import Label from 'src/components/Shared/Label';
import Image from 'src/components/Shared/Image';
import Iconify from 'src/components/Shared/Iconify';
import Scrollbar from 'src/components/Shared/Scrollbar';

// ----------------------------------------------------------------------

// _mock_
const _appRelated = ['Chrome', 'Drive', 'Dropbox', 'Evernote', 'Github'].map(
  (appName, index) => ({
    id: index,
    name: appName,
    system: (index === 2 && 'Windows') || (index === 4 && 'Windows') || 'Mac',
    price: index === 0 || index === 2 || index === 4 ? 0 : index,
    rating: 4,
    review: 10,
    shortcut: '',
  })
);

export default function AppTopRelated() {
  return (
    <Card>
      <CardHeader title="Top Related Applications" />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {_appRelated.map((app) => (
            <ApplicationItem key={app.id} app={app} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ApplicationItemProps = {
  name: string;
  system: string;
  price: number;
  rating: number;
  review: number;
  shortcut: string;
};

function ApplicationItem({ app }: { app: ApplicationItemProps }) {
  const theme = useTheme();
  const { shortcut, system, price, rating, review, name } = app;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.neutral',
        }}
      >
        <Image src={shortcut} alt={name} sx={{ width: 24, height: 24 }} />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
        <Typography variant="subtitle2">{name}</Typography>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ mt: 0.5, color: 'text.secondary' }}
        >
          <Iconify
            width={16}
            height={16}
            icon={
              system === 'Mac'
                ? 'ant-design:apple-filled'
                : 'ant-design:windows-filled'
            }
          />
          <Typography variant="caption" sx={{ ml: 0.5, mr: 1 }}>
            {system}
          </Typography>
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={price === 0 ? 'success' : 'error'}
          >
            {price === 0 ? 'Free' : fCurrency(price)}
          </Label>
        </Stack>
      </Box>

      <Stack alignItems="flex-end" sx={{ pr: 3 }}>
        <Rating
          readOnly
          size="small"
          precision={0.5}
          name="reviews"
          value={rating}
        />
        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
          {fShortenNumber(review)}&nbsp;reviews
        </Typography>
      </Stack>
    </Stack>
  );
}

