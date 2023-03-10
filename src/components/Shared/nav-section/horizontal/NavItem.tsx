import { ReactElement, forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Box, Link, ListItemIcon } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// config
import { ICON } from 'src/config';
// type
import { NavItemProps } from '../type';
//
import Iconify from '../../Iconify';
import { ListItemStyle } from './style';

import { isExternalLink } from '..';
import AbcIcon from '@mui/icons-material/Abc';

// ----------------------------------------------------------------------

export const NavItemRoot = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  NavItemProps
>(({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
  const { title, path, icon, children } = item;

  if (children) {
    return (
      <ListItemStyle
        ref={ref}
        open={open}
        activeRoot={active}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <NavItemContent icon={icon} title={title} children={children} />
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener">
      <NavItemContent icon={icon} title={title} children={children} />
    </ListItemStyle>
  ) : (
    <NextLink href={path}>
      <ListItemStyle activeRoot={active}>
        <NavItemContent icon={icon} title={title} children={children} />
      </ListItemStyle>
    </NextLink>
  );
});

// ----------------------------------------------------------------------

export const NavItemSub = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  NavItemProps
>(({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
  const { title, path, icon, children } = item;

  if (children) {
    return (
      <ListItemStyle
        ref={ref}
        subItem
        disableRipple
        open={open}
        activeSub={active}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <NavItemContent icon={icon} title={title} children={children} subItem />
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle
      subItem
      href={path}
      disableRipple
      rel="noopener"
      target="_blank"
      component={Link}
    >
      <NavItemContent icon={icon} title={title} children={children} subItem />
    </ListItemStyle>
  ) : (
    <NextLink href={path}>
      <ListItemStyle disableRipple activeSub={active} subItem>
        <NavItemContent icon={icon} title={title} children={children} subItem />
      </ListItemStyle>
    </NextLink>
  );
});

// ----------------------------------------------------------------------

type NavItemContentProps = {
  title: string;
  icon?: ReactElement;
  children?: { title: string; path: string }[];
  subItem?: boolean;
};

export const ListItemIconStyle = styled(ListItemIcon)({
  width: ICON.NAVBAR_ITEM,
  height: ICON.NAVBAR_ITEM,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '100%', height: '100%' },
});

function NavItemContent({
  icon,
  title,
  children,
  subItem,
}: NavItemContentProps) {
  return (
    <>
      {icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
            '& svg': { width: '100%', height: '100%' },
          }}
        >
          {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
        </Box>
      )}
      {title}
      {children && (
        <Iconify
          icon={subItem ? 'eva:chevron-right-fill' : 'eva:chevron-down-fill'}
          sx={{
            ml: 0.5,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
          }}
        />
      )}
    </>
  );
}
