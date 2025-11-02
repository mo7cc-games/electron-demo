import { app, Menu, Tray, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconPath = path.join(__dirname, './assets/appicon.png');

let win = null;
let tray = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 去掉系统边框
    transparent: true, // 背景透明
    resizable: true, // 是否允许缩放
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程使用 Node API
      preload: path.join(__dirname, './app/preload.js'),
    },
  });

  win.loadFile('index.html'); // 加载本地页面

  tray = new Tray(iconPath);
  // 定义菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        win.show();
        win.focus();
      },
    },
    {
      label: '隐藏窗口',
      click: () => {
        win.hide();
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('我的 Electron 应用');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
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
