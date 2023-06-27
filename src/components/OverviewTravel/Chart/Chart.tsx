import React from 'react';
import Chart from 'react-apexcharts';

const MyChart = ({ options, series, type, width, height }) => {
  return (
    <Chart
      options={options}
      series={series}
      type={type}
      width={width}
      height={height}
    />
  );
};

export default MyChart;
