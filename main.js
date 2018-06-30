const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')


/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = 'pycalcdist'
const PY_FOLDER = 'pyapi'
const PY_MODULE = 'api' // without .py suffix

let pyProc = null
let pyPort = null

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  if (!guessPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
  }
  if (process.platform === 'win32') {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

const selectPort = () => {
  pyPort = 4242
  return pyPort
}

const createPyProc = () => {
  let script = getScriptPath()
  let port = '' + selectPort()

  if (guessPackaged()) {
    pyProc = require('child_process').execFile(script, [port])
  } else {
    pyProc = require('child_process').spawn('python3', [script, port])
  }
 
  if (pyProc != null) {
    //console.log(pyProc)
    console.log('child process success on port ' + port)
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)


/*************************************************************
 * window management
 *************************************************************/


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({width: 800, height: 600, show: false})

  mainWindow.loadURL("http://localhost:3000");

  // mainWindow.loadURL(require('url').format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })


  // create a new `splash`-Window 
  splash = new BrowserWindow({width: 810, height: 610, transparent: true, frame: false, alwaysOnTop: true});
  splash.loadURL(require('url').format({
    pathname: path.join(__dirname, 'splash.html'),
    protocol: 'file:',
    slashes: true
  }))


  // if main window is ready to show, then destroy the splash window and show up the main window
  mainWindow.once('ready-to-show', () => {
    // sleep(7000);
    splash.destroy();
    console.log("working fine")
    // mainWindow.maximize()
    mainWindow.show();
 


  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
