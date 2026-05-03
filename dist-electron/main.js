import { ipcMain, app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import fs from "fs";
import path from "path";
function hi() {
  return "Hello from Node";
}
function dirTree(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push({
        name: entry.name,
        type: "folder",
        path: fullPath,
        children: dirTree(fullPath)
        // recursion returns data now
      });
    } else {
      result.push({
        name: entry.name,
        type: "file",
        path: fullPath
      });
    }
  }
  return result;
}
async function readDoc(path2) {
  try {
    const doc = await fs.promises.readFile(path2, "utf8");
    return { ok: true, value: doc };
  } catch (err) {
    console.log(err);
    return { ok: false, value: "" };
  }
}
async function writeFile(path2, content) {
  const tempPath = path2 + ".tmp";
  try {
    await fs.promises.writeFile(tempPath, content, "utf-8");
    await fs.promises.rename(tempPath, path2);
    console.log("File saved");
  } catch (err) {
    console.log(err);
  }
}
function createFile(dirPath, content, name) {
  let filePath = path.join(dirPath, `${name}.md`);
  let i = 1;
  try {
    while (fs.existsSync(filePath)) {
      filePath = path.join(dirPath, `${name}-${i}.md`);
      i++;
    }
    fs.writeFileSync(filePath, content);
    return filePath;
  } catch (err) {
    console.log(err);
  }
}
async function createFolder(dirPath, name) {
  let folderPath = path.join(dirPath, name);
  let i = 1;
  while (fs.existsSync(folderPath)) {
    folderPath = path.join(dirPath, `${name}-${i}`);
    i++;
  }
  try {
    await fs.promises.mkdir(folderPath);
  } catch (err) {
    console.log(err);
  }
}
async function deleteFile(dirPath, filePath) {
  let trashPath = path.join(dirPath, ".trash");
  let i = 1;
  const fileName = path.basename(filePath);
  let newName = fileName;
  console.log("dirPath: ", dirPath);
  console.log("filePath: ", filePath);
  try {
    if (!fs.existsSync(trashPath)) {
      fs.mkdirSync(trashPath);
    }
    while (fs.existsSync(path.join(trashPath, newName))) {
      newName = `${i}-${fileName}`;
      i++;
    }
    const finalPath = path.join(trashPath, newName);
    console.log("filePath inside try: ", filePath);
    console.log("finalPath: ", finalPath);
    await fs.promises.rename(filePath, finalPath);
    console.log("File moved to: ", finalPath);
  } catch (err) {
    console.log(err);
  }
}
async function nameChange(dirPath, name) {
  const titleSplit = dirPath.split(/[\\/]/);
  titleSplit.pop();
  console.log("lastIndex", titleSplit);
  let newName = path.join(...titleSplit, name);
  console.log("New Name ", newName);
  let i = 1;
  try {
    while (fs.existsSync(newName)) {
      newName = path.join(...titleSplit, `${i}-${name}`);
      i++;
    }
    await fs.promises.rename(dirPath, newName);
    return newName;
  } catch (err) {
    console.log(err);
  }
}
async function moveDir(source, destination) {
  const sourceArr = source.split(/[\\/]/);
  const sourceName = sourceArr.pop();
  console.log("SourceName", sourceName);
  let i = 1;
  let newPath = path.join(destination, sourceName);
  console.log("newPath: ", newPath);
  try {
    while (fs.existsSync(newPath)) {
      newPath = path.join(destination, `${i}-${sourceName}`);
      i++;
      console.log("Renamed Path :", newPath);
    }
    await fs.promises.rename(source, newPath);
    return { ok: true, path: newPath };
  } catch (err) {
    console.log(err);
    return { ok: false, error: err };
  }
}
createRequire(import.meta.url);
const __dirname$1 = path$1.dirname(fileURLToPath(import.meta.url));
ipcMain.handle("hi", () => {
  return hi();
});
ipcMain.handle("tree", (_, path2) => {
  console.log("tree called with path:", path2);
  return dirTree(path2);
});
ipcMain.handle("file", async (_, path2) => {
  console.log("file called with path:", path2);
  const result = await readDoc(path2);
  return result;
});
ipcMain.handle("write", (_, path2, content) => {
  console.log("Write called with path:", path2);
  return writeFile(path2, content);
});
ipcMain.handle("create", (_, dirPath, content, name) => {
  console.log("Create called with path:", dirPath);
  const newPath = createFile(dirPath, content, name);
  return { success: true, newPath };
});
ipcMain.handle("createFolder", (_, dirPath, name) => {
  console.log("CreateFolder called with path:", dirPath);
  return createFolder(dirPath, name);
});
ipcMain.handle("delete", (_, dirPath, filePath) => {
  console.log("Delete called with path:", filePath);
  return deleteFile(dirPath, filePath);
});
ipcMain.handle("changeName", async (_, dirPath, name) => {
  console.log("Rename called with path: ", dirPath);
  const newPath = await nameChange(dirPath, name);
  return { success: true, newPath };
});
ipcMain.handle("move", async (_, source, destination) => {
  console.log("Moved File to path:", destination);
  const result = await moveDir(source, destination);
  return result;
});
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
