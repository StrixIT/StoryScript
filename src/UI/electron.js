const path = require('path');
const { app, BrowserWindow } = require('electron');

let win;

function createWindow () {
  let distPath = path.resolve(__dirname, '../../dist');

  // Create the browser window.
  win = new BrowserWindow({
    width: 600, 
    height: 670,
    icon: `file://${distPath}/resources/logo.png`
  })

  win.loadURL(`file://${distPath}/index.html`)

  // uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})