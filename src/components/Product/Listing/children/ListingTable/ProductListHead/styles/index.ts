import { TableHead } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TableHeadStyle = styled(TableHead)(({ theme }) => ({
  borderTop: '1px solid #A9CEFF',
  borderBottom: '1px solid #A9CEFF',
  height: '52px',
  th: {
    background: 'inherit',
  },
  '.hide-sort-icon .MuiTableSortLabel-icon': {
    display: 'none',
  },
  '.visuallyHidden': {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
}));
