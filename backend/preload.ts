import { contextBridge, ipcRenderer } from "electron";
import {
  IpcEventChannel,
  IpcInvokeChannel,
  isEventChannel,
  isInvokeChannel,
} from "../shared/ipc/contracts";

// Typed API surface
const api = {
  invoke: async <C extends IpcInvokeChannel>(channel: C, args?: any) => {
    if (!isInvokeChannel(channel)) throw new Error("Invalid invoke channel");
    return ipcRenderer.invoke(channel, args);
  },
  on: <C extends IpcEventChannel>(
    channel: C,
    listener: (data: any) => void
  ) => {
    if (!isEventChannel(channel)) throw new Error("Invalid event channel");
    const wrapped = (_event: Electron.IpcRendererEvent, payload: any) =>
      listener(payload);
    ipcRenderer.on(channel, wrapped);
    return () => ipcRenderer.removeListener(channel, wrapped);
  },
};

contextBridge.exposeInMainWorld("api", api);

console.log("preload initialized");
