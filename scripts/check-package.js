const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const failures = [];

function fail(message) {
  failures.push(message);
}

if (!fs.existsSync(dist)) {
  fail("dist directory was not created.");
} else {
  const apps = fs.readdirSync(dist, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  if (apps.length === 0) {
    fail("No packaged app directory found in dist.");
  }

  for (const appDir of apps) {
    const full = path.join(dist, appDir.name);
    const files = fs.readdirSync(full);
    const exe = files.find((file) => file.endsWith(".exe"));
    if (!exe) fail(`No .exe found in ${appDir.name}.`);
    const appResource = path.join(full, "resources", "app");
    if (!fs.existsSync(path.join(appResource, "main.js"))) fail(`Packaged app is missing resources/app/main.js in ${appDir.name}.`);
    if (fs.existsSync(path.join(appResource, "release"))) fail(`Packaged app must not include release directory in ${appDir.name}.`);
    if (fs.existsSync(path.join(appResource, "dist"))) fail(`Packaged app must not include nested dist directory in ${appDir.name}.`);
  }
}

if (failures.length) {
  console.error("Package check failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Package check passed.");
