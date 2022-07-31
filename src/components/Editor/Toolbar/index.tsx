import React, { useEffect, useRef } from 'react';
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

function Toolbar() {
  const [open, setOpen] = React.useState(false);
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
          {Object.values(TOOLS).map((text, index) => (
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
                  }}
                >
                  {text === TOOLS.PEN ? (
                    <Icon
                      icon="la:pen"
                      width="30"
                      color={text === currentTool ? 'royalblue' : 'inherit'}
                      onClick={(e) => handleToolClick(text)}
                    />
                  ) : text === TOOLS.RECTANGLE ? (
                    <Icon
                      icon="bx:rectangle"
                      width="30"
                      color={text === currentTool ? 'royalblue' : 'inherit'}
                      onClick={(e) => handleToolClick(text)}
                    />
                  ) : text === TOOLS.BRUSH ? (
                    <Icon
                      icon="bi:brush"
                      width="30"
                      color={text === currentTool ? 'royalblue' : 'inherit'}
                      onClick={(e) => handleToolClick(text)}
                    />
                  ) : text === TOOLS.PEN_TOOL ? (
                    <Icon
                      icon="bi:vector-pen"
                      width="30"
                      color={text === currentTool ? 'royalblue' : 'inherit'}
                      onClick={(e) => handleToolClick(text)}
                    />
                  ) : (
                    <Icon
                      icon="clarity:eraser-line"
                      width="30"
                      color={text === currentTool ? 'royalblue' : 'inherit'}
                      onClick={(e) => handleToolClick(text)}
                    />
                  )}
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
