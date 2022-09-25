const fs = require("fs");
const { execSync } = require("child_process");

fs.rmSync("./dist", { recursive: true, force: true });
execSync("npm run compile", { stdio: "inherit" });
fs.copyFileSync("./package.json", "./dist/package.json");
fs.copyFileSync("./README.md", "./dist/README.md");
