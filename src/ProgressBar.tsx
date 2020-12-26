import React, { useState, useEffect } from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  MuiThemeProvider,
  createMuiTheme,
  createStyles,
  withStyles,
  Theme,
} from "@material-ui/core/styles";

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 7,
      borderRadius: 3,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    bar: {
      borderRadius: 3,
      backgroundColor: "primary",
    },
  })
)(LinearProgress);

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {`${props.value.toFixed(1)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function LinearWithValueLabel(props: {
  value: number;
  show: boolean;
  height?: number;
  radius?: number;
}) {
  const [progress, setProgress] = useState(props.value);

  if (props.show) {
    setTimeout(() => {
      setProgress(props.value);
    }, 30);
  } else {
    setTimeout(() => {
      setProgress(0);
    }, 200);
  }

  return (
    <div
      style={{
        width: "100%",
        margin: 5,
      }}
    >
      <LinearProgressWithLabel value={progress} valueBuffer={props.value} />
    </div>
  );
}
