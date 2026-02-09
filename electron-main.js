
const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * SGF - Vida Saudável
 * Desktop Entry Point
 */

function createSystemWindow() {
  const mainWin = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 720,
    title: 'SGF - Vida Saudável v1.0',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1e293b',
      symbolColor: '#ffffff'
    },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Local development or build path
  mainWin.loadURL('http://localhost:3000'); 
  
  mainWin.on('page-title-updated', (e) => e.preventDefault());
}

app.whenReady().then(() => {
  createSystemWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSystemWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
