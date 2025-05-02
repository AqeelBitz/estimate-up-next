'use client';

import { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register chart.js components
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

const ResultChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const generateChartData = () => {
      const data = {
        datasets: [
          {
            label: 'Scatter Plot',
            data: [
              { x: 2, y: 4 },
              { x: 1, y: 4 },
              { x: 2, y: 3 },
              { x: 5, y: 4 },
              { x: 5, y: 3 },
            ],
            backgroundColor: '#000000',
          },
          {
            label: 'Scatter Plot 2',
            data: [
              { x: 3, y: 4 },
              { x: 1, y: 3 },
              { x: 5, y: 3 },
              { x: 5, y: 7 },
              { x: 5, y: 1 },
            ],
            backgroundColor: '#FFCCCC',
          },
        ],
      };
      setChartData(data);
    };

    generateChartData();
  }, []);

  return (
    <div>
      <Scatter
        data={chartData}
        height={300}
        width={600}
        options={{
          responsive: false,
          maintainAspectRatio: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'X-axis',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Y-axis',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ResultChart;