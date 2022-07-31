import { Grid } from '@mui/material';
import React from 'react';
import MarketplacesItem from './MarketplacesItem';

interface MarketplacesListProps {
  marketplaces: any[];
  onMarketPlaceChange: (id: number, key: string, value: any) => void;
}

const MarketplacesList: React.FC<MarketplacesListProps> = ({
  marketplaces,
  onMarketPlaceChange,
}) => (
  <Grid container>
    {marketplaces.map((marketplace) => (
      <Grid item xl={4} xs={6} key={marketplace.id}>
        <MarketplacesItem marketplace={marketplace} onChange={onMarketPlaceChange} />
      </Grid>
    ))}
  </Grid>
);

export default MarketplacesList;
