import React, { useState, useEffect } from "react";
import ScatterTab from "./ScatterTab";
import MenuAppBar from "./NavBar";
import { dataGenerator } from "./DataGenerator";
import { BurstData } from "./Burst";

export type Tab = "Scatter" | "Arduino" | "Stats";


// const SerialPort: any = require('serialport')
// const Readline: any = require('@serialport/parser-readline')

// TODO: Add serialport types.
// const getArduinoPort = async (): Promise<string> => {
//   const ports: any = await SerialPort.list();
//   const arduinoPort: any = ports.filter((port: any): boolean => port.manufacturer.includes("Arduino"))[0];
//   return arduinoPort.path;
// };

const App = () => {
  const [data, setData] = useState<BurstData[]>(dataGenerator(6));

  const [tab, setTab] = useState<Tab>("Scatter");

  // useEffect(() => {
  //   getArduinoPort().then((portPath: string) => {
  //     const port: any = new SerialPort(portPath, {
  //       baudRate: 9600
  //     })
  
  //     const parser: any = new Readline();
  //     port.pipe(parser);
  
  //     parser.on('data', console.log);
  //   }).catch(console.log)},
  //   []
  // );

  return <div>
    <MenuAppBar setTab={tab => setTab(tab)}/>
    {tab === "Scatter" && <ScatterTab data={data} setData={(data) => setData(data)}/>}
    {tab === "Arduino" && <h1 style={{position: "absolute", top: 100, left: 50}}>Arduino Tab</h1>}
    {tab === "Stats" && <h1 style={{position: "absolute", top: 100, left: 50}}>Stats Tab</h1>}
  </div>
}

export default App;