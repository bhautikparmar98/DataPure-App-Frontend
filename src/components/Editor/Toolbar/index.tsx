// MUI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
// Icons
import { Icon } from '@iconify/react';
// Constants
import { TOOLS, type Tool } from 'src/constants';
import { setTool } from 'src/redux/slices/editor';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  marginBottom: theme.spacing(4),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

const ICONS = {
  [TOOLS.LINE]: 'ci:line-xl',
  [TOOLS.RECTANGLE]: 'bx:rectangle',
  // [TOOLS.ERASER]: 'clarity:eraser-line',
  [TOOLS.SELECT]: 'la:mouse-pointer',
  [TOOLS.PAN]: '',
  // [TOOLS.PEN]: 'la:pen',
  // [TOOLS.BRUSH]: 'bi:brush',
  // [TOOLS.PEN_TOOL]: 'bi:vector-pen',
};

function Toolbar() {
  const open = false;
  const currentTool = useAppSelector<Tool>((state) => state.editor.tool);

  const dispatch = useAppDispatch();
  const handleToolClick = (newTool: Tool) => {
    dispatch(setTool(newTool));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <FormatShapesIcon />
        </DrawerHeader>
        <List>
          {Object.values(TOOLS)
            .slice(0, 3)
            .map((text, index) => (
              <ListItem
                key={`${text}-${index}`}
                disablePadding
                sx={{ display: 'block' }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: text === currentTool ? 'royalblue' : 'inherit',
                    }}
                  >
                    <Icon
                      icon={ICONS[text]}
                      width="30"
                      style={{
                        transform:
                          text === TOOLS.LINE
                            ? 'rotate(45deg)'
                            : 'rotate(0deg)',
                      }}
                      onClick={(e) => handleToolClick(text)}
                    />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default Toolbar;
