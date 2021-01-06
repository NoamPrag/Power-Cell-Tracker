import React, { useState, useEffect } from "react";
import Burst, { BurstData } from "./Burst";
import { Grid, Typography, Fab, Button } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ProgressBar from "./ProgressBar";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import InvertColorsOffIcon from "@material-ui/icons/InvertColorsOff";
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import ScatterChart from "./ScatterChart";

let burstsColors: string[] = [
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
].sort((): number => Math.random() - 0.5); // Shuffling array

// const colors2 = [
//   "#3f51b5",
//   "#f50057",
//   "#f44336",
//   "#ff9800",
//   "#2196f3",
//   "#4caf50",
// ];

const THEME = createMuiTheme({
  typography: {
    fontFamily: `"Poppins", sans-serif`,
  },
});

const useForceUpdate = (): (() => void) => {
  const [value, setValue] = useState(0);
  return (): void => setValue(value + 1);
};

interface ScatterTabProps {
  data: BurstData[];
  setData: (data: BurstData[] | ((func: BurstData[]) => BurstData[])) => void;
  totalAccuracy: number;
  totalPrecision: number;
}

const ScatterTab = (props: ScatterTabProps): JSX.Element => {
  const [showColors, setShowColors] = useState(false);

  const [openedBursts, setOpenedBursts] = useState<boolean[]>(
    props.data.map((_): false => false)
  );

  useEffect((): void => {
    burstsColors.sort((): number => Math.random() - 0.5); // Shuffling array
  }, []);

  const forceUpdate: () => void = useForceUpdate();

  return (
    <>
      <MuiThemeProvider theme={THEME}>
        <Grid
          container
          style={{
            position: "fixed",
            width: "95vw",
            height: "75vh",
            left: "3vw",
            top: 100,
            display: "flex",
          }}
        >
          <Grid item xs={9}>
            <ScatterChart
              data={props.data}
              colors={openedBursts.map(
                (opened: boolean, index: number): string =>
                  showColors || opened
                    ? burstsColors[index % burstsColors.length]
                    : "#e5e5e5"
              )}
            />
          </Grid>

          <Grid item xs={3} style={{ height: 650, overflowY: "scroll" }}>
            {props.data.map(
              (value: BurstData, index: number): JSX.Element => (
                <Burst
                  burst={value}
                  color={
                    showColors || openedBursts[index]
                      ? burstsColors[index % burstsColors.length]
                      : "grey"
                  }
                  key={index}
                  changeOpen={(): void => {
                    setOpenedBursts((prev: boolean[]): boolean[] => {
                      prev[index] = !prev[index];
                      return prev;
                    });

                    forceUpdate();
                  }}
                />
              )
            )}
          </Grid>

          <Grid
            item
            container
            spacing={5}
            xs={12}
            alignItems="center"
            style={{ marginTop: 25 }}
          >
            <Grid item xs={1} style={{ marginRight: -20 }}>
              <Fab
                color={showColors ? "secondary" : "default"}
                aria-label="edit"
                onClick={() => setShowColors((val: boolean): boolean => !val)}
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
    </>
  );
};

export default ScatterTab;
