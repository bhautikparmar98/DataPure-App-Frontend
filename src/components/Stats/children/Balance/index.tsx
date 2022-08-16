// React
import { Fragment } from 'react';
// @mui
import { Box, Grid, Card, CardHeader, Typography } from '@mui/material';
//constants
import { listLabels } from './constants';
// Components
import Iconify from 'src/components/Shared/Iconify';
// styles
import { BalanceStyle } from './styles';

// ----------------------------------------------------------------------

export default function Balance() {
  return (
    <BalanceStyle>
      <Card className="balance-card">
        <Grid container>
          <Grid item xs={5}>
            <Grid container justifyContent="flex-start" alignItems="flex-end">
              <Iconify icon={'la:coins'} flip="horizontal" className="icon" />
              <CardHeader className="title" title="Balance" />
            </Grid>
          </Grid>
          <Grid item xs={7} className="total-amount-container">
            <Iconify icon="fluent:triangle-down-12-filled" className="icon total-amount-icon" />
            <Typography variant="h5" className="total-amount" align="right">
              $ 10,958.95
            </Typography>
          </Grid>
        </Grid>
        <Box className="balance-content">
          <Grid container justifyContent="space-between" className="balance-container">
            {listLabels.map((label, i) => (
              <Fragment key={`balance-content-${i}`}>
                <Grid item alignSelf={'start'} xs={8}>
                  <Typography variant="body2">{label.title}</Typography>
                </Grid>
                <Grid className="balance-row" item xs={4}>
                  <Typography
                    variant="body2"
                    align="right"
                    sx={{ pr: 3 }}
                    key={`balance-period-${i}`}
                  >
                    Last 30 days
                  </Typography>
                </Grid>
                <Grid item xs={12} className="amount-wrapper">
                  <Typography className="amount" variant="inherit">
                    {label.amount}
                  </Typography>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Box>
      </Card>
    </BalanceStyle>
  );
}
