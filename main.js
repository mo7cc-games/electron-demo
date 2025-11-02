import { app, BrowserWindow } from 'electron';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 去掉系统边框
    transparent: true, // 背景透明
    resizable: true, // 是否允许缩放
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程使用 Node API
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
