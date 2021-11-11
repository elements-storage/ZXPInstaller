import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as remote from '@electron/remote/main'

remote.initialize()

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit())

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.whenReady().then(() => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 550,
    resizable: false,
    maximizable: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.resolve(__dirname, 'index.html'))

  remote.enable(mainWindow.webContents)

  // Open the devtools.
  // mainWindow.openDevTools();
})
