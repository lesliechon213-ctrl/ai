const { contextBridge, ipcRenderer } = require("electron");

function invoke(method, payload) {
  return ipcRenderer.invoke(`db:${method}`, payload);
}

contextBridge.exposeInMainWorld("superEmployeeDb", {
  getAllData: () => invoke("getAllData"),
  createCustomer: (payload) => invoke("createCustomer", payload),
  createTask: (payload) => invoke("createTask", payload),
  createMaterial: (payload) => invoke("createMaterial", payload),
  cycleCustomerStatus: (id) => invoke("cycleCustomerStatus", id),
  cycleTaskStatus: (id) => invoke("cycleTaskStatus", id),
  deleteCustomer: (id) => invoke("deleteCustomer", id),
  deleteTask: (id) => invoke("deleteTask", id),
  deleteMaterial: (id) => invoke("deleteMaterial", id),
  clearData: () => invoke("clearData"),
  importData: (payload) => invoke("importData", payload),
});

contextBridge.exposeInMainWorld("desktopRuntime", {
  isElectron: true,
});
