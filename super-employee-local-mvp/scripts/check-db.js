const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createDatabase } = require("../electron/database");

const dataDir = path.join(os.tmpdir(), `super-employee-db-check-${Date.now()}`);
const db = createDatabase(dataDir);

db.createCustomer({
  name: "测试客户",
  platform: "其他",
  source: "自动检查",
  tags: "测试",
  status: "pending",
  note: "",
});

db.createTask({
  title: "测试任务",
  type: "跟进",
  status: "pending",
  scheduledAt: new Date().toISOString().slice(0, 10),
  content: "",
});

const result = db.getAllData();
if (!result.data.customers.length || !result.data.tasks.length || !fs.existsSync(result.dbPath)) {
  throw new Error("SQLite 数据库检查失败");
}

console.log(`SQLite OK: ${result.dbPath}`);
db.close();
