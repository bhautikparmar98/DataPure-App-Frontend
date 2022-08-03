// @mui
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Typography, Stack, StackProps } from '@mui/material';
// utils
import { fShortenNumber } from 'src/utils/formatNumber';
// components
import Image from 'src/components/Shared/Image';
import Iconify from 'src/components/Shared/Iconify';
import Scrollbar from 'src/components/Shared/Scrollbar';

// _mock_
const _appInstalled = ['de', 'en', 'fr', 'kr', 'us'].map((country, index) => ({
  id: index,
  name: ['Germany', 'England', 'France', 'Korean', 'USA'][index],
  android: 1,
  windows: 2,
  apple: 2,
  flag: `https://minimal-assets-api.vercel.app/assets/icons/ic_flag_${country}.svg`,
}));

// ----------------------------------------------------------------------

const ItemBlockStyle = styled((props: StackProps) => (
  <Stack direction="row" alignItems="center" {...props} />
))({
  minWidth: 72,
  flex: '1 1',
});

const ItemIconStyle = styled(Iconify)(({ theme }) => ({
  width: 16,
  height: 16,
  marginRight: theme.spacing(0.5),
  color: theme.palette.text.disabled,
}));

// ----------------------------------------------------------------------

export default function AppTopInstalledCountries() {
  return (
    <Card>
      <CardHeader title="Top Installed Countries" />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {_appInstalled.map((country) => (
            <CountryItem key={country.id} country={country} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CountryItemProps = {
  id: string;
  name: string;
  android: number;
  windows: number;
  apple: number;
  flag: string;
};

function CountryItem({ country }: { country: CountryItemProps }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <ItemBlockStyle sx={{ minWidth: 120 }}>
        <Image
          disabledEffect
          alt={country.name}
          src={country.flag}
          sx={{ width: 28, mr: 1 }}
        />
        <Typography variant="subtitle2">{country.name}</Typography>
      </ItemBlockStyle>
      <ItemBlockStyle>
        <ItemIconStyle icon={'ant-design:android-filled'} />
        <Typography variant="body2">
          {fShortenNumber(country.android)}
        </Typography>
      </ItemBlockStyle>
      <ItemBlockStyle>
        <ItemIconStyle icon={'ant-design:windows-filled'} />
        <Typography variant="body2">
          {fShortenNumber(country.windows)}
        </Typography>
      </ItemBlockStyle>
      <ItemBlockStyle sx={{ minWidth: 88 }}>
        <ItemIconStyle icon={'ant-design:apple-filled'} />
        <Typography variant="body2">
          {fShortenNumber(country.windows)}
        </Typography>
      </ItemBlockStyle>
    </Stack>
  );
}

