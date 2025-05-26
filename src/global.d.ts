type IpcRendererEvent = {
    sender: unknown;
    senderId: number;
};

declare global {
    interface Window {
        api: {
            sayHello(): () => void;
        };
    }
}

export { };
