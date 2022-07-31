import { Box } from '@mui/material';
import React from 'react';
import GeneralInfo from './GeneralInfo';
import MarketPlacesToList from './MarketPlacesToList';

interface BasicListingProps {
  listing: any; // TODO: create a type for listing and use it here
  onMarketPlaceChange: (id: number, key: string, value: any) => void;
}

const BasicListing: React.FC<BasicListingProps> = ({ listing, onMarketPlaceChange }) => (
  <>
    <GeneralInfo listing={listing} />
    <Box marginY={5} />
    <MarketPlacesToList listing={listing} onMarketPlaceChange={onMarketPlaceChange} />
  </>
);

export default BasicListing;
