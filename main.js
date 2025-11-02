import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 去掉系统边框
    transparent: true, // 背景透明
    resizable: true, // 是否允许缩放
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程使用 Node API
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html'); // 加载本地页面
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function ActionSize() {
  if (!win) {
    return;
  }
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
}

ipcMain.on('window-control', (event, action) => {
  if (!win) {
    return;
  }
  switch (action) {
    case 'minimize':
      win.minimize();
      break;
    case 'maximize':
      ActionSize();
      break;
    case 'close':
      win.close();
      break;
    default:
      break;
  }
});
