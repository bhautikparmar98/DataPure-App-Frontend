import { paramCase } from 'change-case';
import { useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { MenuItem, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/admin/paths';
// components
import Iconify from 'src/components/Shared/Iconify';
import MenuPopover from 'src/components/Shared/MenuPopover';

// ----------------------------------------------------------------------

type Props = {
  onDelete: VoidFunction;
  item: string;
};

export default function UserMoreMenu({ onDelete, item }: Props) {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Delete
        </MenuItem>

        <NextLink href={`${PATH_DASHBOARD.root}/${paramCase(item)}/edit`}>
          <MenuItem>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2, width: 24, height: 24 }} />
            Edit
          </MenuItem>
        </NextLink>
      </MenuPopover>
    </>
  );
}
