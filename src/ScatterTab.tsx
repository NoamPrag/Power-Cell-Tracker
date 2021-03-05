import React, { useState, useEffect } from "react";
import Burst, { BurstData } from "./Burst";
import ArduinoButton from "./ArduinoButton";
import CountUp from "react-countup";
import Confetti from "react-confetti";

import { Grid, Typography, Fab, Button } from "@material-ui/core";
import {
  MuiThemeProvider,
  createMuiTheme,
  Theme,
} from "@material-ui/core/styles";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import InvertColorsOffIcon from "@material-ui/icons/InvertColorsOff";
import SaveIcon from "@material-ui/icons/Save";
import ClearAll from "@material-ui/icons/ClearAll";

import ScatterChart from "./ScatterChart";
import { Position } from "./Analytics";

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

interface ScatterTabProps {
  readonly data: BurstData[];
  readonly setData: (
    data: BurstData[] | ((func: BurstData[]) => BurstData[])
  ) => void;
  readonly totalAccuracy: number;
  readonly totalPrecision: number;
  readonly newBurst: Position[];
}

let prevDataLength: number = 0;

const ScatterTab = (props: ScatterTabProps): JSX.Element => {
  const [showColors, setShowColors] = useState(false); // set to true on component render

  const [openedBursts, setOpenedBursts] = useState<boolean[]>(
    props.data.map((_): false => false)
  );

  const [animations, setAnimations] = useState<boolean[]>(
    props.data.map((_): false => false)
  );

  // Called on mount
  useEffect((): void => {
    burstsColors.sort((): number => Math.random() - 0.5); // Shuffling colors on mount
    setShowColors(true);
    setTimeout(
      () =>
        animations.forEach((_, i: number): void => {
          setTimeout((): void => {
            setAnimations((prevAnimations: boolean[]): boolean[] => {
              const clone: boolean[] = [...prevAnimations];
              clone[i] = true;
              return clone;
            });
          }, i * 100);
        }),
      300
    );
  }, []);

  // Called on change of props.data
  useEffect(() => {
    if (props.data.length > prevDataLength)
      setAnimations(props.data.map((_): true => true));
    prevDataLength = props.data.length;

    if (!props.data.length)
      burstsColors.sort((): number => Math.random() - 0.5); // Shuffling colors if there is no data
  }, [props.data]);

  const clearData = () => {
    animations.forEach((_, i: number): void => {
      setTimeout((): void => {
        setAnimations((prevAnimations: boolean[]): boolean[] => {
          let clone = [...prevAnimations];
          clone[props.data.length - i - 1] = false; // setting last element to false
          return clone;
        });
        setTimeout(() => {
          props.setData((prevData) => {
            let clone = [...prevData];
            clone.pop();
            return clone;
          });
        }, 150); // Time from animation start until data removal
      }, i * 100); // Time between each burst
    });
  };

  return (
    <>
      <MuiThemeProvider theme={THEME}>
        <Confetti
          //TODO: change showColors to a 5 inner port power cells event
          recycle={showColors}
          // numberOfPieces={showColors ? 500 : 0}
          run={true}
          // onConfettiComplete={(confetti) => {
          //   confetti.reset;
          // }}
        />
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
              newBurst={props.newBurst}
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
                  key={index}
                  burst={value}
                  color={
                    showColors || openedBursts[index]
                      ? burstsColors[index % burstsColors.length]
                      : "grey"
                  }
                  animationIn={animations[index]}
                  changeOpen={(): void => {
                    setOpenedBursts((prev: boolean[]): boolean[] => {
                      const clone: boolean[] = [...prev];
                      clone[index] = !clone[index];
                      return clone;
                    });
                  }}
                />
              )
            )}
          </Grid>

          <Grid
            item
            container
            xs={9}
            alignContent="center"
            style={{ marginTop: 20 }}
          >
            <Grid
              item
              container
              spacing={5}
              xs={12}
              alignItems="center"
              justify="center"
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
                  <CountUp
                    start={0}
                    end={props.totalAccuracy}
                    decimals={2}
                    prefix="Total Accuracy: "
                    suffix=" cm"
                    preserveValue
                  />
                </Typography>
              </Grid>

              <Grid item xs={5}>
                <Typography variant="h5">
                  <CountUp
                    start={0}
                    end={props.totalPrecision}
                    decimals={2}
                    prefix="Total Precision: "
                    suffix=" cm"
                    preserveValue
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
            style={{ marginTop: 0 }}
          >
            <Grid
              item
              container
              xs={12}
              direction="row"
              alignContent="center"
              justify="center"
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
