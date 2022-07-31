import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ContainerStyle = styled(Container)(({ theme }) => ({
  background: '#fff',
  paddingRight: 0,
  paddingLeft: 0,
  borderRadius: '25px',
  boxShadow:
    '0px 0px 33px rgba(0, 0, 0, 0.03), 0px 0px 7.37098px rgba(0, 0, 0, 0.0178832), 0px 0px 2.19453px rgba(0, 0, 0, 0.0121168);',
  //responsive for table and mobile screens
  '&.small-screen': {
    paddingRight: '20px',
    paddingLeft: '20px',
  },
}));
