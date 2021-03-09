import React from "react";
import { Scatter } from "react-chartjs-2";
import { options } from "./ScatterOptions";

import { BurstData } from "./Burst";

import { Position } from "./Analytics";

interface ScatterProps {
  readonly colors: string[];
  readonly data: BurstData[];
  readonly newBurst: Position[];
}

const pointRadius: number = 10;
const hoverRadius: number = 14;

const ScatterChart = (props: ScatterProps): JSX.Element => {
  const datasets: {}[] = [
    ...props.data.map((burst: BurstData, index: number): {} => ({
      pointRadius,
      hoverRadius,
      label: `Burst #${burst.burstNumber}`,
      data: burst.burstCoordinates,
      backgroundColor: props.colors[index],
    })),
    {
      data: props.newBurst,
      backgroundColor: "#e5e5e5", // grey color
      label: `Burst #${props.data.length + 1}`,
      pointRadius: pointRadius * 1.5,
      hoverRadius: hoverRadius * 1.5,
    },
  ];
  return <Scatter data={{ datasets }} height={400} options={options} />;
};

export default ScatterChart;
