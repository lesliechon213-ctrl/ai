const { spawnSync } = require("node:child_process");
const path = require("node:path");

const electronBin = path.join(
  __dirname,
  "..",
  "node_modules",
  "electron",
  "dist",
  process.platform === "win32" ? "electron.exe" : "electron",
);
const result = spawnSync(electronBin, ["."], {
  cwd: path.join(__dirname, ".."),
  env: {
    ...process.env,
    SUPER_EMPLOYEE_SMOKE: "1",
  },
  encoding: "utf8",
  timeout: 30000,
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
if (result.status !== 0) {
  process.exit(result.status || 1);
}
