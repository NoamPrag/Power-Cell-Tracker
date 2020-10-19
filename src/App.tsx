import React from "react";
import ScatterTab from "./ScatterTab";
import MenuAppBar from "./NavBar";
import { dataGenerator } from "./DataGenerator";
import { BurstData } from "./Burst";

export type Tab = "Scatter" | "Arduino" | "Stats";

const App = () => {
  const [data, setData] = React.useState<BurstData[]>(dataGenerator(6));

  // const [tab, setTab] = React.useState<Tab>("Scatter");

  // const ScatterTabEl = () => <ScatterTab data={data} setData={setData}/>;


  return <div>
    <MenuAppBar />
    <ScatterTab data={data} setData={setData}/>
  </div>
}

export default App;