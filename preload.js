import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // action: "minimize" | "maximize" | "close"
  controlWindow(action) {
    return ipcRenderer.send('window-control', action);
  },
});
