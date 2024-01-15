import React, { useEffect } from 'react';
import { Chart } from 'chart.js';
import { generateRandomString } from '../../utils/helpers';

const LinesmenAverageGoalsPerGame = ({ data }) => {
  const chartId = generateRandomString();
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      return;
    }
    const linesmenNames = data.linesmen.map((linesman) => linesman.name);
    const linesmenAverageGoals = data.linesmen.map(
      (linesman) => linesman.average_goals,
    );
    const averageNumber =
      data.linesmen
        .map((linesman) => linesman.average_goals)
        .reduce((a, b) => a + b, 0) / data.linesmen.length;
    const ctx = document.getElementById(chartId).getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: linesmenNames,
        datasets: [
          {
            label: 'Average Goals',
            data: linesmenAverageGoals,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            type: 'line',
            label: 'Average',
            data: Array.from(
              { length: data.linesmen.length },
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
      <h4>Linesmen: Average Goals Per Game</h4>
      <canvas id={chartId} />
    </div>
  );
};

export default LinesmenAverageGoalsPerGame;
