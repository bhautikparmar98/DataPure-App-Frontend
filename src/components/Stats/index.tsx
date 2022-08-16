import React from 'react';
// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from 'src/hooks/useSettings';
// children components
import ListingsDynamics from './children/ListingsDynamics';
import Balance from './children/Balance';
import Sales from './children/Sales';

const Stats = () => {
  const { themeStretch } = useSettings();

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ListingsDynamics />
        </Grid>
        <Grid item xs={12} md={4}>
          <Balance />
        </Grid>
        <Grid item xs={12}>
          <Sales />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Stats;
