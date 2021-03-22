import { app, BrowserWindow, ipcMain } from "electron";
import { Position } from "./Analytics";
import { dataGenerator } from "./DataGenerator";
import { handleDataSaveRequest } from "./SaveJsonData";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

export interface ArduinoMsg {
  readonly coordinates: Position;
  readonly errorCode: number;
}

const powerCellMaxInterval: number = 1000;
const powerCellMinInterval: number = 200;

const minPowerCellQuantity: number = 3;
const maxPowerCellQuantity: number = 7;

const burstMinInterval: number =
  maxPowerCellQuantity * powerCellMaxInterval + 1000;
const burstMaxInterval: number = 15000;

// TODO: Add power cells that pass 3 seconds but don't go beyond 6
const timeToDeclareBurst: number = burstMinInterval - 2500; // Will be about 3 seconds with real robot

let newBurstCoordinates: Position[] = [];

let lastPowerCellTime: number = Date.now();

ipcMain.on(
  "Start-Arduino-Communication",
  (ipcEvent: Electron.IpcMainEvent): void => {
    const newPowerCell = (): void => {
      // Read data from Arduino
      const coordinates: Position = dataGenerator(1)[0].burstCoordinates[0];
      const errorCode: number = 0;

      // Send data to renderer
      const msg: ArduinoMsg = { coordinates, errorCode };
      ipcEvent.reply("Arduino-Data", msg);

      console.log("New Power Cell! :)");

      newBurstCoordinates = [...newBurstCoordinates, coordinates];

      lastPowerCellTime = Date.now();

      setTimeout((): void => {
        // Checking if there has been another power cell
        if (lastPowerCellTime <= Date.now() - timeToDeclareBurst) {
          ipcEvent.reply("Merge-New-Burst", [...newBurstCoordinates]); // Sending the new burst's coordinates
          console.log("Merge New Burst! :)");
          newBurstCoordinates = []; // Resetting the new burst array
        }
      }, timeToDeclareBurst);
    };

    const newBurst = () => {
      setTimeout(() => {
        console.log("New Burst! :)");

        const numOfPowerCells: number =
          Math.round(
            Math.random() * (maxPowerCellQuantity - minPowerCellQuantity)
          ) + minPowerCellQuantity;

        console.log({ numOfPowerCells });

        for (let i = 0; i < numOfPowerCells; i++)
          setTimeout(
            newPowerCell,
            i * (powerCellMaxInterval - powerCellMinInterval) +
              powerCellMinInterval
          );

        newBurst(); // Infinite loop recursion
      }, Math.random() * (burstMaxInterval - burstMinInterval) + burstMinInterval);
    };

    newBurst(); // Recursion first call
  }
);

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
