import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { hi } from './utils/hi.ts'
import { dirTree, readDoc, writeFile, createFile, deleteFile, nameChange, createFolder, moveDir } from './utils/fileHandling.ts'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

ipcMain.handle('hi', ()=> {
  return hi()
})

ipcMain.handle('tree', (_, path) => {
  console.log('tree called with path:', path)
  return dirTree(path)
})

ipcMain.handle('file', async (_, path) => {
  console.log('file called with path:', path)
  const result = await readDoc(path)
  return result
})

ipcMain.handle('write', (_, path, content) => {
  console.log('Write called with path:', path)
  return writeFile(path, content)
})

ipcMain.handle('create', (_, dirPath, content, name) => {
  console.log('Create called with path:', dirPath)
  const newPath = createFile(dirPath, content, name)
  return {success: true, newPath}
})

ipcMain.handle('createFolder', (_, dirPath, name) => {
  console.log('CreateFolder called with path:', dirPath)
  return createFolder(dirPath, name)
})

ipcMain.handle('delete', (_, dirPath, filePath) => {
  console.log('Delete called with path:', filePath)
  return deleteFile(dirPath, filePath)
})

ipcMain.handle('changeName', async (_, dirPath, name) => {
  console.log('Rename called with path: ', dirPath)
  const newPath = await nameChange(dirPath, name)
  return { success: true, newPath }
})

ipcMain.handle('move', async (_, source, destination) => {
  console.log("Moved File to path:", destination)
  const result = await moveDir(source, destination)
  return result
})

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
