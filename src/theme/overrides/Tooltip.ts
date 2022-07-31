import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Tooltip(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[600],
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          fontSize: theme.typography.pxToRem(12),
        },
        arrow: {
          color: theme.palette.grey[isLight ? 800 : 700],
        },
      },
    },
  };
}
