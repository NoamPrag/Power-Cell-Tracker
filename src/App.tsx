import React, { useState, useEffect } from "react";
import ScatterTab from "./ScatterTab";
import MenuAppBar from "./NavBar";
import { dataGenerator } from "./DataGenerator";
import { BurstCoordinates, BurstData } from "./Burst";

// import { ipcRenderer } from "electron";

// import { ipcRenderer } from "electron";


// ipcRenderer.send("Start-Arduino-Communication", "");



export type Tab = "Scatter" | "Arduino" | "Stats";

// ipcRenderer.send ("Start-Arduino-Communication", null);

const useForceUpdate = (): (() => void) => {
  const [_value, setValue] = useState(0);
  return (): void => setValue((prev: number): number => prev + 1);
};

const App = () => {
  const [data, setData] = useState<BurstData[]>(dataGenerator(30));

  const [incomingBurst, setIncomingBurst] = useState<BurstCoordinates>([]);
  
  const [tab, setTab] = useState<Tab>("Scatter");

  const forceUpdate: () => void = useForceUpdate();

  // useEffect((): void => {
  //   ipcRenderer.on(
  //     "Arduino-Data",
  //     (
  //       _event: Electron.IpcRendererEvent,
  //       burstCoordinates: BurstCoordinates
  //     ): void => {
  //       setData((prevData: BurstData[]): BurstData[] => {
  //         const newBurst: BurstData = {
  //           burstCoordinates,
  //           burstNumber: prevData.length + 1,
  //         };
  //         console.log(newBurst);
  //         return [...prevData, newBurst];
  //       });

  //       forceUpdate();
  //     }
  //   );
  // }, []);

  return (
    <div>
      <MenuAppBar setTab={(newTab: Tab): void => setTab(newTab)} />

      {tab === "Scatter" && (
        <ScatterTab
          data={data}
          setData={(
            newData: BurstData[] | ((func: BurstData[]) => BurstData[])
          ): void => setData(newData)}
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
    </div>
  );
};

export default App;
