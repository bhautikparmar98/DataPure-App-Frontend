import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Input(theme: Theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          //* this fontSize per the figma design spec but I doesn't feel well
          // fontSize: theme.typography.pxToRem(18),
          color: theme.palette.grey[600],
          // height: '40px',
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.disabled },
          },

          '& svg': {
            zIndex: 2,
          },
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&:not(.Mui-focused):not(.MuiFormLabel-filled)': {
            lineHeight: '12px',
          },
        },
      },
      asterisk: {
        color: 'red',
        '&$error': {
          color: 'red',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[500_12],

          '&:hover': {
            backgroundColor: theme.palette.grey[500_16],
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.focus,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[500_32],
            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.black,
            boxShadow: '0px 0px 4px 1px rgba(184, 184, 184, 0.15)',
            borderRadius: '5px',
          },
          '& .MuiOutlinedInput-input': {
            zIndex: 1,
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground,
            },
          },
        },
      },
    },
  };
}
