import { Box, Button, Card, CardContent, IconButton, LinearProgress, MenuItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { IProject } from '../../types/project';
import { fDate } from 'src/utils/formatTime';
import { ANNOTATION_TYPES } from 'src/constants';
import Iconify from 'src/components/Shared/Iconify';
import MetaDataCreationModel from '../MetaDataCreationModel';
import Menu from '@mui/material/Menu';



interface MinimizedProjectCardProps {
  project: IProject;
  syncProjectData?: any;
  renderStatistics?: (project: IProject) => React.ReactNode;
  actions: {
    label: string;
    action: (p: IProject) => void;
    variant: 'contained' | 'icon' | 'outlined';
    icon?: string;
    color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
  }[];
  removeProgress?: boolean;
  calcProgress?: (p: IProject) => number;
  getProgressLabel?: (p: IProject) => string;
  metaButton?: boolean;
}

const MinimizedProjectCard: React.FC<MinimizedProjectCardProps> = ({
  project,
  syncProjectData,
  renderStatistics,
  actions,
  removeProgress,
  calcProgress,
  getProgressLabel,
  metaButton,
}) => {
  const theme = useTheme();

  const [openlistView, setOpenListView] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<any>({});
  const [hovered, setHovered] = useState<boolean>(false)

  
const options = [
  {title: 'View MetaData', icon: "bx:expand-alt"},
  {title: 'Edit', icon: "mdi:pencil"},
  {title: 'Delete', icon: "mdi:delete"}
];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClicked = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    option:any = {}
  ) => {
    if(index === 0){
      setOpenListView(true)
    }
    if(option.title === 'Delete'){
      const action = actions.find(a=> a.label === 'Delete')
      action?.action(project)
    }
    //onClick={() => a.action(project)
    setSelectedIndex({index:index});
    setAnchorEl(null);
  };
  const handleClose = (e:any) => {
    setAnchorEl(null);
  };

  useEffect(()=>{ if(!openlistView) setSelectedIndex({index:1}) },[openlistView])

  const handleMouseOver = (e:any, index:number) => {
    if(index!==2) e.target.style.color = 'rgba(48,63,191,255)'
  }
  const handleMouseOut = (e:any, index:number) => {
    if(index!==2) e.target.style.color = 'black'
  }

  let progress = Math.round(((project.doneCount + project.clientReviewCount) / project.imagesCount) * 100);
  if (calcProgress) progress = calcProgress(project);
  if (progress > 100) progress = 100; //!remove this later
  if (isNaN(progress)) progress = 0;
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color={theme.palette.primary.main}>
            {project.name}
          </Typography>
          <Iconify icon="carbon:overflow-menu-vertical" 
               aria-label="more"
               id="long-button"
               aria-controls={open ? 'long-menu' : undefined}
               aria-expanded={open ? 'true' : undefined}
               aria-haspopup="true"
               onClick={handleMenuClicked}
                width="2em" height="2em" color="#303fbf">
          </Iconify>
              <Menu
                  id="long-menu"
                  MenuListProps={{
                    'aria-labelledby': 'long-button',
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: '20ch',
                    },
                  }}
                >
                  {/* "#303fbf" */}
                  {options.map((option, index:number) => (
                    <MenuItem  key={option.title}
                      onMouseEnter={(e)=>handleMouseOver(e,index)} onMouseOut={(e)=>handleMouseOut(e,index)}
                      style={{ color: option.title === 'Delete' ? 'red' : 'black', backgroundColor:'transparent'}} 
                      onClick={(e)=>{handleMenuItemClick(e,index, option)}}>
                        <Iconify icon={option.icon} style={{ marginRight:"7px"}} width="1em" height="1em"></Iconify> {option.title}
                    </MenuItem>
                  ))}
              </Menu>
              {selectedIndex?.index===0 && <MetaDataCreationModel project={project} syncProjectData={syncProjectData} setOpenListView={setOpenListView} openlistView={openlistView}/>}
        </Box>
        <Box my={1}>
          <Typography variant="body2">
            <strong>Due By: </strong>
            <span style={{ color: theme.palette.text.secondary }}>{fDate(project.dueAt)}</span>

            <strong style={{ marginLeft: 5 }}>Type: </strong>
            <span style={{ color: theme.palette.text.secondary }}>
              {ANNOTATION_TYPES[project.type as keyof typeof ANNOTATION_TYPES]?.label}
            </span>
          </Typography>
        </Box>
        {!removeProgress && (
          <Box my={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" fontSize={12} color={theme.palette.secondary.main}>
                  <strong>{getProgressLabel ? getProgressLabel(project) : 'Progress'}</strong>
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color={theme.palette.secondary.main}>
                  <strong>{progress}%</strong>
                </Typography>
              </Box>
            </Box>

            <LinearProgress variant="determinate" value={progress} color="secondary" />
          </Box>
        )}{' '}
        {renderStatistics && renderStatistics(project)}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          {actions.map((a, index) => {
            if (a.variant === 'icon' && a.label !== 'Delete') {
              return (
                <IconButton color={a.color || 'primary'} edge="end" key={index} onClick={() => a.action(project)}>
                  <Iconify icon={a.icon as any} style={{color: "#303fbf;"}} width="1.7em" height="1.7em"> </Iconify>
                </IconButton>
              );
            }
            return a.label !== 'Delete' && (
              <Button
                key={index}
                sx={{ borderRadius: '16px', width:'content-size', p:1.5}}
                variant={a.variant as any}
                color="primary"
                onClick={() => a.action(project)}>
                {a.label}
              </Button>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MinimizedProjectCard;





