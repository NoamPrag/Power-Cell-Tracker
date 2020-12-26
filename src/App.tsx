import React, { useState, useEffect } from "react";
import ScatterTab from "./ScatterTab";
import MenuAppBar from "./NavBar";
import { dataGenerator } from "./DataGenerator";
import { BurstData, Position, BurstCoordinates } from "./Burst";


import { ipcRenderer } from "electron";


ipcRenderer.send("Start-Arduino-Communication", "");



export type Tab = "Scatter" | "Arduino" | "Stats";

let newBurstArray: BurstCoordinates = [];

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const App = () => {
  const forceUpdate = useForceUpdate();

  const [data, setData] = useState<BurstData[]>(dataGenerator(6));

  const [incomingBurst, setIncomingBurst] = useState<BurstCoordinates>([]);
  
  const [tab, setTab] = useState<Tab>("Scatter");

  useEffect(() => {
    ipcRenderer.on("Arduino-Data", (event, arg: string) => {
      const newBallData: number[] = arg.split(",").map(numStr => parseFloat(numStr));
      const ballPosition: Position = {x: newBallData[1], y: newBallData[2]};
      // newBurstArray.push(ballPosition);

      setIncomingBurst(prev => [...prev, ballPosition]);

      console.log(ballPosition);

      if(incomingBurst.length == 5) {
        const newBurst: BurstData = {
          burstNumber: data.length,
          burstCoordinates: incomingBurst,
        };
        console.log(newBurst);
        // setData(prevData => [...prevData, newBurst]);
        setData(prevData => [...prevData, newBurst]);
        // newBurstArray = [];
        setIncomingBurst([]);
        forceUpdate();
      }
    });

  }, []);

  return <div>
    <MenuAppBar setTab={tab => setTab(tab)}/>
    {tab === "Scatter" && <ScatterTab data={data} setData={(data) => setData(data)}/>}
    {tab === "Arduino" && <h1 style={{position: "absolute", top: 100, left: 50}}>Arduino Tab</h1>}
    {tab === "Stats" && <h1 style={{position: "absolute", top: 100, left: 50}}>Stats Tab</h1>}
  </div>
}

export default App;