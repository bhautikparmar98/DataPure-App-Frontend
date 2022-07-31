import { Button, Checkbox, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import Iconify from 'src/components/Shared/Iconify';

interface MarketplacesItemProps {
  marketplace: any;
  onChange: (id: number, key: string, value: any) => void;
}

const MarketplacesItem: React.FC<MarketplacesItemProps> = ({ marketplace, onChange }) => {
  const [isOpen, setOpen] = useState<null | HTMLElement>(null);
  const [marketplaceName, setMarketplaceName] = useState(marketplace.name);
  const [quantity, setQuantity] = useState(0);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const closeHandler = () => {
    setOpen(null);
  };

  const menuItemClickHandler = (market: any): void => {
    setMarketplaceName(market.name);

    // TODO: call the outside onChange to update the state of the parent

    // close the menu
    closeHandler();
  };
  return (
    <Box display="flex" alignItems="center" paddingY={2} paddingX={2} marginRight={5}>
      <Checkbox checked={true} />

      <Button
        color="inherit"
        onClick={handleOpen}
        sx={{ width: '110px', marginX: 3 }}
        style={{ justifyContent: 'space-between', padding: 0, fontWeight: 'normal' }}
        endIcon={<Iconify icon="ph:caret-down" width={10} height={10} />}
      >
        {marketplaceName}
      </Button>

      <Menu
        keepMounted
        id="simple-menu"
        anchorEl={isOpen}
        onClose={closeHandler}
        open={Boolean(isOpen)}
      >
        {[
          { name: 'Account 1', id: 1 },
          { name: 'Account 2', id: 2 },
        ].map((option) => (
          <MenuItem key={option.id} onClick={() => menuItemClickHandler(option)}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
      {/* This is temporary until we know the shape of the data */}
      <TextField
        value={quantity}
        inputProps={{ min: 0, style: { textAlign: 'center', width: '50px', height: '15px' } }}
        onChange={(e) => setQuantity(e.target.value as any)}
      />
    </Box>
  );
};

export default MarketplacesItem;
