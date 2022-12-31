// @mui
import { useTheme, styled } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  InputAdornment,
  Switch,
  Box,
  MenuItem
} from '@mui/material';
import Menu from '@mui/material/Menu';
// components
import Iconify from 'src/components/Shared/Iconify';
import InputStyle from 'src/components/Shared/InputStyle';
import React, { useEffect, useState } from 'react';
import { f1Date } from 'src/utils/formatTime';
import { IProject } from '../../List/types/project';
import { leastIndex } from 'd3-array';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

type Props = {
  numSelected: number;
  filterName: string;
  onFilterName: (value: string) => void;
  onDeleteProducts: VoidFunction;
  dense: boolean;
  toggleDense: () => void;
  project: IProject | undefined
};

export default function ReviewHeaderToolBar({
  numSelected,
  filterName,
  onFilterName,
  onDeleteProducts,
  dense,
  toggleDense,
  project
}: Props) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';


  const options = [
    { title: 'Archive', icon: "bxs:file-archive" },
    { title: 'Edit', icon: "mdi:pencil" },
    { title: 'Delete', icon: "mdi:delete" }
  ];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClicked = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    option: any = {}
  ) => {
    if (option.title === 'Delete') {
      onDeleteProducts()
    }
    if (option.title === 'Edit') {
      //..
    }
    if (option.title === 'Archive') {
      //...
    }
    //onClick={() => a.action(project)
    setAnchorEl(null);
  };
  const handleClose = (e: any) => {
    setAnchorEl(null);
  };


  const handleMouseOver = (e: any, index: number) => {
    if (index !== 2) e.target.style.color = 'rgba(48,63,191,255)'
  }
  const handleMouseOut = (e: any, index: number) => {
    if (index !== 2) e.target.style.color = 'black'
  }
  let date :string = ''
  if(project){
    date = f1Date(project.dueAt)
  }

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <InputStyle
          sx={{ marginLeft: 10 }}
          stretchStart={240}
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="Search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon={'eva:search-fill'}
                  sx={{ color: 'rgba(97,111,228,255)', width: 20, height: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
        <Box sx={{display:'flex'}}>

          <Iconify icon="simple-line-icons:calender"  sx={{mt:2.4, mr:1, color:'red'}}></Iconify>
          <Typography sx={{mt:2, mr:1, color:'red'}}>{date}</Typography>
          <Typography sx={{ bgcolor: 'transparent', color: 'rgba(48,63,191,255)', fontSize:'1.2rem',
                          fontcursor: 'pointer', mt:1.5, alignItems:'flex-start' }}>
              {'+ Add More'}
          </Typography>
          
          <Tooltip title="Dense" sx={{mt:0.8}}>
            <Switch checked={dense} onClick={() => toggleDense()} />
          </Tooltip>

          <Tooltip title="Filter list">
            <IconButton>
              <Iconify icon={'material-symbols:filter-alt'} width='2rem' height='2rem' style={{ color: 'rgba(48,63,191,255)' }} />
            </IconButton>
          </Tooltip>

          <Iconify icon="carbon:overflow-menu-vertical"
            sx={{mt:1}}
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
            {options.map((option, index: number) => (
              <MenuItem key={option.title} disabled={!(numSelected>0)}
                onMouseEnter={(e) => handleMouseOver(e, index)} onMouseOut={(e) => handleMouseOut(e, index)}
                style={{ color: option.title === 'Delete' ? 'red' : 'black', backgroundColor: 'transparent' }}
                onClick={(e) => { handleMenuItemClick(e, index, option) }}>
                <Iconify icon={option.icon} style={{ marginRight: "7px" }} width="1em" height="1em"></Iconify> {option.title}
              </MenuItem>
            ))}
          </Menu>
        </Box>
    </RootStyle>
  );
}

