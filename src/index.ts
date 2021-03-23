import { app, BrowserWindow, ipcMain } from "electron";
import { Position } from "./Analytics";
import { handleDataSaveRequest } from "./SaveJsonData";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

export interface ArduinoMsg {
  readonly coordinates: Position;
  readonly errorCode: number;
}
// TODO: make ArduinoTestData interface

// Arduino Communications:

const SerialPort: any = require("serialport");
const Readline: any = require("@serialport/parser-readline");

const timeToDeclareBurst: number = 2000; // burst is done after 2 seconds without new power cells

let newBurstCoordinates: Position[] = [];

let lastPowerCellTime: number = Date.now();

// TODO: Add serialport types.
const getArduinoPort = async (): Promise<string> => {
  const ports: any = await SerialPort.list();
  const arduinoPort: any = ports.filter((port: any): boolean =>
    port.manufacturer.includes("Arduino")
  )[0];
  return arduinoPort.path;
};

ipcMain.on("Start-Arduino-Communication", (ipcEvent: Electron.IpcMainEvent) => {
  getArduinoPort()
    .then((portPath: string): void => {
      const port: any = new SerialPort(portPath, {
        baudRate: 115200,
      });

      const parser: any = new Readline();
      port.pipe(parser);

      parser.on("data", (data: any): void => {
        const [x, y, errorCode]: [number, number, number] = data
          .split(",")
          .slice(0, 3)
          .map(parseFloat);

        const coordinates: Position = { x, y };

        newBurstCoordinates = [...newBurstCoordinates, coordinates];

        const msg: ArduinoMsg = { coordinates, /*errorCode*/ errorCode: 0 }; // errorCode not implemented yet on arduino

        lastPowerCellTime = Date.now();

        ipcEvent.reply("Arduino-Data", msg);

        setTimeout((): void => {
          // Checking if there has been another power cell
          if (lastPowerCellTime <= Date.now() - timeToDeclareBurst) {
            ipcEvent.reply("Merge-New-Burst", [...newBurstCoordinates]); // Sending the new burst's coordinates
            console.log("New Burst! :)");
            newBurstCoordinates = []; // Resetting the new burst array
          }
        }, timeToDeclareBurst);

        console.log(`New Power Cell! ${coordinates.x} ${coordinates.y}`);
      });
    })
    .catch(console.log);
});

// Save power cell data to JSON when render process sends request via ipc
handleDataSaveRequest();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1100,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open DevTools.
  // mainWindow.webContents.openDevTools();

  // set full screen
  mainWindow.setFullScreen(true);

  mainWindow.setMenuBarVisibility(false);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
