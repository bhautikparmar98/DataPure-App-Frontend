import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Drawer, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// hooks
import useCollapseDrawer from 'src/hooks/useCollapseDrawer';
import useResponsive from 'src/hooks/useResponsive';
// utils
import cssStyles from 'src/utils/cssStyles';
// config
import { NAVBAR } from 'src/config';
// components
import Logo from 'src/components/Shared/Logo';
import { NavSectionVertical } from 'src/components/Shared/nav-section';
import Scrollbar from 'src/components/Shared/Scrollbar';
//
import CollapseButton from './CollapseButton';
import NavbarAccount from './NavbarAccount';
import navConfig from './NavConfig';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }: Props) {
  const theme = useTheme();

  const { pathname } = useRouter();

  const isDesktop = useResponsive('up', 'lg');

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        background: theme.palette.gradients.secondary,
      }}>
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' }),
        }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo />

          {isDesktop && !isCollapse && (
            <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
          )}
        </Stack>

        <NavbarAccount isCollapse={isCollapse} />
      </Stack>

      <NavSectionVertical navConfig={navConfig} isCollapse={isCollapse} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}>
      {!isDesktop && (
        <Drawer open={isOpenSidebar} onClose={onCloseSidebar} PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              zIndex: 0,
              borderRightStyle: 'dashed',
              bgcolor: 'transparent',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}>
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
