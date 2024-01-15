import React, { useEffect } from 'react';
import { Chart } from 'chart.js';
import { generateRandomString } from '../../utils/helpers';

const TotalInfractionsByTeam = ({ data }) => {
  const chartId = generateRandomString();
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      return;
    }
    const ctx = document.getElementById(chartId).getContext('2d');
    const averageInfractions =
      data.teams.map((team) => team.infractions).reduce((a, b) => a + b, 0) /
      data.teams.length;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.teams.map((team) => team.name),
        datasets: [
          {
            label: 'Total Infractions',
            data: data.teams.map((team) => team.infractions),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            type: 'line',
            label: 'Average',
            data: Array.from(
              { length: data.teams.length },
              () => averageInfractions,
            ),
            borderColor: 'rgba(54, 162, 235)',
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <div style={{ width: '800px' }}>
      <h4>Teams: Total Infractions by Team</h4>
      <canvas id={chartId} />
    </div>
  );
};

export default TotalInfractionsByTeam;
