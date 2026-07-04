const asset = (name) => `./assets/imgs/${name}`;

const menuData = [
  { title: "首页", icon: "首" },
  { title: "数据总览", icon: "数" },
  { title: "本地工作台", icon: "台" },
  { title: "客户库", icon: "客" },
  { title: "任务库", icon: "任" },
  { title: "素材库", icon: "素" },
  { title: "知识库", icon: "知" },
  { title: "导入导出", icon: "导" },
  { title: "开发者工具", icon: "开" },
  { title: "更新记录", icon: "更" }
];

const banners = [
  "banner1--ui.png",
  "banner2--ui.png",
  "banner3--ui.png",
  "banner4--ui.png"
];

const localFeatures = [
  {
    img: "nav_4--ui.png",
    title: "本地工作台",
    desc: "集中管理本地客户、任务和素材",
    chips: ["离线框架", "本地数据"]
  },
  {
    img: "nav_5--ui.png",
    title: "知识库",
    desc: "沉淀企业资料、话术和标准流程",
    chips: ["资料归档", "分类管理"]
  },
  {
    img: "nav_8--ui.png",
    title: "客户库",
    desc: "保存客户线索、跟进状态和备注",
    chips: ["客户资料", "状态记录"]
  },
  {
    img: "nav_9--ui.png",
    title: "任务库",
    desc: "维护待办事项、执行节点和结果",
    chips: ["任务列表", "本地跟进"]
  },
  {
    img: "nav_10--ui.png",
    title: "素材库",
    desc: "统一收纳图片、文案和文件素材",
    chips: ["文件素材", "内容资产"]
  },
  {
    img: "nav_11--ui.png",
    title: "导入导出",
    desc: "通过本地文件完成数据迁移和备份",
    chips: ["JSON", "Excel"]
  },
  {
    img: "nav_12--ui.png",
    title: "开发者工具",
    desc: "默认开启调试能力，便于二次开发",
    chips: ["DevTools", "F12"]
  },
  {
    img: "nav_6--ui.png",
    title: "更新记录",
    desc: "记录本地版本变化和后续开发事项",
    chips: ["版本日志", "开发笔记"]
  }
];

