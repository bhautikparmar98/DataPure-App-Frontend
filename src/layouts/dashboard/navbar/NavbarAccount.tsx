// @mui
import { Box, Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import BackgroundLetterAvatars from 'src/components/Shared/BackgroundLetterAvatars';
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse: boolean | undefined;
};

export default function NavbarAccount({ isCollapse }: Props) {
  const { role, user } = useAuth();
  return (
    <Link underline="none" color="inherit">
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <BackgroundLetterAvatars name={user?.fullName || 'A'} />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {user?.fullName}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {ROLES[role].label}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
