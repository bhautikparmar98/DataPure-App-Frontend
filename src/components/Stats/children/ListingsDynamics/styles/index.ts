import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const CardStyle = styled(Card)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  '& .MuiCardHeader-root': {
    padding: 0,
    paddingLeft: theme.spacing(1.5),
    '& .MuiCardHeader-title': {
      fontSize: '1rem',
    },
  },
  '& .toggle-graph-btn': {
    background: 'transparent',
  },
  '& .icon': {
    color: theme.palette.secondary.main,
    fontSize: 14,
  },
}));

const ChartStyle = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(1.5),

  boxShadow:
    '0px 0px 33px rgba(0, 0, 0, 0.03), 0px 0px 7px rgba(0, 0, 0, 0.02), 0px 0px 2.2px rgba(0, 0, 0, 0.01)',
  borderRadius: theme.spacing(3),
  '& .tabs': {
    position: 'absolute',
    right: 40,
    button: {
      margin: 0,
      zIndex: 5,
    },
    '.tab': {
      padding: '2px 10px 2px 11px',
      minWidth: 31,
      minHeight: 21,
      fontWeight: 400,
      '&.Mui-selected': {
        background: theme.palette.grey[600],
        color: '#fff',
        borderRadius: 13,
      },
    },
  },
  '.apexcharts-legend': {
    display: 'flex',
    flexDirection: 'row !important',
    alignItems: 'self-start',
    top: '0px !important',
    left: '20px !important',
  },
  '.apexcharts-tooltip': {
    color: '#fff',
  },
  '&.small-screen': {
    '.tabs': {
      right: 'auto',
    },
    '.apexcharts-legend-series': {
      marginLeft: '2px !important',
    },
    '.apexcharts-legend': {
      top: '40px !important',
      left: '0px !important',
    },
  },
}));

export { CardStyle, ChartStyle };