const localPages = {
  "数据总览": {
    title: "数据总览",
    kicker: "LOCAL DASHBOARD",
    metrics: [
      ["客户数量", "0"],
      ["任务数量", "0"],
      ["素材数量", "0"],
      ["知识条目", "0"]
    ],
    columns: ["模块", "状态", "说明"],
    rows: [
      ["客户库", "本地", "等待录入客户资料"],
      ["任务库", "本地", "等待创建执行任务"],
      ["素材库", "本地", "等待导入素材文件"]
    ]
  },
  "本地工作台": {
    title: "本地工作台",
    kicker: "LOCAL WORKSPACE",
    metrics: [
      ["今日待办", "0"],
      ["进行中", "0"],
      ["已完成", "0"],
      ["草稿", "0"]
    ],
    columns: ["事项", "状态", "归属"],
    rows: [
      ["客户资料整理", "未开始", "客户库"],
      ["素材归档", "未开始", "素材库"],
      ["知识条目维护", "未开始", "知识库"]
    ]
  },
  "客户库": {
    title: "客户库",
    kicker: "CUSTOMERS",
    metrics: [
      ["全部客户", "0"],
      ["待跟进", "0"],
      ["已成交", "0"],
      ["已归档", "0"]
    ],
    columns: ["客户", "状态", "备注"],
    rows: [
      ["示例客户 A", "待录入", "本地占位记录"],
      ["示例客户 B", "待录入", "本地占位记录"],
      ["示例客户 C", "待录入", "本地占位记录"]
    ]
  },
  "任务库": {
    title: "任务库",
    kicker: "TASKS",
    metrics: [
      ["全部任务", "0"],
      ["排队中", "0"],
      ["执行中", "0"],
      ["已完成", "0"]
    ],
    columns: ["任务", "状态", "更新时间"],
    rows: [
      ["创建客户清单", "未开始", "本地时间"],
      ["整理素材目录", "未开始", "本地时间"],
      ["维护知识分类", "未开始", "本地时间"]
    ]
  },
  "素材库": {
    title: "素材库",
    kicker: "ASSETS",
    metrics: [
      ["图片", "0"],
      ["文档", "0"],
      ["表格", "0"],
      ["其他", "0"]
    ],
    columns: ["素材", "类型", "说明"],
    rows: [
      ["品牌图片", "图片", "等待导入"],
      ["业务文案", "文档", "等待导入"],
      ["客户表格", "表格", "等待导入"]
    ]
  },
  "知识库": {
    title: "知识库",
    kicker: "KNOWLEDGE",
    metrics: [
      ["分类", "0"],
      ["条目", "0"],
      ["草稿", "0"],
      ["归档", "0"]
    ],
    columns: ["分类", "状态", "说明"],
    rows: [
      ["产品资料", "待维护", "本地知识分类"],
      ["服务流程", "待维护", "本地知识分类"],
      ["常见问题", "待维护", "本地知识分类"]
    ]
  },
  "导入导出": {
    title: "导入导出",
    kicker: "IMPORT EXPORT",
    metrics: [
      ["导入批次", "0"],
      ["导出批次", "0"],
      ["备份文件", "0"],
      ["恢复记录", "0"]
    ],
    columns: ["能力", "状态", "说明"],
    rows: [
      ["JSON 导入", "本地", "预留文件解析入口"],
      ["Excel 导出", "本地", "预留表格生成入口"],
      ["数据备份", "本地", "预留备份入口"]
    ]
  },
  "开发者工具": {
    title: "开发者工具",
    kicker: "DEVELOPER MODE",
    metrics: [
      ["调试模式", "开"],
      ["F12", "开"],
      ["远程接口", "0"],
      ["本地模式", "开"]
    ],
    columns: ["项目", "状态", "说明"],
    rows: [
      ["开发者工具", "已开启", "启动后自动打开 DevTools"],
      ["远程 API", "已删除", "源码不保留接口入口"],
      ["构建产物", "CI 生成", "不直接提交到仓库"]
    ]
  },
  "更新记录": {
    title: "更新记录",
    kicker: "CHANGELOG",
    metrics: [
      ["当前版本", "0.2.0"],
      ["模式", "开发"],
      ["API", "0"],
      ["CI", "启用"]
    ],
    columns: ["版本", "类型", "说明"],
    rows: [
      ["0.2.0", "开发者版", "删除远程 API 入口"],
      ["0.1.0", "框架版", "建立 Electron 桌面外壳"],
      ["后续", "本地功能", "逐步实现本地数据能力"]
    ]
  }
};

const menu = document.getElementById("menu");
const appMain = document.getElementById("appMain");
const avatarButton = document.getElementById("avatarButton");
const userMenu = document.getElementById("userMenu");

let activeTitle = "首页";
let activeBanner = 0;
let bannerTimer = null;

function renderMenu() {
  menu.innerHTML = menuData
    .map(
      (item) => `<button class="menu-item${item.title === activeTitle ? " active" : ""}" type="button" data-title="${item.title}">
        <span class="menu-icon">${item.icon}</span>
        <span class="menu-label">${item.title}</span>
      </button>`
    )
    .join("");
}

function setBannerHeight() {
  const width = Math.max(window.innerWidth - 240, 760);
  document.documentElement.style.setProperty("--banner-height", `${Math.floor(width / 5)}px`);
}

function renderHome() {
  appMain.innerHTML = `<div class="home">
    <div class="home-view">
      <div class="home-banner">
        <div class="banner-track">
          ${banners
            .map((image, index) => `<div class="banner-slide${index === activeBanner ? " active" : ""}"><img class="img-info" src="${asset(image)}" alt=""></div>`)
            .join("")}
        </div>
        <div class="banner-dots">
          ${banners.map((_, index) => `<button class="banner-dot${index === activeBanner ? " active" : ""}" type="button" data-banner="${index}"></button>`).join("")}
        </div>
      </div>

      <div class="mode-strip">
        <div>
          <div class="mode-kicker">开发者模式</div>
          <div class="mode-title">超级员工无 API 本地框架</div>
        </div>
        <div class="mode-badges">
          <span>远程接口 0</span>
          <span>本地优先</span>
          <span>CI 构建</span>
        </div>
      </div>

      <div class="local-grid">
        ${localFeatures.map(renderFeatureCard).join("")}
      </div>

      <div class="home-footer">
        <div class="home-footer-line">
          <div>AI超级员工系统</div>
          <div>开发者版 - V0.2.0</div>
        </div>
        <div class="home-footer-desc">保留桌面软件框架和本地能力，远程 API 入口已从源码删除。</div>
      </div>
    </div>
  </div>`;
}

