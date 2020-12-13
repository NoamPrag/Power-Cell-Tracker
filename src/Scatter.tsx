import React from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  ScatterSeries,
  ArgumentAxis,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";

// import { colors } from "./App";
import { Position, BurstData } from "./Burst";

const Scatter = (props: { data: BurstData[] }) => {
  let a: Position[] = [];
  for (const burst of props.data) {
    for (const position of burst.burstCoordinates) {
      a.push(position);
    }
  }

  let p: {}[] = [];
  for (let i = 0; i < props.data.length; i++) {
    for (let j = 0; j < 5; j++) {
      let obj = {
        [`x${i}`]: a[j + 5 * i].x,
        [`y${i}`]: a[j + 5 * i].y,
      };
      p.push(obj);
    }
  }

  return (
    <Paper>
      <Chart data={p} height={650}>
        <ArgumentAxis showGrid />
        <ValueAxis />
        {props.data.map((val, index) => (
          <ScatterSeries
            argumentField={`x${index}`}
            valueField={`y${index}`}
            key={index}
            color={val.color}
            point={{ size: 15 }}
          />
        ))}
        <Animation />
      </Chart>
    </Paper>
  );
};

export default Scatter;
