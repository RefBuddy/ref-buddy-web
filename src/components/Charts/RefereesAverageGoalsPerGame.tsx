import React, { useEffect } from 'react';
import { Chart } from 'chart.js';
import { generateRandomString } from '../../utils/helpers';

const RefereesAverageGoalsPerGame = ({ data }) => {
  const chartId = generateRandomString();
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      return;
    }
    const refereesNames = data.referees.map((referee) => referee.name);
    const refereesAverageGoals = data.referees.map(
      (referee) => referee.average_goals,
    );
    const averageNumber =
      data.referees
        .map((referee) => referee.average_goals)
        .reduce((a, b) => a + b, 0) / data.referees.length;
    const ctx = document.getElementById(chartId).getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: refereesNames,
        datasets: [
          {
            label: 'Average Goals',
            data: refereesAverageGoals,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
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
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average Goals Per Game',
          },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <div style={{ width: '600px' }}>
      <h4>Average Goals Per Game</h4>
      <canvas id={chartId} />
    </div>
  );
};

export default RefereesAverageGoalsPerGame;
