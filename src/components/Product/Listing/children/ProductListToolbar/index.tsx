import { useState } from 'react';
// @mui
import { MenuItem, InputAdornment, Button, Stack } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// components
import Iconify from 'src/components/Shared/Iconify';
import InputStyle from 'src/components/Shared/InputStyle';
import MenuPopover from 'src/components/Shared/MenuPopover';
// styles
import { ToolbarStyle } from './styles';
//  constants
import { SUBMITTED_OPTIONS } from './constants';
// interfaces
import { ProductListToolbarProps } from './interfaces';
// ----------------------------------------------------------------------

export default function ProductListToolbar({
  numSelected,
  currentTab,
  filterName,
  onFilterName,
  onDeleteProducts,
}: ProductListToolbarProps) {
  const isDesktop = useResponsive('up', 'lg');
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState('submitted');

  const handleClose = () => {
    setOpen(null);
  };

  const handleOpen = (currentTarget: HTMLButtonElement) => {
    setOpen(currentTarget);
  };
  const handleSelection = (value: string) => {
    setSelected(value);
    handleClose();
  };

  return (
    <ToolbarStyle className={!isDesktop ? 'small-screen' : ''}>
      <InputStyle
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Type Name or SKU"
        className="search-input"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} className="search-icon" />
            </InputAdornment>
          ),
        }}
      />
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'center', md: 'start' }}
        justifyContent="space-between"
        sx={{ flex: 1 }}
      >
        <Stack
          direction={{ sm: 'row' }}
          className={`btns ${currentTab === 'listings' ? '' : 'template-btns'}`}
        >
          {currentTab === 'listings' && (
            <Button
              variant="contained"
              onClick={() => {}}
              color={`${numSelected > 0 ? 'info' : 'primary'}`}
              className={`btn ${numSelected > 0 ? '' : 'disabled'}`}
              disabled={numSelected < 1}
            >
              Duplicate
            </Button>
          )}
          <Button
            variant="contained"
            color={`${numSelected > 0 ? 'error' : 'primary'}`}
            onClick={() => {}}
            className={`btn ${numSelected > 0 ? '' : 'disabled'}`}
            disabled={numSelected < 1}
          >
            Delete
          </Button>
        </Stack>
        {currentTab === 'listings' ? (
          <>
            <Button
              color="inherit"
              className="submitted-btn"
              disableRipple
              onClick={(event) => handleOpen(event.currentTarget)}
              endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
            >
              {selected}
            </Button>

            <MenuPopover
              anchorEl={open}
              open={Boolean(open)}
              onClose={handleClose}
              sx={{
                width: 'auto',
                '& .MuiMenuItem-root': { typography: 'body2', borderRadius: 0.75 },
              }}
            >
              {SUBMITTED_OPTIONS.map((option) => (
                <MenuItem
                  key={option.value}
                  selected={option.value === selected}
                  onClick={() => handleSelection(option.value)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuPopover>
          </>
        ) : (
          <Button
            className="btn new-template"
            variant="outlined"
            startIcon={<Iconify icon={'akar-icons:plus'} />}
          >
            New Template
          </Button>
        )}
      </Stack>
    </ToolbarStyle>
  );
}
