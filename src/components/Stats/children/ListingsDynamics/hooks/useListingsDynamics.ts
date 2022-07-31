// react
import { useState, useEffect } from 'react';
// hooks
import { useTheme } from '@mui/material/styles';
import { merge } from 'lodash';
// components
import { BaseOptionChart } from 'src/components/Shared/chart';
// mocks
import { _chartDayData, _chartMonthData, _daysLabels, _monthsLabels } from 'src/_mock';

type props = {
  currentChart: number;
  isLineGraph: boolean;
};

const useListingsDynamics = ({ currentChart, isLineGraph }: props) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState(_chartDayData);

  const minY = chartData[0] ? Math.min(...chartData[0].data, ...chartData[1].data) - 5 || 0 : 0;
  const maxY = chartData[0] ? Math.max(...chartData[0].data, ...chartData[1].data) + 5 || 20 : 20;

  const xAxisLabels = currentChart === 0 ? _daysLabels : _monthsLabels;

  useEffect(() => {
    setChartData(currentChart === 0 ? _chartDayData : _chartMonthData);
  }, [currentChart]);

  // theme default chart options
  const baseOptions = BaseOptionChart();

  // customization options
  const mainOptions = {
    stroke: { width: [2, 2] },
    legend: {
      position: 'left',
      floating: true,
      labels: { colors: theme.palette.grey[600] },
      markers: { width: 7, height: 7 },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: isLineGraph ? -7 : -20,
      style: {
        colors: undefined,
      },
      background: {
        enabled: true,
        borderRadius: 7,
        padding: 7,
      },
    },

    fill: { type: ['solid', 'solid'] },
    colors: [theme.palette.primary.light, theme.palette.label.Listed.color],

    height: '100',
    tooltip: {
      shared: false,
      intersect: true,
      fillSeriesColor: true,
      y: {
        formatter: (y: number) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        },
      },
    },
    yaxis: {
      show: false,
      max: maxY,
      min: minY,
    },
  };

  const chartOptions = merge(baseOptions, xAxisLabels, mainOptions);

  return {
    chartOptions,
    chartData,
  };
};

export default useListingsDynamics;
