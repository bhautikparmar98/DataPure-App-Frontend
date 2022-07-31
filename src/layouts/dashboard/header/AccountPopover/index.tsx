import { useSnackbar } from 'notistack';
import { useState } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Icon } from '@mui/material';
// routes
import { PATH_AUTH } from 'src/routes/auth/paths';
// hooks
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// paths
import { PATH_DASHBOARD } from 'src/routes/client/paths';
// components
import MenuPopover from 'src/components/Shared/MenuPopover';
import { useTheme, styled } from '@mui/material/styles';
import { IconButtonAnimate } from 'src/components/Shared/animate';
import Iconify from 'src/components/Shared/Iconify';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  // {
  //   label: 'Profile',
  //   linkTo: '/',
  // },
  {
    label: 'Settings',
    linkTo: '/',
  },
];

// ----------------------------------------------------------------------

const IconButtonWithNoHover = styled(IconButton)({
  '&:hover': {
    background: 'transparent',
  },

  '&:before': {
    background: 'transparent !important',
  },
});

export default function AccountPopover() {
  const router = useRouter();

  const { user, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace(PATH_AUTH.login);

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <IconButtonWithNoHover
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src="/static/unknown.jpg" alt={user?.fullName} />
        <Typography
          variant="subtitle2"
          noWrap
          color="CaptionText"
          style={{ fontWeight: 'bold', paddingLeft: 10, paddingRight: 10 }}
        >
          {user?.fullName}
        </Typography>

        <KeyboardArrowDownIcon width={12} />
      </IconButtonWithNoHover>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <NextLink key={option.label} href={option.linkTo} passHref>
              <MenuItem key={option.label} onClick={handleClose}>
                {option.label}
              </MenuItem>
            </NextLink>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
