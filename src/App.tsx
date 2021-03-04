import React, { useState, useEffect } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import ScatterTab from "./ScatterTab";
import MenuAppBar from "./NavBar";

import { BurstData } from "./Burst";

import { dataGenerator } from "./DataGenerator";
import { accuracy, inInnerPort, precision, Position } from "./Analytics";

import { ipcRenderer } from "electron";
import { ArduinoMsg } from "./index";

export type Tab = "Scatter" | "Arduino" | "Stats";

ipcRenderer.send("Start-Arduino-Communication", null);

const Alert = (props: AlertProps): JSX.Element => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const App = (): JSX.Element => {
  const [data, setData] = useState<BurstData[]>(dataGenerator(6));

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
    if (data.length <= 0) {
      setTotalAccuracy(0);
      setTotalPrecision(0);
      return;
    }

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

  console.log(newBurstCoordinates);

  // set data on every arduino message
  useEffect((): void => {
    ipcRenderer.on("Arduino-Data", (_: never, message: ArduinoMsg): void => {
      setNewBurstCoordinates((prevNewBurst: Position[]): Position[] => [
        ...prevNewBurst,
        message.coordinates,
      ]);
      if (message.errorCode !== 0) openAlert(message.errorCode);
    });

    ipcRenderer.on(
      "Merge-New-Burst",
      (_: never, coordinates: Position[]): void => {
        setData((prevData: BurstData[]): BurstData[] => [
          ...prevData,
          {
            burstCoordinates: coordinates,
            burstNumber: prevData.length + 1,
            inInnerPort: coordinates.map(inInnerPort),
            accuracy: accuracy(coordinates),
            precision: precision(coordinates),
          },
        ]);
        setNewBurstCoordinates([]);
      }
    );
  }, []);

  const [tab, setTab] = useState<Tab>("Scatter");

  return (
    <>
      <MenuAppBar setTab={(newTab: Tab): void => setTab(newTab)} />

      {tab === "Scatter" && (
        <ScatterTab
          data={data}
          newBurst={newBurstCoordinates}
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
