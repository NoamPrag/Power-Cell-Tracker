import React, { useState, useEffect } from "react";
import Burst, { BurstData } from "./Burst";
import ArduinoButton from "./ArduinoButton";
import CountUp from "react-countup";

import { Grid, Typography, Fab, Button } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ProgressBar from "./ProgressBar";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import InvertColorsOffIcon from "@material-ui/icons/InvertColorsOff";
import SaveIcon from "@material-ui/icons/Save";
import ClearAll from "@material-ui/icons/ClearAll";

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
  const [showColors, setShowColors] = useState(false); // set to true on component render

  const [openedBursts, setOpenedBursts] = useState<boolean[]>(
    props.data.map((_): false => false)
  );

  useEffect((): void => {
    burstsColors.sort((): number => Math.random() - 0.5); // Shuffling array
    setShowColors(true);
  }, []);

  const forceUpdate: () => void = useForceUpdate();

  const clearData = () => {
    props.setData([]);
    console.log("Data Cleared! :)");
  };

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
              colors={props.data.map(
                (burst: BurstData, index: number): string =>
                  showColors || openedBursts[index]
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

                    if (!showColors) {
                      forceUpdate();
                    }
                  }}
                />
              )
            )}
          </Grid>

          <Grid item container xs={9} alignContent="center">
            <Grid
              item
              container
              spacing={5}
              xs={12}
              alignItems="center"
              justify="center"
              // style={{ marginTop: -10 }}
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
              <Grid item xs={1}>
                <ArduinoButton />
              </Grid>

              <Grid item xs={5}>
                <Typography variant="h5">
                  Total Precision:{" "}
                  {Math.round(props.totalPrecision * 100) / 100}cm
                </Typography>
                {/* <ProgressBar value={props.totalPrecision} show={true} /> */}
              </Grid>

              <Grid item xs={5}>
                <Typography variant="h5">
                  <CountUp
                    end={props.totalAccuracy}
                    decimals={2}
                    prefix="Total Accuracy: "
                    suffix="cm"
                  />
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            container
            xs={3}
            spacing={5}
            alignItems="center"
            justify="center"
          >
            <Grid
              item
              container
              // spacing={0}
              xs={12}
              direction="row"
              alignContent="center"
              justify="center"
              // style={{ minHeight: "100vh" }}
              // style={{ marginTop: -10 }}
            >
              <Grid
                container
                item
                xs={6}
                alignContent="center"
                justify="center"
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ClearAll />}
                  onClick={clearData}
                >
                  Clear
                </Button>
              </Grid>

              <Grid
                item
                xs={6}
                container
                alignContent="center"
                justify="center"
              >
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
        </Grid>
      </MuiThemeProvider>
    </>
  );
};

export default ScatterTab;
