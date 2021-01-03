import React, { useState } from "react";
import {
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Container,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import SportsSoccerIcon from "@material-ui/icons/SportsSoccer";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import GrainIcon from "@material-ui/icons/Grain";
import ProgressBar from "./ProgressBar";
import { getDistance, zeroPosition } from "./Calculations";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

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
  changeOpen?: () => void;
}): JSX.Element => {
  const [opened, setOpened] = useState(false);

  return (
    <Container maxWidth="sm" style={{ margin: "10px 0" }}>
      <Accordion>
        <ThemeProvider theme={tabTheme}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            onClick={() => {
              setOpened((current: boolean): boolean => !current);
              props.changeOpen();
            }}
          >
            <Typography variant="h5" style={{ color: props.color }}>
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
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "95%",
                padding: "0 10px",
              }}
            >
              <GpsFixedIcon />
              <ProgressBar value={props.burst.accuracy} show={opened} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "95%",
                padding: "0 10px",
              }}
            >
              <GrainIcon />
              <ProgressBar value={props.burst.precision} show={opened} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {props.burst.inInnerPort.map(
                (inInnerPort: boolean, index: number): JSX.Element => (
                  <SportsSoccerIcon
                    key={index}
                    fontSize="large"
                    color={inInnerPort ? "secondary" : "primary"}
                  />
                )
              )}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default Burst;
