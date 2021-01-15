import React, { useState, useEffect } from "react";
import ScatterTab from "./ScatterTab";
import MenuAppBar from "./NavBar";
import { dataGenerator } from "./DataGenerator";
import { BurstData, Position } from "./Burst";
import { accuracy, precision } from "./calculations";

import { Snackbar } from "@material-ui/core";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

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
  const closeAlert = (_: any, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertStatus({ ...alertStatus, opened: false });
  };

  // update accuracy and precision according to data
  useEffect(() => {
    if (data.length <= 0) {
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

  // set data on every arduino message
  useEffect((): void => {
    ipcRenderer.on(
      "Arduino-Data",
      (_event: Electron.IpcRendererEvent, message: ArduinoMsg): void => {
        setData((prevData: BurstData[]): BurstData[] => {
          message.burst.burstNumber = prevData.length + 1;
          return [...prevData, message.burst];
        });

        if (message.errorCode !== 0) {
          openAlert(message.errorCode);
        }
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
          setData={(
            newData: BurstData[] | ((func: BurstData[]) => BurstData[])
          ): void => setData(newData)}
          totalAccuracy={totalAccuracy}
          totalPrecision={totalPrecision}
        />
      )}

      {tab === "Arduino" && (
        <h1 style={{ position: "absolute", top: 100, left: 50 }}>
          Arduino Tab
        </h1>
      )}

      {tab === "Stats" && (
        <h1 style={{ position: "absolute", top: 100, left: 50 }}>Stats Tab</h1>
      )}

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
