import React from "react";
import { Scatter } from "react-chartjs-2";
import { options } from "./ScatterOptions";

import { BurstData } from "./Burst";

interface ScatterProps {
  colors: string[];
  data: BurstData[];
}

const ScatterChart = (props: ScatterProps): JSX.Element => {
  const datasets: {}[] = props.data.map(
    (burst: BurstData, index: number): {} => ({
      pointRadius: 10,
      hoverRadius: 14,
      label: `Burst #${burst.burstNumber}`,
      data: burst.burstCoordinates,
      backgroundColor: props.colors[index],
    })
  );
  return (
    <>
      <Scatter data={{ datasets }} height={400} options={options} />
    </>
  );
};

export default ScatterChart;
