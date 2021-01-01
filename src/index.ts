import { app, BrowserWindow, ipcMain } from "electron";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;


// const SerialPort: any = require('serialport');
// const Readline: any = require('@serialport/parser-readline');



// // TODO: Add serialport types.
// const getArduinoPort = async (): Promise<string> => {
//   const ports: any = await SerialPort.list();
//   const arduinoPort: any = ports.filter((port: any): boolean => port.manufacturer.includes("Arduino"))[0];
//   return arduinoPort.path;
// };


// ipcMain.on("Start-Arduino-Communication", (event, arg) => {    
//   getArduinoPort().then((portPath: string) => {
//     const port: any = new SerialPort(portPath, {
//       baudRate: 9600
//     });

//     const parser: any = new Readline();
//     port.pipe(parser);

//     parser.on('data', (data: any) => {
//       console.log(data);
//       event.reply("Arduino-Data", data);
//     });
//   }).catch(console.log);  
// });


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

  // Open the DevTools.
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
