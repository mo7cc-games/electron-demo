import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // action: "minimize" | "maximize" | "close"
  controlWindow(action) {
    ipcRenderer.send('window-control', action);
  },
  openChild() {
    ipcRenderer.send('open-child');
  },
});
