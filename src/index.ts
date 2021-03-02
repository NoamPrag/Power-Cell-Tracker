import { app, BrowserWindow, ipcMain } from "electron";
import { Position } from "./Burst";
import { dataGenerator } from "./DataGenerator";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

export interface ArduinoMsg {
  readonly coordinates: Position;
  readonly errorCode: number;
}

const burstMaxInterval: number = 15000;
const powerCellMaxInterval: number = 1000;

// TODO: Add power cells that pass 3 seconds but don't go beyond 6
const timeToDeclareBurst: number = 5500;

ipcMain.on(
  "Start-Arduino-Communication",
  (event: Electron.IpcMainEvent): void => {
    const newBurst = () => {
      setTimeout(() => {
        console.log("New Burst! :)");

        const numOfPowerCells: number = Math.round(Math.random() * 5);

        console.log({ numOfPowerCells });

        for (let i = 0; i < numOfPowerCells; i++) {
          setTimeout(() => {
            const powerCellPosition = dataGenerator(1)[0].burstCoordinates[0];
            const errorCode: number = 0;
            const msg: ArduinoMsg = {
              coordinates: powerCellPosition,
              errorCode,
            };
            event.reply("Arduino-Data", msg);

            console.log("New Power Cell! :)");
          }, i * powerCellMaxInterval);
        }

        newBurst(); // Infinite loop recursion
      }, Math.random() * burstMaxInterval + 5000);
    };

    newBurst(); // Recursion first call
  }
);

export interface TimeOutMsg {
  readonly time: number; // in posix
  readonly numOfPowerCells: number;
}

ipcMain.on(
  "Data-Received",
  (event: Electron.IpcMainEvent, currNumOfPowerCells: number): void => {
    const now: number = Date.now();
    console.log("Data-Received! :)");

    setTimeout((): void => {
      const reply: TimeOutMsg = {
        time: now,
        numOfPowerCells: currNumOfPowerCells,
      };

      console.log("Time-Out!!");
      event.reply("Time-Out", reply);
    }, timeToDeclareBurst);
  }
);

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
  mainWindow.webContents.openDevTools();

  // set full screen
  mainWindow.setFullScreen(true);
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
