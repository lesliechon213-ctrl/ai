const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

const isSmokeTest = process.env.SMOKE_TEST === "1";
const isDeveloperMode = process.env.SUPER_EMPLOYEE_MODE !== "production";

if (process.env.SUPER_EMPLOYEE_DEBUG_PORT) {
  app.commandLine.appendSwitch("remote-debugging-port", process.env.SUPER_EMPLOYEE_DEBUG_PORT);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1180,
    minHeight: 760,
    frame: false,
    show: false,
    backgroundColor: "#eef4ff",
    icon: path.join(__dirname, "assets", "imgs", "logo--logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (isDeveloperMode && !isSmokeTest) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
    if (isSmokeTest) {
      console.log("SMOKE_READY");
      app.quit();
    }
  });
}

function senderWindow(event) {
  return BrowserWindow.fromWebContents(event.sender);
}

ipcMain.handle("window:minimize", (event) => {
  senderWindow(event)?.minimize();
});

ipcMain.handle("window:toggle-maximize", (event) => {
  const win = senderWindow(event);
  if (!win) return false;
  if (win.isMaximized()) {
    win.unmaximize();
    return false;
  }
  win.maximize();
  return true;
});

ipcMain.handle("window:close", (event) => {
  senderWindow(event)?.close();
});

ipcMain.handle("window:reload", (event) => {
  senderWindow(event)?.reload();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
