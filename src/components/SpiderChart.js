import React from 'react';
import { Radar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const SpiderChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.competence),
    datasets: [
      {
        label: 'Cartographie des compétences',
        data: data.map(d => d.note),
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 1,
        pointBackgroundColor: 'rgba(34, 202, 236, 1)',
      },
    ],
  };

  const options = {
    scale: {
      min: 0,
      max: 5,
      ticks: {
        beginAtZero: true,
        max: 5,
        stepSize: 1,
        color: 'rgba(0, 0, 0, 0)', // Make the text color of the ticks transparent
        backdropColor: 'rgba(0, 0, 0, 0)', // Make the background color of the ticks transparent
      },
      pointLabels: {
        fontSize: 12,
        color: 'rgba(0, 0, 0, 1)',
      },
      angleLines: {
        display: true,
        color: 'rgba(0, 0, 0, 0.2)',
      },
      gridLines: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div style={{ width: '250px', height: '250px' }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default SpiderChart;
