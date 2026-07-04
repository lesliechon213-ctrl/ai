const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "app.js",
  "index.html",
  "main.js",
  "preload.js",
  "styles.css",
  "package.json",
  ".gitignore",
  ".github/workflows/windows-build.yml",
  "assets/imgs/logo--logo.png",
  "assets/imgs/logo_2--logo.png",
  "assets/imgs/banner1--ui.png",
  "assets/imgs/nav_12--ui.png"
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }
}

const pkg = JSON.parse(readText("package.json"));
if (pkg.main !== "main.js") fail("package.json main must be main.js.");
if (!pkg.scripts || !pkg.scripts["package:win"]) fail("Missing package:win script.");
if (!pkg.scripts["package:win"].includes("AI超级员工系统")) {
  fail("Windows package name must be valid UTF-8 Chinese: AI超级员工系统.");
}

const app = readText("app.js");
const html = readText("index.html");
const main = readText("main.js");
const css = readText("styles.css");
const combined = `${app}\n${html}\n${main}\n${css}`;

const deletedWords = [
  "AI创作",
  "AI拓客",
  "AI个微",
  "AI企微",
  "AI人事",
  "AI法务",
  "账号激活码",
  "算力消费",
  "自动工作流",
  "一键追爆",
  "BOSS"
];

for (const word of deletedWords) {
  if (combined.includes(word)) fail(`Deleted API product entry still present: ${word}`);
}

const removedByCssRule = new RegExp(["display", "\\s*:\\s*", "none"].join(""), "i");
const invisibleFlagRule = new RegExp(["\\b", "hid", "den", "\\b"].join(""), "i");
if (removedByCssRule.test(css)) fail("CSS must not keep deleted entries with invisible style rules.");
if (invisibleFlagRule.test(combined)) fail("Source must not keep deleted entries with invisible flags.");
if (!/devTools:\s*true/.test(main)) fail("Developer mode must keep Electron DevTools enabled.");
if (!main.includes("SMOKE_READY")) fail("Smoke readiness marker is required.");

const largeFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const rel = path.relative(root, fullPath).replace(/\\/g, "/");
    if (rel.startsWith(".git/") || rel.startsWith("node_modules/") || rel.startsWith("dist/") || rel.startsWith("release/")) {
      continue;
    }
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    const size = fs.statSync(fullPath).size;
    if (size > 50 * 1024 * 1024) largeFiles.push(`${rel} (${Math.round(size / 1024 / 1024)} MB)`);
  }
}
walk(root);

if (largeFiles.length) fail(`Large source files found: ${largeFiles.join(", ")}`);

if (failures.length) {
  console.error("Compatibility check failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Compatibility check passed.");
