const process = require("process");
const child_process = require("child_process");
const fs = require("fs");
const fse = require("fs-extra");
const { vscodeVersion } = require("./package.json");

function error(msg) {
  console.info("\x1b[31merror %s\x1b[0m", msg);
}
function ok(msg) {
  console.info("\x1b[32m%s\x1b[0m", msg);
}
function note(msg) {
  console.info("\x1b[90m%s\x1b[0m", msg);
}
function exec(cmd, opts) {
  console.info("\x1b[36m%s\x1b[0m", cmd);
  return child_process.execSync(cmd, opts);
}

const requiredTools = ["node", "npm", "git", "python"];
note(`required tools ${JSON.stringify(requiredTools)}`);
for (const tool of requiredTools) {
  try {
    child_process.execSync(`${tool} --version`, { stdio: "ignore" });
  } catch (e) {
    error(`"${tool}" is not available.`);
    process.exit(1);
  }
}
ok("required tools installed");

const node_version_out = child_process.execSync(`node -v`);
const node_version = node_version_out.toString().trim();
if (node_version < "v20.0") {
  error(`Want node > 20. Got "${node_version}"`);
  process.exit(1);
}

if (!fs.existsSync("vscode")) {
  note("cloning vscode");
  exec(
    `git clone --depth 1 https://github.com/microsoft/vscode.git -b ${vscodeVersion}`,
    {
      stdio: "inherit",
    }
  );
} else {
  ok("vscode already installed");
  note("delete vscode folder to clone again");
}

note("changing directory to vscode");
process.chdir("vscode");

if (!fs.existsSync("node_modules")) {
  exec("npm ci", {
    stdio: "inherit",
    env: {
      ...process.env,
      ELECTRON_SKIP_BINARY_DOWNLOAD: 1,
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1,
    },
  });
} else {
  ok("node_modules exists. Skipping npm ci");
}

// Compile
note("starting compile");
const gulp = "node --max-old-space-size=8192 --optimize-for-size ./node_modules/gulp/bin/gulp.js"
exec(`${gulp} vscode-web-min`, { stdio: "inherit" });
exec(`${gulp} minify-vscode-reh-web`, { stdio: "inherit"});
ok("compile completed");

// Extract compiled files
if (fs.existsSync("../dist")) {
  note("cleaning ../dist");
  fs.rmdirSync("../dist", { recursive: true });
} else {
  ok("../dist did not exist. No need to clean");
}

fs.mkdirSync("../dist");
fse.copySync("./out-vscode-web-min", "../dist");
fse.copySync("./out-vscode-reh-web-min", "../dist");
ok("copied ../vscode-web to ../dist");
