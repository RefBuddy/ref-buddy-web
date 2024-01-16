import React, { useEffect } from 'react';
import { Chart } from 'chart.js';
import { generateRandomString } from '../../utils/helpers';

const LinesmenAverageInfractionsPerGame = ({ data }) => {
  const chartId = generateRandomString();
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      return;
    }

    const linesmenTotalHomeInfractions = data.linesmen.map(
      (ref) => ref.total_home_infractions / ref.games,
    );
    const linesmenTotalAwayInfractions = data.linesmen.map(
      (ref) => ref.total_visiting_infractions / ref.games,
    );
    const linesmenNames = data.linesmen.map((ref) => ref.name);
    const averageHomeInfractions =
      data.linesmen
        .map((ref) => ref.total_home_infractions / ref.games)
        .reduce((a, b) => a + b, 0) / data.linesmen.length;
    const averageAwayInfractions =
      data.linesmen
        .map((ref) => ref.total_visiting_infractions / ref.games)
        .reduce((a, b) => a + b, 0) / data.linesmen.length;

    // Creating the Pie Chart
    const ctx = document.getElementById(chartId).getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: linesmenNames,
        datasets: [
          {
            label: 'Away Infractions',
            stack: 'Stack 0',
            data: linesmenTotalAwayInfractions,
            backgroundColor: 'rgba(243,40,111,0.2)',
            borderColor: 'rgb(223,54,235)',
            borderWidth: 1,
          },
          {
            label: 'Home Infractions',
            stack: 'Stack 0',
            data: linesmenTotalHomeInfractions,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            type: 'line',
            stack: 'Stack 1',
            label: 'Average Home Infractions',
            data: Array.from(
              { length: data.linesmen.length },
              () => averageHomeInfractions,
            ),
            borderColor: 'rgba(54, 162, 235)',
            borderWidth: 1,
            fill: false,
          },
          {
            type: 'line',
            stack: 'Stack 2',
            label: 'Average Away Infractions',
            data: Array.from(
              { length: data.linesmen.length },
              () => averageAwayInfractions,
            ),
            borderColor: 'rgba(243,40,111)',
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
            },
            stacked: true,
          },
          y: {
            ticks: {
              autoSkip: false,
            },
            stacked: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Total Home Infractions by Linesmen',
          },
        },
      },
    });

    return () => chart.destroy();
  }, [data]);

  return (
    <div style={{ width: '600px' }}>
      <h4>Avg. Home vs Away Infractions per Game</h4>
      <canvas id={chartId} />
    </div>
  );
};

export default LinesmenAverageInfractionsPerGame;
