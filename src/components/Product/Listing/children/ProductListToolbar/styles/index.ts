import { Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
  '.search-input': {
    background: theme.palette.primary.lighter,
    border: 'none',
    borderRadius: Number(theme.shape.borderRadius) * 3.75,
    fieldset: {
      border: 'none',
    },
  },

  '.search-icon': {
    color: 'text.disabled',
    width: 20,
    height: 20,
  },
  '.btns': {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 90,

    '.btn': {
      '&.disabled': {
        background: theme.palette.action.disabledBackground,
        color: '#fff',
      },
      '&:first-of-type': {
        marginRight: 40,
      },
    },
    '&.template-btns': {
      marginRight: 0,
    },
  },
  '.new-template': {
    borderWidth: '2px',
    marginLeft: '24px',
  },
  '.submitted-btn': {
    padding: '5px 10px',
    color: theme.palette.text.secondary,
  }, //responsive for table and mobile screens
  '&.small-screen': {
    flexDirection: 'column',
    padding: '20px',
    height: 'auto',
    '.search-input': {
      marginBottom: '10px',
    },
    '.btns': {
      margin: 'auto',
      '&.template-btns .btn': {
        marginRight: 10,
        marginLeft: 10,
      },
    },
    '.new-template': {
      marginRight: 10,
      marginLeft: 10,
    },
  },
}));
