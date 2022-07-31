import { Box, Button, IconButton, MenuItem, Popover, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RHFSelect } from 'src/components/Shared/hook-form';
import Iconify from 'src/components/Shared/Iconify';

interface MarketplacesToListHeaderProps {
  onAddMoreMarketplaces: () => void;
}

const MarketplacesToListHeader: React.FC<MarketplacesToListHeaderProps> = ({
  onAddMoreMarketplaces,
}) => {
  const theme = useTheme();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      marketplace: '',
    },
  });
  const onSubmit = (data: any) => {
    console.log('data', data);
  };

  const [marketplacesAddClicked, setMarketplacesAddClicked] = useState<HTMLButtonElement | null>(
    null
  );

  const marketplacesAddHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMarketplacesAddClicked(event.currentTarget);
  };

  const closeMarketplacesHandler = () => {
    setMarketplacesAddClicked(null);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h5" gutterBottom>
          Marketplaces to list on
        </Typography>
      </Box>

      <Box>
        <Button color="primary" onClick={marketplacesAddHandler}>
          Add more marketplaces
        </Button>

        <Popover
          open={Boolean(marketplacesAddClicked)}
          anchorEl={marketplacesAddClicked}
          onClose={closeMarketplacesHandler}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 2, minWidth: 400, background: theme.palette.gradients.secondary }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Choose the marketplace
                  </Typography>
                </Box>
                <Box>
                  <IconButton color="inherit" onClick={closeMarketplacesHandler}>
                    <Iconify icon="bi:x-lg" width={15} height={15} />
                  </IconButton>
                </Box>
              </Box>

              <Box paddingTop={2}>
                <RHFSelect name="marketplace" select fullWidth control={control}>
                  <MenuItem key="ebay" value="ebay">
                    Ebay
                  </MenuItem>
                </RHFSelect>
              </Box>

              <Box paddingTop={3}>
                <Button variant="contained" color="primary" fullWidth type="submit">
                  Sign In with Ebay
                </Button>
              </Box>
              <Box display="flex" justifyContent="center" paddingTop={2}>
                <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                  Don't have an account?
                </Typography>
              </Box>
            </Box>
          </form>
        </Popover>
      </Box>
    </Box>
  );
};

export default MarketplacesToListHeader;
