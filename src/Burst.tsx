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
import { accuracy, precision, getDistance, zeroPosition } from "./Calculations";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

export type Position = { x: number; y: number };
export type BurstCoordinates = [
  Position,
  Position,
  Position,
  Position,
  Position
];

export interface BurstData {
  burstNumber: number;
  color?: string;
  powerCellCondition?: "new" | "ripped";
  burstCoordinates: BurstCoordinates;
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
  open: () => void;
  close: () => void;
}) => {
  const burstAccuracy: number = accuracy(props.burst.burstCoordinates);
  const burstPrecision: number = precision(props.burst.burstCoordinates);

  const [opened, setOpened] = useState(false);

  const openBurst = () => {
    setOpened((current) => !current);
    if (!opened) {
      props.open();
    }
  };

  const closeBurst = () => {
    setOpened((current) => !current);
    if (opened) {
      props.close();
    }
  };

  return (
    <Container maxWidth="sm" style={{ margin: "10px 0" }}>
      <Accordion>
        <ThemeProvider theme={tabTheme}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            onClick={opened ? closeBurst : openBurst}
          >
            <Typography variant="h5" style={{ color: props.burst.color }}>
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
              <ProgressBar value={burstAccuracy} show={opened} />
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
              <ProgressBar value={burstPrecision} show={opened} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {props.burst.burstCoordinates.map((val, index) => {
                const color =
                  getDistance(val, zeroPosition) > 1.5
                    ? "secondary"
                    : "primary";
                return (
                  <SportsSoccerIcon
                    key={index}
                    fontSize="large"
                    color={color}
                  />
                );
              })}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default Burst;
