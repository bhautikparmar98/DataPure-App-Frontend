// @mui
import { Grid, CardHeader, Button, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
// components
import ReactApexChart from 'src/components/Shared/chart';
import Iconify from 'src/components/Shared/Iconify';
// hooks
import useListingsDynamics from './hooks/useListingsDynamics';
import useResponsive from 'src/hooks/useResponsive';
// Styles
import { CardStyle, ChartStyle } from './styles';

const tabsLabels = ['D', 'W', '1M', '2M', '3M', 'Custom'];

export default function ListingsDynamics() {
  const [currentChart, setCurrentChart] = useState(0);
  const [isLineGraph, setIsLineGraph] = useState(true);
  const { chartOptions, chartData } = useListingsDynamics({ currentChart, isLineGraph });
  const isMobile = useResponsive('down', 'sm');
  return (
    <CardStyle>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <Grid container justifyContent="flex-start" alignItems="center">
            <Iconify icon={'ant-design:pie-chart-outlined'} flip="horizontal" className="icon" />
            <CardHeader className="title" title="Listings Dynamics" />
          </Grid>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Button
            size="small"
            color="secondary"
            onClick={() => setIsLineGraph((s) => !s)}
            className="toggle-graph-btn"
            startIcon={
              <Iconify icon={isLineGraph ? 'bi:file-bar-graph' : 'system-uicons:graph-increase'} />
            }
          >
            View {isLineGraph === true ? 'Bar' : 'Line'} Graph
          </Button>
        </Grid>
      </Grid>
      <ChartStyle className={isMobile ? 'small-screen' : ''} sx={{ p: 3, pb: 1 }} dir="ltr">
        <Tabs
          value={currentChart}
          onChange={(e, val) => setCurrentChart(+val)}
          aria-label="listings dynamics tabs"
          className="tabs"
          TabIndicatorProps={{
            style: { display: 'none' },
          }}
        >
          {tabsLabels.map((label, i) => (
            <Tab className="tab" key={`chart-tab-${label}`} label={label} />
          ))}
        </Tabs>
        <ReactApexChart
          type={isLineGraph ? 'line' : 'bar'}
          series={chartData}
          options={chartOptions}
          height={305}
        />
      </ChartStyle>
    </CardStyle>
  );
}
