import React, { FC } from 'react';
import { Typography, Box, SvgIcon, useTheme } from '@mui/material';
import { Chart } from '../Chart';

interface OverviewTravelProps {
  chartSeries: number[];
  labels: string[];
  sx?: object;
}

const useChartOptions = (labels: string[]) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent'
    },
    colors: [
      '#f5a614', // orange
      '#000000' // black
    ],
    dataLabels: {
      enabled: false
    },
    labels,
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

const OverviewTravel: FC<OverviewTravelProps> = ({ chartSeries, labels, sx }) => {
  const chartOptions = useChartOptions(labels);

  return (
    <div className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4" style={{ width: '300px' }}>
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <Typography
          color="text.secondary"
          variant="overline"
          style={{ alignSelf: 'flex-start', paddingTop: '1rem', paddingBottom: '1rem' }}
        >
          Travel
        </Typography>
        <div className="flex items-center justify-center w-full">
          <Chart
            height={250}
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="80%"
          />
        </div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mt: 2
          }}
        >
          {chartSeries.map((item, index) => {
            const label = labels[index];

            return (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography
                  sx={{ my: 1 }}
                  variant="h6"
                >
                  {label}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                  style={{ paddingBottom: '1rem' }}
                >
                  {item}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </div>
    </div>
  );
};

export default OverviewTravel;
