import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...

  hi: () => ipcRenderer.invoke('hi'),

  tree: (path) => ipcRenderer.invoke('tree', path),

  file: (path) => ipcRenderer.invoke('file', path),

  write: (path, content) => ipcRenderer.invoke('write', path, content),

  create: (dirPath, content, name) => ipcRenderer.invoke('create', dirPath, content, name),

  delete: (dirPath, filePath) => ipcRenderer.invoke('delete', dirPath, filePath )

})
