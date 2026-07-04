const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const statusOrder = ["pending", "active", "done", "cancelled"];

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nowText() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function nextStatus(current) {
  return statusOrder[(statusOrder.indexOf(current) + 1) % statusOrder.length] || "pending";
}

function createDatabase(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "super_employee_local.db");
  const db = new DatabaseSync(dbPath);

  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      platform TEXT NOT NULL,
      source TEXT,
      tags TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      scheduled_at TEXT,
      content TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      local_path TEXT,
      content TEXT,
      tags TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS operation_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      message TEXT,
      created_at TEXT NOT NULL
    );
  `);

  seedIfEmpty();

  function seedIfEmpty() {
    const count = db.prepare("SELECT COUNT(*) AS total FROM customers").get().total;
    if (count > 0) return;

    const date = today();
    db.exec("BEGIN IMMEDIATE TRANSACTION");
    try {
      db.prepare(`
        INSERT INTO customers (id, name, platform, source, tags, status, note, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(uid("cus"), "示例客户", "抖音", "关键词获客", "高意向,待跟进", "active", "从评论区进入，关注短视频获客", date, date);

      db.prepare(`
        INSERT INTO tasks (id, title, type, status, scheduled_at, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(uid("task"), "整理第一批客户话术", "跟进", "pending", date, "先沉淀 5 条常用回复，不接入自动发送", date, date);

      db.prepare(`
        INSERT INTO materials (id, type, title, local_path, content, tags, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(uid("mat"), "文案", "首条私信模板", "", "你好，看到你对这个话题感兴趣，可以先了解一下这个方案。", "私信,通用", date, date);

      insertLog("初始化数据", "创建本地 SQLite 数据库");
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  function insertLog(action, message) {
    db.prepare(`
      INSERT INTO operation_logs (id, action, message, created_at)
      VALUES (?, ?, ?, ?)
    `).run(uid("log"), action, message || "", nowText());
  }

  function toCustomer(row) {
    return {
      id: row.id,
      name: row.name,
      platform: row.platform,
      source: row.source || "",
      tags: row.tags || "",
      status: row.status,
      note: row.note || "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  function toTask(row) {
    return {
      id: row.id,
      title: row.title,
      type: row.type,
      status: row.status,
      scheduledAt: row.scheduled_at || "",
      content: row.content || "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  function toMaterial(row) {
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      localPath: row.local_path || "",
      content: row.content || "",
      tags: row.tags || "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  function getAllData() {
    return {
      dbPath,
      data: {
        customers: db.prepare("SELECT * FROM customers ORDER BY updated_at DESC, created_at DESC").all().map(toCustomer),
        tasks: db.prepare("SELECT * FROM tasks ORDER BY scheduled_at DESC, updated_at DESC").all().map(toTask),
        materials: db.prepare("SELECT * FROM materials ORDER BY created_at DESC").all().map(toMaterial),
        logs: db.prepare("SELECT id, action, message, created_at AS createdAt FROM operation_logs ORDER BY rowid DESC LIMIT 50").all(),
      },
    };
  }

  function createCustomer(payload) {
    const date = today();
    db.prepare(`
      INSERT INTO customers (id, name, platform, source, tags, status, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uid("cus"), payload.name, payload.platform, payload.source || "", payload.tags || "", payload.status || "pending", payload.note || "", date, date);
    insertLog("新增客户", payload.name);
    return getAllData();
  }

  function createTask(payload) {
    const date = today();
    db.prepare(`
      INSERT INTO tasks (id, title, type, status, scheduled_at, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uid("task"), payload.title, payload.type, payload.status || "pending", payload.scheduledAt || date, payload.content || "", date, date);
    insertLog("新增任务", payload.title);
    return getAllData();
  }

  function createMaterial(payload) {
    const date = today();
    db.prepare(`
      INSERT INTO materials (id, type, title, local_path, content, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uid("mat"), payload.type, payload.title, payload.localPath || "", payload.content || "", payload.tags || "", date, date);
    insertLog("新增素材", payload.title);
    return getAllData();
  }

  function cycleCustomerStatus(id) {
    const row = db.prepare("SELECT id, name, status FROM customers WHERE id = ?").get(id);
    if (!row) return getAllData();
    db.prepare("UPDATE customers SET status = ?, updated_at = ? WHERE id = ?").run(nextStatus(row.status), today(), id);
    insertLog("更新客户状态", row.name);
    return getAllData();
  }

  function cycleTaskStatus(id) {
    const row = db.prepare("SELECT id, title, status FROM tasks WHERE id = ?").get(id);
    if (!row) return getAllData();
    db.prepare("UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?").run(nextStatus(row.status), today(), id);
    insertLog("更新任务状态", row.title);
    return getAllData();
  }

  function deleteCustomer(id) {
    db.prepare("DELETE FROM customers WHERE id = ?").run(id);
    insertLog("删除客户", id);
    return getAllData();
  }

  function deleteTask(id) {
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    insertLog("删除任务", id);
    return getAllData();
  }

  function deleteMaterial(id) {
    db.prepare("DELETE FROM materials WHERE id = ?").run(id);
    insertLog("删除素材", id);
    return getAllData();
  }

  function clearData() {
    db.exec("BEGIN IMMEDIATE TRANSACTION");
    try {
      db.exec(`
        DELETE FROM customers;
        DELETE FROM tasks;
        DELETE FROM materials;
        DELETE FROM operation_logs;
      `);
      db.exec("COMMIT");
      insertLog("清空数据", "已清空本地 SQLite 数据");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
    return getAllData();
  }

  function importData(payload) {
    const customers = Array.isArray(payload.customers) ? payload.customers : [];
    const tasks = Array.isArray(payload.tasks) ? payload.tasks : [];
    const materials = Array.isArray(payload.materials) ? payload.materials : [];
    const logs = Array.isArray(payload.logs) ? payload.logs : [];

    db.exec("BEGIN IMMEDIATE TRANSACTION");
    try {
      db.exec(`
        DELETE FROM customers;
        DELETE FROM tasks;
        DELETE FROM materials;
        DELETE FROM operation_logs;
      `);

      const customerInsert = db.prepare(`
        INSERT INTO customers (id, name, platform, source, tags, status, note, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const item of customers) {
        customerInsert.run(item.id || uid("cus"), item.name || "未命名客户", item.platform || "其他", item.source || "", item.tags || "", item.status || "pending", item.note || "", item.createdAt || today(), item.updatedAt || today());
      }

      const taskInsert = db.prepare(`
        INSERT INTO tasks (id, title, type, status, scheduled_at, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const item of tasks) {
        taskInsert.run(item.id || uid("task"), item.title || "未命名任务", item.type || "跟进", item.status || "pending", item.scheduledAt || today(), item.content || "", item.createdAt || today(), item.updatedAt || today());
      }

      const materialInsert = db.prepare(`
        INSERT INTO materials (id, type, title, local_path, content, tags, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const item of materials) {
        materialInsert.run(item.id || uid("mat"), item.type || "文案", item.title || "未命名素材", item.localPath || "", item.content || "", item.tags || "", item.createdAt || today(), item.updatedAt || today());
      }

      const logInsert = db.prepare(`
        INSERT INTO operation_logs (id, action, message, created_at)
        VALUES (?, ?, ?, ?)
      `);
      for (const item of logs.slice(0, 100)) {
        logInsert.run(item.id || uid("log"), item.action || "历史记录", item.message || "", item.createdAt || nowText());
      }

      insertLog("导入数据", "JSON 数据已写入 SQLite");
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
    return getAllData();
  }

  return {
    dbPath,
    getAllData,
    createCustomer,
    createTask,
    createMaterial,
    cycleCustomerStatus,
    cycleTaskStatus,
    deleteCustomer,
    deleteTask,
    deleteMaterial,
    clearData,
    importData,
    close: () => db.close(),
  };
}

module.exports = { createDatabase };
