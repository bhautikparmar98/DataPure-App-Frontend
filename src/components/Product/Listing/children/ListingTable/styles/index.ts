import { TableContainer, TableBody } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TableContainerStyle = styled(TableContainer)(({ theme }) => ({
  minWidth: 800,
}));

export const TableBodyStyle = styled(TableBody)(({ theme }) => ({
  '.img-wrapper': {
    whiteSpace: 'nowrap',
  },
  '.img': {
    display: 'inline-block',
    borderRadius: '50%',
    width: 24,
    height: 24,
    marginRight: '10px',
  },
  '.name': {
    display: 'inline-block',
    verticalAlign: 'middle',
  },
}));
