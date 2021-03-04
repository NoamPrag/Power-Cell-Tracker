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

const ScatterChart = (props: ScatterProps): JSX.Element => {
  const datasets: {}[] = [
    ...props.data.map((burst: BurstData, index: number): {} => ({
      pointRadius: 10,
      hoverRadius: 14,
      label: `Burst #${burst.burstNumber}`,
      data: burst.burstCoordinates,
      backgroundColor: props.colors[index],
    })),
    {
      data: props.newBurst,
      backgroundColor: "#e5e5e5", // grey color
      label: `Burst #${props.data.length + 1}`,
      pointRadius: 20,
      hoverRadius: 28,
    },
  ];
  return <Scatter data={{ datasets }} height={400} options={options} />;
};

export default ScatterChart;