function renderFeatureCard(item) {
  return `<button class="feature-card" type="button" data-title="${item.title}">
    <img src="${asset(item.img)}" alt="">
    <div class="feature-body">
      <div class="feature-title">${item.title}</div>
      <div class="feature-desc">${item.desc}</div>
      <div class="chip-row">
        ${item.chips.map((chip) => `<span class="chip">${chip}</span>`).join("")}
      </div>
    </div>
  </button>`;
}

function renderLocalPage(title) {
  const page = localPages[title];
  appMain.innerHTML = `<div class="local-page">
    <section class="local-panel">
      <div class="panel-head">
        <div>
          <div class="panel-kicker">${page.kicker}</div>
          <h1>${page.title}</h1>
        </div>
        <div class="developer-pill">开发者模式</div>
      </div>

      <div class="metric-grid">
        ${page.metrics.map(([label, value]) => `<div class="metric"><div class="metric-label">${label}</div><div class="metric-value">${value}</div></div>`).join("")}
      </div>

      <div class="local-toolbar">
        <div class="fake-input">本地检索</div>
        <div class="fake-select">全部状态</div>
        <button class="plain-btn" type="button">重置</button>
        <button class="primary-btn" type="button">查询</button>
      </div>

      <div class="local-table">
        <div class="table-row header">
          ${page.columns.map((column) => `<div class="cell">${column}</div>`).join("")}
        </div>
        ${page.rows
          .map((row) => `<div class="table-row">${row.map((cell, index) => `<div class="cell">${index === 1 ? `<span class="status-pill">${cell}</span>` : cell}</div>`).join("")}</div>`)
          .join("")}
      </div>
    </section>
  </div>`;
}

function setActivePage(title) {
  activeTitle = title;
  renderMenu();
  if (title === "首页") {
    renderHome();
    startBannerTimer();
    return;
  }
  stopBannerTimer();
  renderLocalPage(title);
}

function startBannerTimer() {
  stopBannerTimer();
  bannerTimer = window.setInterval(() => {
    activeBanner = (activeBanner + 1) % banners.length;
    if (activeTitle === "首页") renderHome();
  }, 4200);
}

function stopBannerTimer() {
  if (bannerTimer) {
    window.clearInterval(bannerTimer);
    bannerTimer = null;
  }
}

menu.addEventListener("click", (event) => {
  const button = event.target.closest(".menu-item");
  if (!button) return;
  setActivePage(button.dataset.title);
});

appMain.addEventListener("click", (event) => {
  const dot = event.target.closest(".banner-dot");
  if (dot) {
    activeBanner = Number(dot.dataset.banner);
    renderHome();
    startBannerTimer();
    return;
  }

  const feature = event.target.closest(".feature-card");
  if (feature) setActivePage(feature.dataset.title);
});

avatarButton.addEventListener("click", () => {
  userMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#avatarButton") && !event.target.closest("#userMenu")) {
    userMenu.classList.remove("open");
  }
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-window-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.windowAction;
  const desktopWindow = window.desktopWindow;

  if (!desktopWindow) {
    if (action === "reload") window.location.reload();
    return;
  }

  if (action === "reload") desktopWindow.reload();
  if (action === "minimize") desktopWindow.minimize();
  if (action === "maximize") desktopWindow.toggleMaximize();
  if (action === "close") desktopWindow.close();
});

userMenu.addEventListener("click", (event) => {
  const page = event.target.dataset.page;
  if (page) setActivePage(page);
  userMenu.classList.remove("open");
});

window.addEventListener("resize", setBannerHeight);

setBannerHeight();
renderMenu();
renderHome();
startBannerTimer();
