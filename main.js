import { app, Menu, Tray, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconPath = path.join(__dirname, './assets/appicon.png');

let mainWin = null;
let childWin = null;
let tray = null;

function createWindow() {
  mainWin = new BrowserWindow({
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

  mainWin.loadFile('index.html'); // 加载本地页面

  tray = new Tray(iconPath);
  // 定义菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        mainWin.show();
        mainWin.focus();
      },
    },
    {
      label: '隐藏窗口',
      click: () => {
        mainWin.hide();
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
    if (mainWin.isVisible()) {
      mainWin.hide();
    } else {
      mainWin.show();
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
  if (!mainWin) {
    return;
  }
  if (mainWin.isMaximized()) {
    mainWin.unmaximize();
  } else {
    mainWin.maximize();
  }
}

ipcMain.on('window-control', (event, action) => {
  if (!mainWin) {
    return;
  }
  switch (action) {
    case 'minimize':
      mainWin.minimize();
      break;
    case 'maximize':
      ActionSize();
      break;
    case 'close':
      mainWin.close();
      break;
    default:
      break;
  }
});

// 监听渲染进程请求，打开子窗口
ipcMain.on('open-child', () => {
  if (!childWin) {
    childWin = new BrowserWindow({
      width: 400,
      height: 300,
      parent: mainWin, // 设置父窗口（可选）
      modal: false, // true = 模态窗口（阻塞父窗口）
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    childWin.loadFile('index.html');

    childWin.on('closed', () => {
      childWin = null;
    });
  } else {
    childWin.focus();
  }
});
