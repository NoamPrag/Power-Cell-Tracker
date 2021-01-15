import React, { useState, useEffect } from "react";
import ScatterTab from "./ScatterTab";
import MenuAppBar from "./NavBar";
import { dataGenerator } from "./DataGenerator";
import { BurstData, Position } from "./Burst";
import { accuracy, precision } from "./calculations";

import { Snackbar, Slide } from "@material-ui/core";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { ipcRenderer } from "electron";

export type Tab = "Scatter" | "Arduino" | "Stats";

ipcRenderer.send("Start-Arduino-Communication", null);

const Alert = (props: AlertProps): JSX.Element => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const App = (): JSX.Element => {
  const [data, setData] = useState<BurstData[]>(dataGenerator(6));

  const [totalAccuracy, setTotalAccuracy] = useState<number>(0);
  const [totalPrecision, setTotalPrecision] = useState<number>(0);

  const [alertOpened, setAlertOpened] = useState(true);

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
      (_event: Electron.IpcRendererEvent, newBurst: BurstData): void => {
        setData((prevData: BurstData[]): BurstData[] => {
          newBurst.burstNumber = prevData.length + 1;
          return [...prevData, newBurst];
        });

        setAlertOpened(true);
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
        open={alertOpened}
        autoHideDuration={5000}
        onClose={(): void => {
          console.log("Closed! :)");
          setAlertOpened(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={(): void => {
            console.log("Closed! :)");
            setAlertOpened(false);
          }}
          severity="error"
        >
          Arduino Error: pin #{12 /* insert real pin */}
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
