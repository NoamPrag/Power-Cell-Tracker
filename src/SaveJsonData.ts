import { dialog, ipcMain, ipcRenderer } from "electron";

import { BurstData } from "./Burst";

import fs from "fs";

export interface FileData {
  readonly totalAccuracy: number;
  readonly totalPrecision: number;
  readonly bursts: BurstData[];
}

export const requestFileSave = (data: FileData): void =>
  ipcRenderer.send("Save-Data-File", data);

const getPath = async (): Promise<string | null> =>
  dialog
    .showSaveDialog({})
    .then(
      (res: Electron.SaveDialogReturnValue) =>
        res?.canceled ? null : res?.filePath // return null if cenceled
    )
    .catch(null);

const saveData = (data: FileData, path: string): void => {
  const jsonData: string = JSON.stringify(data);
  fs.writeFile(path, jsonData, () => {});
};

export const handleDataSaveRequest = () =>
  ipcMain.on(
    "Save-Data-File",
    async (ipcEvent: Electron.IpcMainEvent, data: FileData) => {
      const filePath: string | null = await getPath();

      if (filePath === null) {
        ipcEvent.reply("Couldnt-Save-File", null);
        return; // return if there's no file path
      }

      saveData(data, filePath);
      ipcEvent.reply("File-Saved", null);
    }
  );
