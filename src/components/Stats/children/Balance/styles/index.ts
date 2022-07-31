import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const BalanceStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(0, 0, 2, 0),
  background: 'transparent',
  boxShadow: 'none',
  borderRadius: 'none',
  '.balance-card': {
    borderRadius: theme.spacing(3),
    overflow: 'visible',
    background: 'transparent',
  },
  '& .icon': {
    color: theme.palette.secondary.main,
    fontSize: 14,
    position: 'relative',
    bottom: -2,
  },
  '& .MuiCardHeader-root': {
    padding: 0,
    paddingLeft: theme.spacing(1.5),
    '& .MuiCardHeader-title': {
      padding: 0,
      fontSize: '1rem',
      position: 'relative',
      bottom: -7,
    },
  },
  '& .MuiPaper-root': {
    boxShadow: 'none',
  },
  '.total-amount-container': {
    textAlign: 'right',
  },
  '.total-amount-icon': {
    top: -1,
  },
  '.total-amount': {
    display: 'inline-block',
    paddingLeft: theme.spacing(1.5),
  },
  '.balance-content': {
    background: '#fff',
    boxShadow:
      '0px 0px 33px rgba(0, 0, 0, 0.03), 0px 0px 7px rgba(0, 0, 0, 0.02), 0px 0px 2.2px rgba(0, 0, 0, 0.01)',
    borderRadius: theme.spacing(3),
    '.balance-container': {
      padding: theme.spacing(2, 0, 0.5, 3),
      marginTop: theme.spacing(2),
    },
    p: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
    },
    '.amount-wrapper': {
      paddingTop: 0,
      paddingBottom: 0,
      //divider
      '&:not(:last-of-type) .amount:after': {
        content: '" "',
        position: 'absolute',
        display: 'inline-block',
        width: `calc(100% + ${theme.spacing(4)})`,
        height: '1px',
        background: '#F0F6FF',
        left: theme.spacing(-4),
        right: -30,
        bottom: 5,
      },
    },
    '.amount': {
      color: theme.palette.primary.light,
      fontSize: '1rem',
      fontWeight: 600,
      paddingBottom: theme.spacing(1.75),
      position: 'relative',
    },
  },
}));

export { BalanceStyle };
