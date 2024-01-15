import React, { useEffect } from 'react';
import { Chart } from 'chart.js';
import { generateRandomString } from '../../utils/helpers';

const RoleDistribution = ({ data }) => {
  const chartId = generateRandomString();
  const categorizeRoles = (referees, linesmen) => {
    const refSet = new Set(referees.map((ref) => ref.name));
    const lineSet = new Set(linesmen.map((line) => line.name));

    const onlyRefs = new Set([...refSet].filter((x) => !lineSet.has(x)));
    const onlyLines = new Set([...lineSet].filter((x) => !refSet.has(x)));
    const both = new Set([...refSet].filter((x) => lineSet.has(x)));
    console.log(onlyRefs, onlyLines, both);

    return {
      onlyRefs: onlyRefs.size,
      onlyLines: onlyLines.size,
      both: both.size,
    };
  };
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      return;
    }

    const roleCounts = categorizeRoles(data.referees, data.linesmen);
    const ctx = document.getElementById(chartId).getContext('2d');

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Only Referees', 'Only Linesmen', 'Both'],
        datasets: [
          {
            label: 'Role Distribution',
            data: [roleCounts.onlyRefs, roleCounts.onlyLines, roleCounts.both],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <div style={{ width: '400px' }}>
      <h4>League: Role Distribution</h4>
      <canvas id={chartId} />
    </div>
  );
};

export default RoleDistribution;
