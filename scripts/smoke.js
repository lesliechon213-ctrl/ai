const path = require("path");
const { spawn } = require("child_process");

const electron = require("electron");
const appRoot = path.resolve(__dirname, "..");

const child = spawn(electron, [appRoot], {
  cwd: appRoot,
  env: {
    ...process.env,
    SMOKE_TEST: "1",
    SUPER_EMPLOYEE_MODE: "development"
  },
  stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
const timer = setTimeout(() => {
  child.kill();
  console.error("Smoke test timed out.");
  console.error(output);
  process.exit(1);
}, 20000);

child.stdout.on("data", (chunk) => {
  output += chunk.toString();
});

child.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

child.on("exit", (code) => {
  clearTimeout(timer);
  if (code === 0 && output.includes("SMOKE_READY")) {
    console.log("Electron smoke test passed.");
    return;
  }
  console.error("Electron smoke test failed.");
  console.error(output);
  process.exit(code || 1);
});
