import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { ipcRenderer } from "electron";


// const reply: string = ipcRenderer.sendSync("synchronous-message", "ping?");
// console.log(reply);

ipcRenderer.send("asynchronous-message", "Hello World!");

ipcRenderer.on("asynchronous-reply", (event, arg: any) => {
    console.log(arg);
});


ReactDOM.render(<App />, document.getElementById("root"));

console.log("Render process!");