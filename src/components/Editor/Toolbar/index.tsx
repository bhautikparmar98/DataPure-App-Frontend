// MUI
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled } from '@mui/material/styles';
// Icons
import { Icon } from '@iconify/react';
// Constants
import Image from 'src/components/Shared/Image';
import { ROLES, TOOLS, type Tool } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
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
  [TOOLS.SELECT]: 'la:mouse-pointer',
  [TOOLS.COMMENT]: 'cil:comment-bubble',
  [TOOLS.PAN]: '',
  // [TOOLS.ERASER]: 'clarity:eraser-line',
  // [TOOLS.BRUSH]: 'bi:brush',
  // [TOOLS.PEN_TOOL]: 'bi:vector-pen',
};

interface ToolbarProps {
  isAnnotatorRedo?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ isAnnotatorRedo }) => {
  const open = false;
  const currentTool = useAppSelector<Tool>((state) => state.editor.tool);
  const { role } = useAuth();

  const dispatch = useAppDispatch();
  const handleToolClick = (newTool: Tool) => {
    dispatch(setTool(newTool));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Image src="/images/logo.png" alt="DataPure" sx={{ width: 40 }} />
        </DrawerHeader>
        <List
          sx={{
            display: 'inline-flex',
            flexDirection: 'column',
            margin: 'auto',
            position: 'relative',
            top: -88,
          }}
        >
          {Object.values(TOOLS)
            .slice(0, 4)
            .filter((key) => {
              if (
                key === TOOLS.COMMENT &&
                role === ROLES.ANNOTATOR.value &&
                !isAnnotatorRedo
              )
                return false;
              return true;
            })
            .map((text, index) => (
              <ListItem key={`${text}-${index}`} disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={(e) => handleToolClick(text)}
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
                    />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Toolbar;
