const path = require("node:path");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { createDatabase } = require("./database");

let mainWindow = null;
let database = null;

function registerIpc() {
  const methods = [
    "getAllData",
    "createCustomer",
    "createTask",
    "createMaterial",
    "cycleCustomerStatus",
    "cycleTaskStatus",
    "deleteCustomer",
    "deleteTask",
    "deleteMaterial",
    "clearData",
    "importData",
  ];

  for (const method of methods) {
    ipcMain.handle(`db:${method}`, (_event, payload) => database[method](payload));
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#f5f7fa",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (process.env.SUPER_EMPLOYEE_SMOKE === "1") {
    mainWindow.webContents.once("did-finish-load", () => {
      const result = database.getAllData();
      console.log(`Electron smoke OK: ${result.data.customers.length} customers, db=${result.dbPath}`);
      setTimeout(() => app.quit(), 200);
    });
  }

  mainWindow.once("ready-to-show", () => {
    if (process.env.SUPER_EMPLOYEE_SMOKE !== "1") {
      mainWindow.show();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.loadFile(path.join(__dirname, "..", "index.html"));
}

app.whenReady().then(() => {
  database = createDatabase(app.getPath("userData"));
  registerIpc();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (database) database.close();
});
