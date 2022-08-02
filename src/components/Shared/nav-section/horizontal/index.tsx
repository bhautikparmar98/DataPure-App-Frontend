import { memo } from 'react';
// @mui
import { Stack } from '@mui/material';
// type
import { NavSectionProps } from '../type';
//
import { NavListRoot } from './NavList';

// ----------------------------------------------------------------------

const hideScrollbar = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
} as const;

function NavSectionHorizontal({ navConfig }: NavSectionProps) {
  const navAccessible = navConfig.map((group: any) => {
    group.items = group.items.filter((item: NavListProps) => {
      if (item.roles && !item.roles?.includes(role)) return false;
      else return true;
    });

    return group;
  });

  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{ bgcolor: 'background.neutral', borderRadius: 1, px: 0.5 }}
    >
      <Stack direction="row" sx={{ ...hideScrollbar, py: 1 }}>
        {navAccessible.map((group) => (
          <Stack key={group.subheader} direction="row" flexShrink={0}>
            {group.items.map((list) => (
              <NavListRoot key={list.title} list={list} />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default memo(NavSectionHorizontal);
