import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TabsStyle = styled(Card)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  height: 'auto',
  marginBottom: '28px',
  borderBottom: '1px solid #E8F2FF',
  borderRadius: 0,
  '& > div > div': {
    padding: 0,
    minHeight: 'auto',
  },
  '.tabs-wrapper': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    p: 0,
  },
  '.Mui-selected': {
    fontSize: '16px',
  },
  '& :not(.Mui-selected)': {
    fontSize: '16px',
    color: '#000',
    fontWeight: 400,
  }, //responsive for table and mobile screens
  '&.small-screen': {
    paddingRight: '20px',
    paddingLeft: '20px',
  },
}));
