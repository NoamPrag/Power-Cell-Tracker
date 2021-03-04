import React, { useEffect, useState } from "react";
import {
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Container,
  Typography,
  Grid,
  Slide,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import SportsSoccerIcon from "@material-ui/icons/SportsSoccer";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import GrainIcon from "@material-ui/icons/Grain";
import ProgressBar from "./ProgressBar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import CountUp from "react-countup";
import { useCountUp } from "react-countup";

export type Position = { x: number; y: number };

export interface BurstData {
  burstNumber: number;
  burstCoordinates: Position[];

  inInnerPort: boolean[];

  accuracy?: number;
  precision?: number;
}

const tabTheme = createMuiTheme({
  palette: {
    primary: green,
  },

  typography: {
    fontFamily: `"Poppins", sans-serif`,
    fontWeightRegular: 400,
  },
});

const Burst = (props: {
  burst: BurstData;
  color: string;
  changeOpen: () => void;
  animationIn?: boolean;
}): JSX.Element => {
  const [opened, setOpened] = useState(false);

  return (
    <Slide direction="left" in={props.animationIn} mountOnEnter unmountOnExit>
      <Container maxWidth="sm" style={{ margin: "10px 0" }}>
        <Accordion>
          <ThemeProvider theme={tabTheme}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              onClick={(): void => {
                setOpened((current: boolean): boolean => !current);
                props.changeOpen();
              }}
            >
              Burst #{props.burst.burstNumber}
            </Typography>
          </AccordionSummary>
        </ThemeProvider>
        <AccordionDetails
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={1} justify="center">
            <Grid item xs={1} justify="center">
              <GpsFixedIcon />
            </Grid>
            <Grid item xs={3} justify="center">
              <Typography>
                {"  "}
                {Math.round(props.burst.precision * 100) / 100}cm
              </Typography>
            </Grid>
            <Grid item xs={1} justify="center"></Grid>
            <Grid item xs={1} justify="center">
              <GrainIcon />
            </Grid>
            <Grid item xs={3} justify="center">
              <Typography>
                <CountUp
                  end={props.burst.precision}
                  decimals={2}
                  prefix=" "
                  suffix="cm"
                ></CountUp>
              </Typography>
            </Grid>
            <Grid container item xs={12} justify="center" direction="row">
              {props.burst.inInnerPort.map(
                (inInnerPort: boolean, index: number): JSX.Element => (
                  <Grid item xs={2} justify="center">
                    <SportsSoccerIcon
                      key={index}
                      fontSize="large"
                      color={inInnerPort ? "secondary" : "primary"}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
          </AccordionDetails>
        </Accordion>
      </Container>
    </Slide>
  );
};

export default Burst;
