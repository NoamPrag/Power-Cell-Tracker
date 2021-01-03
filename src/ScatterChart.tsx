import React from "react";
import { Scatter } from "react-chartjs-2";

import { BurstData } from "./Burst";

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

interface ScatterProps {
  colors: string[];
  data: BurstData[];
}

const ScatterChart = (props: ScatterProps): JSX.Element => {
  const datasets: {}[] = props.data.map(
    (burst: BurstData, index: number): {} => ({
      pointRadius: 7,
      label: `Burst #${burst.burstNumber}`,
      data: burst.burstCoordinates,
      backgroundColor: props.colors[index],
    })
  );
  return (
    <>
      <Scatter data={{ datasets }} options={options} />
    </>
  );
};

export default ScatterChart;
