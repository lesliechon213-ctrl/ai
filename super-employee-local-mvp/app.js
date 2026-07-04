(function () {
  const views = [
    ["dashboard", "工作台"],
    ["customers", "客户库"],
    ["tasks", "任务库"],
    ["materials", "素材库"],
    ["settings", "设置"],
  ];
  const statusText = { pending: "待处理", active: "跟进中", done: "已完成", cancelled: "已取消" };
  const statusOrder = ["pending", "active", "done", "cancelled"];
  const fallbackKey = "super-employee-local-mvp:fallback";

  const state = {
    view: "dashboard",
    query: "",
    dbPath: "",
    data: { customers: [], tasks: [], materials: [], logs: [] },
    db: window.superEmployeeDb || createBrowserFallback(),
  };

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function createBrowserFallback() {
    function seed() {
      return {
        customers: [{ id: uid("cus"), name: "示例客户", platform: "抖音", source: "关键词获客", tags: "高意向", status: "active", note: "浏览器预览数据", createdAt: today(), updatedAt: today() }],
        tasks: [{ id: uid("task"), title: "整理第一批客户话术", type: "跟进", status: "pending", scheduledAt: today(), content: "先沉淀常用回复", createdAt: today(), updatedAt: today() }],
        materials: [{ id: uid("mat"), type: "文案", title: "首条私信模板", localPath: "", content: "你好，可以先了解一下这个方案。", tags: "私信", createdAt: today(), updatedAt: today() }],
        logs: [],
      };
    }
    function load() {
      try { return JSON.parse(localStorage.getItem(fallbackKey)) || seed(); } catch { return seed(); }
    }
    function save(data) { localStorage.setItem(fallbackKey, JSON.stringify(data)); }
    function log(data, action, message) { data.logs.unshift({ id: uid("log"), action, message, createdAt: new Date().toLocaleString("zh-CN") }); }
    function next(value) { return statusOrder[(statusOrder.indexOf(value) + 1) % statusOrder.length] || "pending"; }
    return {
      async getAllData() { return { data: load(), dbPath: "浏览器预览模式" }; },
      async createCustomer(payload) { const data = load(); data.customers.unshift({ id: uid("cus"), ...payload, createdAt: today(), updatedAt: today() }); log(data, "新增客户", payload.name); save(data); },
      async createTask(payload) { const data = load(); data.tasks.unshift({ id: uid("task"), ...payload, createdAt: today(), updatedAt: today() }); log(data, "新增任务", payload.title); save(data); },
      async createMaterial(payload) { const data = load(); data.materials.unshift({ id: uid("mat"), ...payload, createdAt: today(), updatedAt: today() }); log(data, "新增素材", payload.title); save(data); },
      async cycleCustomerStatus(id) { const data = load(); const row = data.customers.find((x) => x.id === id); if (row) row.status = next(row.status); save(data); },
      async cycleTaskStatus(id) { const data = load(); const row = data.tasks.find((x) => x.id === id); if (row) row.status = next(row.status); save(data); },
      async deleteCustomer(id) { const data = load(); data.customers = data.customers.filter((x) => x.id !== id); save(data); },
      async deleteTask(id) { const data = load(); data.tasks = data.tasks.filter((x) => x.id !== id); save(data); },
      async deleteMaterial(id) { const data = load(); data.materials = data.materials.filter((x) => x.id !== id); save(data); },
      async clearData() { save(seed()); },
      async importData(payload) { save({ customers: payload.customers || [], tasks: payload.tasks || [], materials: payload.materials || [], logs: payload.logs || [] }); },
    };
  }

  async function reload() {
    const result = await state.db.getAllData();
    state.data = result.data;
    state.dbPath = result.dbPath;
  }

  function title() {
    return views.find(([id]) => id === state.view)?.[1] || "工作台";
  }

  function filtered(list, fields) {
    const q = state.query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((row) => fields.some((field) => String(row[field] || "").toLowerCase().includes(q)));
  }

  function shell(content) {
    return `
      <div class="shell">
        <aside class="sidebar">
          <div class="brand"><div class="brand-mark">SE</div><div><div class="brand-title">超级员工</div><div class="brand-subtitle">SQLite 桌面版</div></div></div>
          <nav class="nav">${views.map(([id, name]) => `<button class="${state.view === id ? "active" : ""}" data-view="${id}"><span class="nav-icon"></span><span>${name}</span></button>`).join("")}</nav>
          <div class="sidebar-footer"><div>数据层：SQLite</div><div>远程 API：0</div><div>版本：MVP 0.2</div></div>
        </aside>
        <main class="main"><header class="topbar"><h1>${title()}</h1><div class="top-actions"><button class="btn ghost" data-action="export">导出数据</button><button class="btn primary" data-view="dashboard">回到工作台</button></div></header><section class="content">${content}</section></main>
      </div>`;
  }

  function kpi(label, value, note) {
    return `<div class="panel kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-note">${note}</div></div>`;
  }

  function dashboard() {
    const { customers, tasks, materials, logs } = state.data;
    const todayTasks = tasks.filter((x) => x.scheduledAt === today());
    return `
      <div class="grid kpi-grid">${kpi("客户总数", customers.length, "本地客户")} ${kpi("任务总数", tasks.length, "待处理 " + tasks.filter((x) => x.status === "pending").length)} ${kpi("素材总数", materials.length, "本地素材")} ${kpi("今日日程", todayTasks.length, today())}</div>
      <div class="grid two-col"><div class="panel"><div class="section-head"><h2>今日任务</h2></div><div class="section-body">${todayTasks.length ? todayTasks.map(taskItem).join("") : `<div class="empty">暂无今日任务</div>`}</div></div><div class="panel"><div class="section-head"><h2>最近记录</h2></div><div class="section-body">${logs.length ? logs.slice(0, 8).map((x) => `<div class="list-item"><div><div class="item-title">${escapeHtml(x.action)}</div><div class="item-meta">${escapeHtml(x.message)}</div></div><span class="hint-line">${escapeHtml(x.createdAt)}</span></div>`).join("") : `<div class="empty">暂无操作记录</div>`}</div></div></div>`;
  }

  function searchBar() {
    return `<div class="toolbar-right"><input class="field wide" data-action="search" value="${escapeHtml(state.query)}" placeholder="搜索" /><button class="btn ghost" data-action="reset-search">重置</button></div>`;
  }

  function customers() {
    const rows = filtered(state.data.customers, ["name", "platform", "source", "tags", "note"]);
    return `<div class="toolbar"><form class="form-grid" data-form="customer"><input class="field" name="name" placeholder="客户名称" required /><select class="field" name="platform"><option>抖音</option><option>快手</option><option>小红书</option><option>企微</option><option>BOSS</option><option>其他</option></select><input class="field" name="source" placeholder="来源" /><input class="field" name="tags" placeholder="标签" /><button class="btn primary">新增客户</button></form>${searchBar()}</div><div class="panel"><table><thead><tr><th>客户</th><th>平台</th><th>来源</th><th>标签</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map((x) => `<tr><td><strong>${escapeHtml(x.name)}</strong><div class="hint-line">${escapeHtml(x.note)}</div></td><td>${escapeHtml(x.platform)}</td><td>${escapeHtml(x.source)}</td><td>${escapeHtml(x.tags)}</td><td><span class="status ${x.status}">${statusText[x.status] || x.status}</span></td><td><button class="btn small ghost" data-action="cycle-customer" data-id="${x.id}">改状态</button><button class="btn small danger" data-action="delete-customer" data-id="${x.id}">删除</button></td></tr>`).join("") || `<tr><td colspan="6"><div class="empty">没有客户数据</div></td></tr>`}</tbody></table></div>`;
  }

  function taskItem(x) {
    return `<div class="list-item"><div><div class="item-title">${escapeHtml(x.title)}</div><div class="item-meta">${escapeHtml(x.type)} · ${escapeHtml(x.scheduledAt)} · ${escapeHtml(x.content)}</div></div><div class="toolbar-right"><span class="status ${x.status}">${statusText[x.status] || x.status}</span><button class="btn small ghost" data-action="cycle-task" data-id="${x.id}">改状态</button><button class="btn small danger" data-action="delete-task" data-id="${x.id}">删除</button></div></div>`;
  }

  function tasks() {
    const rows = filtered(state.data.tasks, ["title", "type", "content"]);
    return `<div class="toolbar"><form class="form-grid" data-form="task"><input class="field wide" name="title" placeholder="任务标题" required /><select class="field" name="type"><option>跟进</option><option>群发</option><option>素材整理</option><option>内容发布</option></select><input class="field" type="date" name="scheduledAt" value="${today()}" /><button class="btn primary">新增任务</button></form>${searchBar()}</div><div class="panel"><div class="section-body">${rows.map(taskItem).join("") || `<div class="empty">没有任务数据</div>`}</div></div>`;
  }

  function materials() {
    const rows = filtered(state.data.materials, ["title", "type", "tags", "localPath", "content"]);
    return `<div class="toolbar"><form class="form-grid" data-form="material"><input class="field wide" name="title" placeholder="素材标题" required /><select class="field" name="type"><option>文案</option><option>图片</option><option>视频</option><option>音频</option></select><input class="field wide" name="localPath" placeholder="本地路径" /><input class="field" name="tags" placeholder="标签" /><button class="btn primary">新增素材</button></form>${searchBar()}</div><div class="panel"><table><thead><tr><th>标题</th><th>类型</th><th>标签</th><th>路径/内容</th><th>操作</th></tr></thead><tbody>${rows.map((x) => `<tr><td><strong>${escapeHtml(x.title)}</strong></td><td><span class="tag blue">${escapeHtml(x.type)}</span></td><td>${escapeHtml(x.tags)}</td><td>${escapeHtml(x.localPath || x.content)}</td><td><button class="btn small danger" data-action="delete-material" data-id="${x.id}">删除</button></td></tr>`).join("") || `<tr><td colspan="5"><div class="empty">没有素材数据</div></td></tr>`}</tbody></table></div>`;
  }

  function settings() {
    return `<div class="grid two-col"><div class="panel"><div class="section-head"><h2>数据管理</h2></div><div class="section-body"><button class="btn primary" data-action="export">导出 JSON</button> <label class="btn ghost">导入 JSON<input class="hidden" type="file" accept="application/json" data-action="import" /></label> <button class="btn danger" data-action="clear">清空本地数据</button></div></div><div class="panel"><div class="section-head"><h2>本地状态</h2></div><div class="section-body"><p>客户：${state.data.customers.length}</p><p>任务：${state.data.tasks.length}</p><p>素材：${state.data.materials.length}</p><p class="hint-line">数据库：${escapeHtml(state.dbPath)}</p></div></div></div>`;
  }

  function render() {
    const pages = { dashboard, customers, tasks, materials, settings };
    document.getElementById("app").innerHTML = shell((pages[state.view] || dashboard)());
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `super-employee-local-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener("submit", async (event) => {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (form.dataset.form === "customer") await state.db.createCustomer({ ...data, status: "pending", note: "" });
    if (form.dataset.form === "task") await state.db.createTask({ ...data, status: "pending", content: "" });
    if (form.dataset.form === "material") await state.db.createMaterial({ ...data, content: "" });
    await reload();
    render();
  });

  document.addEventListener("input", (event) => {
    if (event.target.dataset.action === "search") {
      state.query = event.target.value;
      render();
      const input = document.querySelector('[data-action="search"]');
      if (input) input.focus();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.dataset.action === "import" && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async () => { await state.db.importData(JSON.parse(reader.result)); await reload(); render(); };
      reader.readAsText(event.target.files[0]);
    }
  });

  document.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-view], [data-action]");
    if (!target) return;
    if (target.dataset.view) { state.view = target.dataset.view; state.query = ""; render(); return; }
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (action === "export") return exportData();
    if (action === "reset-search") state.query = "";
    if (action === "clear" && confirm("确定清空本地数据？")) await state.db.clearData();
    if (action === "cycle-customer") await state.db.cycleCustomerStatus(id);
    if (action === "cycle-task") await state.db.cycleTaskStatus(id);
    if (action === "delete-customer") await state.db.deleteCustomer(id);
    if (action === "delete-task") await state.db.deleteTask(id);
    if (action === "delete-material") await state.db.deleteMaterial(id);
    await reload();
    render();
  });

  reload().then(render).catch((error) => alert(`启动失败：${error.message || error}`));
})();
