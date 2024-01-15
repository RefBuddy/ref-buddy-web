import React, { useEffect } from 'react';
import { Chart } from 'chart.js';
import { generateRandomString } from '../../utils/helpers';

const GamesOfficiatedByReferees = ({ data }) => {
  const chartId = generateRandomString();
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      return;
    }
    const ctx = document.getElementById(chartId).getContext('2d');

    const averageNumber =
      data.referees.map((referee) => referee.games).reduce((a, b) => a + b, 0) /
      data.referees.length;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.referees.map((referee) => referee.name),
        datasets: [
          {
            label: 'Games Officiated',
            data: data.referees.map((referee) => referee.games),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
          // Average line
          {
            type: 'line',
            label: 'Average',
            data: Array.from(
              { length: data.referees.length },
              () => averageNumber,
            ),
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            ticks: {
              autoSkip: false,
            },
          },
          y: {
            ticks: {
              autoSkip: false,
              beginAtZero: true,
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <div style={{ width: '800px' }}>
      <h4>Refereees: Games Officiated</h4>
      <canvas id={chartId} />
    </div>
  );
};

export default GamesOfficiatedByReferees;
