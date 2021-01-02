import React, { useState, useEffect } from "react";
import Burst, { BurstData } from "./Burst";
import { Grid, Typography, Fab, Button } from "@material-ui/core";
import Scatter from "./Scatter";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ProgressBar from "./ProgressBar";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import InvertColorsOffIcon from "@material-ui/icons/InvertColorsOff";
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import ScatterChart from "./ChartJsScatter";

export const burstsColors: string[] = [
  "#2196f3",
  "#3568ca",
  "#3f51b5",
  "#7c3696",
  "#b81b76",
  "#f50057",
  "#f44336",
  "#fa6e1b",
  "#ff9800",
  "#414141",
  "#c3a01b",
  "#88a735",
  "#4caf50",
  "#3ea786",
  "#2f9ebd",
].sort(() => Math.random() - 0.5);

// export const colors2 = [
//   "#3f51b5",
//   "#f50057",
//   "#f44336",
//   "#ff9800",
//   "#2196f3",
//   "#4caf50",
// ];

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((prevValue) => prevValue + 1);
}

const THEME = createMuiTheme({
  typography: {
    fontFamily: `"Poppins", sans-serif`,
  },
});

interface ScatterTabProps {
  data: BurstData[];
  setData: (data: BurstData[] | ((func: BurstData[]) => BurstData[])) => void;
  totalAccuracy: number;
  totalPrecision: number;
}

const ScatterTab = (props: ScatterTabProps) => {
  const [showColors, setShowColors] = useState(true);
  const [colors, setColors] = useState<string[]>(burstsColors);

  useEffect(() => {
    props.setData((curr: BurstData[]): BurstData[] =>
      curr.map((item: BurstData, index: number) => {
        let itemCopy: BurstData = item;
        itemCopy.color = colors[index];
        return itemCopy;
      })
    );
  }, []);

  const switchColors = () => {
    setShowColors((val) => !val);

    props.setData((curr: BurstData[]): BurstData[] =>
      curr.map((item: BurstData, index: number) => {
        let itemCopy: BurstData = item;
        itemCopy.color = !showColors ? colors[index] : "grey";
        return itemCopy;
      })
    );
  };

  const forceUpdate = useForceUpdate();

  const openBurst = (burstNumber: number) => {
    if (!showColors) {
      const dataCopy = props.data;
      dataCopy[burstNumber].color = colors[burstNumber];
      props.setData(dataCopy);
      forceUpdate();
    }
  };

  const closeBurst = (burstNumber: number) => {
    if (!showColors) {
      const dataCopy = props.data;
      dataCopy[burstNumber].color = "grey";
      props.setData(dataCopy);
      forceUpdate();
    }
  };

  return (
    <div>
      <MuiThemeProvider theme={THEME}>
        <Grid
          container
          style={{
            position: "fixed",
            width: "95vw",
            height: "85vh",
            left: "3vw",
            top: 100,
          }}
        >
          <Grid item xs={9}>
            {/* <Scatter data={props.data} /> */}
            <ScatterChart data={props.data} />
          </Grid>

          <Grid item xs={3} style={{ height: 650, overflowY: "scroll" }}>
            {/* TODO: add border? */}
            {props.data.map((value, index) => (
              <Burst
                burst={value}
                color={value.color}
                key={index}
                open={() => openBurst(index)}
                close={() => closeBurst(index)}
              />
            ))}
          </Grid>

          <Grid item container spacing={5} xs={12} alignItems="center">
            <Grid item xs={1} style={{ marginRight: -20 }}>
              <Fab
                color={showColors ? "secondary" : "default"}
                aria-label="edit"
                onClick={() => switchColors()}
              >
                {showColors ? <InvertColorsIcon /> : <InvertColorsOffIcon />}
              </Fab>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h5">Total Precision:</Typography>
              <ProgressBar value={props.totalPrecision} show={true} />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h5">Total Accuracy:</Typography>
              <ProgressBar value={props.totalAccuracy} show={true} />
            </Grid>

            <Grid item xs={1} style={{ marginLeft: 70, marginRight: 30 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CloudUploadIcon />}
              >
                Upload
              </Button>
            </Grid>

            <Grid item xs={1}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    </div>
  );
};

export default ScatterTab;
