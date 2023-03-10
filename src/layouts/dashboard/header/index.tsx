// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import { alpha } from '@mui/material/styles';
// import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
// import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
// import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
//import MoreIcon from '@mui/icons-material/MoreVert';

// hooks
import useOffSetTop from 'src/hooks/useOffSetTop';
import useResponsive from 'src/hooks/useResponsive';
// utils
import cssStyles from 'src/utils/cssStyles';
// config
import { HEADER, NAVBAR } from 'src/config';
// components
import Logo from 'src/components/Shared/Logo';
import Iconify from 'src/components/Shared/Iconify';
import { IconButtonAnimate } from 'src/components/Shared/animate';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
// import LanguagePopover from './LanguagePopover';
// import ContactsPopover from './ContactsPopover';
// import NotificationsPopover from './NotificationsPopover';
// import { useState } from 'react';

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean;
  isOffset: boolean;
  verticalLayout: boolean;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})<RootStyleProps>(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  backgroundColor: 'transparent',
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: 'transparent',
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  onOpenSidebar: VoidFunction;
  isCollapse?: boolean;
  verticalLayout?: boolean;
  noHeader?: boolean;
};

export default function DashboardHeader({
  onOpenSidebar,
  isCollapse = false,
  verticalLayout = false,
  noHeader,
}: Props) {
  const isOffset =
    useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const isDesktop = useResponsive('up', 'lg');


  return (
    <Box sx={{ flexGrow: 1 }} >
       <AppBar sx={{color:"rgba(48,63,191,255)"}}>
      <Toolbar>
       {!isDesktop && (
          <IconButtonAnimate
            onClick={onOpenSidebar}
            sx={{ mr: 1, color: 'text.primary' }}
          >
            <Iconify icon="eva:menu-2-fill" color='white'/>
          </IconButtonAnimate>
        )}
        <Logo sx={{ mr: 2.5 }} />
        {isDesktop && <Typography sx={{color:'white'}}>DATAPURE</Typography> }
        <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {!window.location.href.includes('review') && <Searchbar />}
            <IconButton
              size="large"
              aria-label="show 1 new notifications"
              color="inherit"
            >
              <Badge sx={{mr:1}} badgeContent={1} color="error">
                <NotificationsIcon sx={{color:"white"}} />
              </Badge>
            </IconButton>
          </Box>
          <AccountPopover />  
      </Toolbar>
    </AppBar>
    </Box>
   
    // <RootStyle
    //   isCollapse={isCollapse}
    //   isOffset={isOffset}
    //   verticalLayout={verticalLayout}
    //   style={{ display: noHeader && isDesktop ? 'none' : undefined }}
    // >
    //   <Toolbar
    //     sx={{
    //       minHeight: '100% !important',
    //       px: { lg: 5 },
    //     }}
    //   >
    //     {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

    //     {!isDesktop && (
    //       <IconButtonAnimate
    //         onClick={onOpenSidebar}
    //         sx={{ mr: 1, color: 'text.primary' }}
    //       >
    //         <Iconify icon="eva:menu-2-fill" />
    //       </IconButtonAnimate>
    //     )}

    //     <Searchbar />
    //     <Box sx={{ flexGrow: 1 }} />

    //     <Stack
    //       direction="row"
    //       alignItems="center"
    //       spacing={{ xs: 0.5, sm: 1.5 }}
    //     >
    //       {/* <LanguagePopover />
    //       <NotificationsPopover />
    //       <ContactsPopover /> */}
    //       <AccountPopover />
    //     </Stack>
    //   </Toolbar>
    // </RootStyle>
  );
}
