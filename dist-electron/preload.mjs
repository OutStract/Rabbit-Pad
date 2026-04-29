"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // You can expose other APTs you need here.
  // ...
  hi: () => electron.ipcRenderer.invoke("hi"),
  tree: (path) => electron.ipcRenderer.invoke("tree", path),
  file: (path) => electron.ipcRenderer.invoke("file", path),
  write: (path, content) => electron.ipcRenderer.invoke("write", path, content),
  create: (dirPath, content, name) => electron.ipcRenderer.invoke("create", dirPath, content, name),
  delete: (dirPath, filePath) => electron.ipcRenderer.invoke("delete", dirPath, filePath)
});
