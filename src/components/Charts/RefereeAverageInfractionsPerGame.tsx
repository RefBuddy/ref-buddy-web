import React, { useEffect } from 'react';
import { Chart } from 'chart.js';
import { generateRandomString } from '../../utils/helpers';

const RefereeAverageInfractionsPerGame = ({ data }) => {
  const chartId = generateRandomString();
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      return;
    }

    const refereesTotalHomeInfractions = data.referees.map(
      (ref) => ref.total_home_infractions / ref.games,
    );
    const refereesTotalAwayInfractions = data.referees.map(
      (ref) => ref.total_visiting_infractions / ref.games,
    );
    const refereesNames = data.referees.map((ref) => ref.name);
    const averageHomeInfractions =
      data.referees
        .map((ref) => ref.total_home_infractions / ref.games)
        .reduce((a, b) => a + b, 0) / data.referees.length;
    const averageAwayInfractions =
      data.referees
        .map((ref) => ref.total_visiting_infractions / ref.games)
        .reduce((a, b) => a + b, 0) / data.referees.length;

    // Creating the Pie Chart
    const ctx = document.getElementById(chartId).getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: refereesNames,
        datasets: [
          {
            label: 'Away Infractions',
            stack: 'Stack 0',
            data: refereesTotalAwayInfractions,
            backgroundColor: 'rgba(243,40,111,0.2)',
            borderColor: 'rgb(223,54,235)',
            borderWidth: 1,
          },
          {
            label: 'Home Infractions',
            stack: 'Stack 0',
            data: refereesTotalHomeInfractions,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            type: 'line',
            stack: 'Stack 1',
            label: 'Average Home Infractions',
            data: Array.from(
              { length: data.referees.length },
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
              { length: data.referees.length },
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
            text: 'Avg. Home vs Away Infractions per Game',
          },
        },
      },
    });

    return () => chart.destroy();
  }, [data]);

  return (
    <div style={{ width: '600px' }}>
      <canvas id={chartId} />
    </div>
  );
};

export default RefereeAverageInfractionsPerGame;
