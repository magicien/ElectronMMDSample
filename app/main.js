import electron, {app, BrowserWindow, crashReporter} from 'electron'

if(process.env.NODE_ENV === 'develop'){
  crashReporter.start()
}

const rootPath = `file://${__dirname}`
let mainWindow = null

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(`${rootPath}/index.html`)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

