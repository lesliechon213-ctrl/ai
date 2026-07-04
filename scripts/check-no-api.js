const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = [
  "app.js",
  "index.html",
  "main.js",
  "preload.js",
  "styles.css",
  "package.json"
];

const blocked = [
  ["ax", "ios"].join(""),
  ["f", "etch\\("].join(""),
  ["XML", "Http", "Request"].join(""),
  ["/", "sale", "/"].join(""),
  ["htt", "ps?://"].join(""),
  ["display", "\\s*:\\s*", "none"].join("")
].map((source) => new RegExp(source, "i"));

const failures = [];

for (const file of files) {
  const fullPath = path.join(root, file);
  const content = fs.readFileSync(fullPath, "utf8");

  for (const rule of blocked) {
    if (rule.test(content)) {
      failures.push(`${file}: ${rule.source}`);
    }
  }
}

if (failures.length > 0) {
  console.error("No-API source check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("No-API source check passed.");
