import React, { FC } from 'react';
import { Chart } from './Chart';

interface OverviewTravelProps {
  chartSeries: number[];
  labels: string[];
  sx?: object;
}

const useChartOptions = (labels: string[]) => {
  return {
    chart: {
      background: 'transparent'
    },
    colors: [
      '#FFB24D', // orange
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
      mode: 'light' // set it manually as light or dark
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

const OverviewTravel: FC<OverviewTravelProps> = ({ chartSeries, labels, sx }) => {
  const chartOptions = useChartOptions(labels);

  return (
    <div className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4 w-80">
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <h6 className="text-gray-700 text-sm font-medium uppercase self-start pt-4 pb-4">
          Travel
        </h6>
        <div className="flex items-center justify-center w-full">
          <Chart
            height={250}
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="80%"
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-2 mt-2">
          {chartSeries.map((item, index) => {
            const label = labels[index];

            return (
              <div key={label} className="flex flex-col items-center">
                <h6 className="my-1 text-lg font-semibold">
                  {label}
                </h6>
                <span className="text-gray-700 text-sm pb-4">
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverviewTravel;
