import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const SalesStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  borderRadius: 'none',
  background: 'transparent',
  '& .icon': {
    color: theme.palette.secondary.main,
    fontSize: 14,
    position: 'relative',
    bottom: `calc(${theme.spacing(2)} - 7px) `,
  },

  '& .MuiCardHeader-title': {
    fontSize: '1rem',
    position: 'relative',
  },
  '.title': {
    padding: theme.spacing(0, 0, 2, 1.5),
  },
  '& .MuiPaper-root': {
    boxShadow: 'none',
  },
  '.sales-table': {
    'th:not(:nth-of-type(2)), td:not(:nth-of-type(2))': {
      textAlign: 'center ',
    },
    'th:first-of-type,td:first-of-type': {
      textAlign: 'right',
    },
  },
  '.sales-content': {
    background: '#fff',
    boxShadow:
      '0px 0px 33px rgba(0, 0, 0, 0.03), 0px 0px 7px rgba(0, 0, 0, 0.02), 0px 0px 2.2px rgba(0, 0, 0, 0.01)',
    borderRadius: theme.spacing(3),
    '.table-head th': {
      background: 'inherit',
      boxShadow: 'none',
    },
  },
}));

export { SalesStyle };
