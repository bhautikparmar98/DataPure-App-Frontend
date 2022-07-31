import { Typography } from '@mui/material';
import React from 'react';
import MarketplacesToListHeader from './Header';
import MarketplacesList from './MarketplacesList';

interface MarketPlacesToListProps {
  listing: any; // TODO: create a type for listing and use it here
  onMarketPlaceChange: (id: number, key: string, value: any) => void;
}

const marketplaces = [
  { name: 'eBay', id: 1 },
  { name: 'Mercari', id: 2 },
  { name: 'Poshmark', id: 3 },
  { name: 'Bonanza', id: 4 },
];

const MarketPlacesToList: React.FC<MarketPlacesToListProps> = ({
  listing,
  onMarketPlaceChange,
}) => {
  const marketplacesAddHandler = (): void => {
    // TODO: add the marketplaces to the marketplace list
  };

  return (
    <>
      <MarketplacesToListHeader onAddMoreMarketplaces={marketplacesAddHandler} />
      <MarketplacesList marketplaces={marketplaces} onMarketPlaceChange={onMarketPlaceChange} />
    </>
  );
};

export default MarketPlacesToList;
