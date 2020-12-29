import React from "react";

import { Scatter } from "react-chartjs-2";

let positions: {}[] = [];

const rand = () => (Math.random() - 0.5) * 10;

for (let i: number = 0; i < 1000; i++) {
  const newPosition: { x: number; y: number } = { x: rand(), y: rand() };
  positions.push(newPosition);
}

const data: {} = {
  datasets: [
    {
      label: "Scatter Dataset",
      // data: [
      //   {
      //     x: -10,
      //     y: 0,
      //   },
      //   {
      //     x: 0,
      //     y: 10,
      //   },
      //   {
      //     x: 10,
      //     y: 5,
      //   },
      // ],
      data: positions,
      backgroundColor: ["#00FF00", "#2196f3", "#b81b76"],
      pointRadius: 7,
    },
  ],
};

const options: {} = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  animation: {
    duration: 700,
    easing: "easeInOutQuad",
  },
};

const ScatterChart = (): JSX.Element => {
  return (
    <>
      <Scatter data={data} options={options} />
    </>
  );
};

export default ScatterChart;
