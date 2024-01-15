import React, { useEffect } from 'react';
import { Chart } from 'chart.js';
import { generateRandomString } from '../../utils/helpers';

const PenaltyMinutesByTeam = ({ data }) => {
  const chartId = generateRandomString();
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      return;
    }
    const teamNames = data.teams.map((team) => team.name);
    const teamPenaltyMinutes = data.teams.map((team) => team.penalty_minutes);
    const averageNumber =
      data.teams
        .map((team) => team.penalty_minutes)
        .reduce((a, b) => a + b, 0) / data.teams.length;
    const ctx = document.getElementById(chartId).getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: teamNames,
        datasets: [
          {
            label: 'Penalty Minutes',
            data: teamPenaltyMinutes,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            type: 'line',
            label: 'Average',
            data: Array.from(
              { length: data.teams.length },
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
      <h4>Teams: Total Penalty Minutes</h4>
      <canvas id={chartId} />
    </div>
  );
};

export default PenaltyMinutesByTeam;
