import { useSnackbar } from 'notistack';
import { useState, useContext } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
// routes
import { PATH_AUTH } from 'src/routes/auth/paths';
// hooks
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// paths
// components
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled } from '@mui/material/styles';
import MenuPopover from 'src/components/Shared/MenuPopover';
import { ROLES } from 'src/constants';
import { SettingsContext } from 'src/contexts/SettingsContext';

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
    linkTo: '/'
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

  const { user, role, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const ctx = useContext(SettingsContext)

  const handleClose = (label:string = '') => {
    setOpen(null);
    if(label === "Settings") ctx.setShowSetting(true)
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
        <Avatar alt={user?.fullName} />
        <Box>
        <Typography variant="subtitle2" 
             color="CaptionText"
             style={{ fontWeight: 'bold', paddingLeft: 10, paddingRight: 10 , color:"white"}}
              noWrap>
            {user?.fullName}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'white' }} style={{float:'left', paddingLeft: 10}}>
            {ROLES[role].label}
          </Typography>
        </Box>
        <KeyboardArrowDownIcon width={12} style={{color:"white"}} />
          
      </IconButtonWithNoHover>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={()=>handleClose()}
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
            option.label !== "Settings" ? <NextLink key={option.label} href={option.linkTo} passHref>
              <MenuItem key={option.label} onClick={()=>handleClose(option.label)}>
                {option.label}
              </MenuItem>
            </NextLink>
            :  <MenuItem key={option.label} onClick={()=>handleClose(option.label)}>
                  {option.label}
                </MenuItem>
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
