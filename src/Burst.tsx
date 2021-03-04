import React, { useState } from "react";
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
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import CountUp from "react-countup";

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
              <Typography
                variant="h5"
                style={{ color: props.color, transitionDuration: "0.7s" }}
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
              <Grid item container xs={1} justify="center">
                <GpsFixedIcon />
              </Grid>
              <Grid item container xs={3} justify="center">
                <Typography>
                  <CountUp
                    start={opened ? 0 : props.burst.accuracy}
                    end={props.burst.accuracy}
                    decimals={2}
                    prefix=" "
                    suffix="cm"
                    duration={1}
                  />
                </Typography>
              </Grid>
              <Grid item xs={1} />
              <Grid item container xs={1} justify="center">
                <GrainIcon />
              </Grid>
              <Grid item container xs={3} justify="center">
                <Typography>
                  <CountUp
                    start={opened ? 0 : props.burst.precision}
                    end={props.burst.precision}
                    decimals={2}
                    prefix=" "
                    suffix="cm"
                    duration={1}
                  />
                </Typography>
              </Grid>
              <Grid item container xs={12} justify="center" direction="row">
                {props.burst.inInnerPort.map(
                  (inInnerPort: boolean, index: number): JSX.Element => (
                    <Grid item container xs={2} justify="center" key={index}>
                      <ThemeProvider
                        theme={createMuiTheme({ palette: { primary: green } })}
                      >
                        <SportsSoccerIcon
                          fontSize="large"
                          color={inInnerPort ? "primary" : "secondary"}
                        />
                      </ThemeProvider>
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
