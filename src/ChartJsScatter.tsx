import React from "react";
import { Scatter } from "react-chartjs-2";

import { BurstData, Position } from "./Burst";

const rand = (range: number): number => (Math.random() - 0.5) * 2 * range;

const generateRandPositions: (quantity: number, range: number) => Position[] = (
  quantity: number,
  range: number
): Position[] =>
  Array.from(Array(quantity).keys()).map(
    (i: number): Position => ({ x: rand(range), y: rand(range) })
  );

const positions = generateRandPositions(500, 10);

const generateDataSet = () => {};

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

interface ScatterProps {
  colors?: string[];
  data?: BurstData[];
}

const ScatterChart = (props: ScatterProps): JSX.Element => {
  const datasets: {}[] = props.data.map((burst: BurstData): {} => ({
    pointRadius: 7,
    label: `Burst #${burst.burstNumber}`,
    data: burst.burstCoordinates,
  }));
  return (
    <>
      <Scatter
        data={{ datasets }}
        options={{
          ...options,
          color: (context: { datasetIndex: number }): string =>
            props.colors[context.datasetIndex],
        }}
      />
    </>
  );
};

export default ScatterChart;
