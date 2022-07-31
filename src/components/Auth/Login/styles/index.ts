// @mui
import { styled } from '@mui/material/styles';

export const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  '& .MuiCardHeader-root': {
    paddingLeft: 0,
  },
}));

export const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  maxWidth: 700,
  display: 'flex',
  minHeight: '40vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6, 0),
}));

export const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  minHeight: 50,
  p: 0,
  pb: 3,
  bgColor: 'transparent',
} as const;
