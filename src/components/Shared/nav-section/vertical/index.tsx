// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
// type
import { NavSectionProps, NavListProps } from '../type';
//
import { NavListRoot } from './NavList';
// auth
import useAuth from 'src/hooks/useAuth';
// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.overline,
  paddingTop: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export default function NavSectionVertical({
  navConfig,
  isCollapse = false,
  ...other
}: NavSectionProps) {
  const { role } = useAuth();

  const navAccessible = navConfig.map((group: any) => {
    if (group && group.subheader === 'management') {
      group.items = group.items.map((item: NavListProps) => ({
        ...item,
        children: item.children
          ? item.children.filter((child: any) => (child.roles ? child.roles.includes(role) : false))
          : null,
      }));
    }
    return group;
  });

  return (
    <Box {...other}>
      {navAccessible.map((group, i) => (
        <List key={`sub-head-${group.subheader}`} disablePadding sx={{ px: 2 }}>
          <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0,
              }),
            }}
          >
            {group.subheader}
          </ListSubheaderStyle>

          {group.items.map((list: NavListProps) => (
            <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
          ))}
        </List>
      ))}
    </Box>
  );
}
