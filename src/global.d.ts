declare global {
  interface Window {}
}
import { IpcEventChannel, IpcInvokeChannel } from "../shared/ipc/contracts";

type Api = {
  invoke: <C extends IpcInvokeChannel>(channel: C, args?: any) => Promise<any>;
  on: <C extends IpcEventChannel>(
    channel: C,
    listener: (data: any) => void
  ) => () => void;
};

declare global {
  interface Window {
    api: Api;
  }
}

export {};
