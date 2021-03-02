import React, { useState, useEffect } from "react";
import ScatterTab from "./ScatterTab";
import MenuAppBar from "./NavBar";
import { dataGenerator } from "./DataGenerator";
import { BurstData, Position } from "./Burst";
import { accuracy, inInnerPort, precision } from "./calculations";

import { Snackbar } from "@material-ui/core";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { ipcRenderer } from "electron";
import { ArduinoMsg, TimeOutMsg } from "./index";

export type Tab = "Scatter" | "Arduino" | "Stats";

ipcRenderer.send("Start-Arduino-Communication", null);

const Alert = (props: AlertProps): JSX.Element => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const App = (): JSX.Element => {
  const [data, setData] = useState<BurstData[]>(dataGenerator(0));

  const [totalAccuracy, setTotalAccuracy] = useState<number>(0);
  const [totalPrecision, setTotalPrecision] = useState<number>(0);

  const [alertStatus, setAlertStatus] = useState<{
    opened: boolean;
    pin: number;
  }>({ opened: false, pin: null });

  const openAlert = (pin: number) => setAlertStatus({ opened: true, pin });
  const closeAlert = (_: any, reason?: string): void => {
    if (reason !== "clickaway")
      setAlertStatus({ ...alertStatus, opened: false });
  };

  // update accuracy and precision according to data
  useEffect(() => {
    if (data.length <= 0) return;

    const allPositions: Position[] = data.reduce(
      (acc: Position[], curr: BurstData): Position[] => [
        ...acc,
        ...curr.burstCoordinates,
      ],
      []
    );
    setTotalAccuracy(accuracy(allPositions));
    setTotalPrecision(precision(allPositions));
  }, [data]);

  const [newBurstCoordinates, setNewBurstCoordinates] = useState<Position[]>(
    []
  );

  // set data on every arduino message
  useEffect((): void => {
    ipcRenderer.on("Arduino-Data", (_, message: ArduinoMsg): void => {
      setNewBurstCoordinates((prevNewBurst: Position[]): Position[] => {
        ipcRenderer.send("Data-Received", prevNewBurst.length + 1); // +1 because the new one is added right after

        return [...prevNewBurst, message.coordinates];
      });

      console.log("New Power Cell! :)");

      if (message.errorCode !== 0) openAlert(message.errorCode);
    });

    ipcRenderer.on("Time-Out", (_, message: TimeOutMsg): void => {
      setNewBurstCoordinates(
        (prevNewBurstCoordinates: Position[]): Position[] => {
          if (message.numOfPowerCells !== prevNewBurstCoordinates.length)
            return prevNewBurstCoordinates; // Not last power cell in the burst

          setData((prevData) => {
            const newBurst: BurstData = {
              burstCoordinates: prevNewBurstCoordinates,
              burstNumber: prevData.length + 1,
              inInnerPort: prevNewBurstCoordinates.map(inInnerPort),
              accuracy: accuracy(prevNewBurstCoordinates),
              precision: precision(prevNewBurstCoordinates),
            };

            return [...prevData, newBurst];
          });
          console.log("New Burst Added! :)");

          return [];
        }
      );
    });
  }, []);

  const [tab, setTab] = useState<Tab>("Scatter");

  return (
    <>
      <MenuAppBar setTab={(newTab: Tab): void => setTab(newTab)} />

      {tab === "Scatter" && (
        <ScatterTab
          data={data}
          setData={(
            newData: BurstData[] | ((func: BurstData[]) => BurstData[])
          ): void => setData(newData)}
          totalAccuracy={totalAccuracy}
          totalPrecision={totalPrecision}
        />
      )}

      {/* {tab === "Arduino" && (
        <h1 style={{ position: "absolute", top: 100, left: 50 }}>
          Arduino Tab
        </h1>
      )}

      {tab === "Stats" && (
        <h1 style={{ position: "absolute", top: 100, left: 50 }}>Stats Tab</h1>
      )} */}

      <Snackbar
        open={alertStatus.opened}
        autoHideDuration={5000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={closeAlert} severity="error">
          Arduino Error: pin #{alertStatus.pin}
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
