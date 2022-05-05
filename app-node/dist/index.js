var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module2) {
    module2.exports = {
      name: "freecp",
      version: "1.0.0",
      description: "node",
      bin: "./dist/index.js",
      scripts: {
        build: "node build.js",
        test: 'echo "Error: no test specified" && exit 1'
      },
      files: [
        "index.js"
      ],
      keywords: [
        "node"
      ],
      author: "yiyi",
      license: "MIT",
      dependencies: {
        chalk: "^4.1.0",
        commander: "^9.2.0",
        "fs-extra": "^10.1.0",
        inquirer: "^8.2.4",
        yargs: "^17.4.1"
      },
      devDependencies: {
        esbuild: "^0.14.38"
      }
    };
  }
});

// index.js
var chalk = require("chalk");
var { Command } = require("commander");
var fs = require("fs-extra");
var pkg = require_package();
var path = require("path");
var inquirer = require("inquirer");
function init() {
  const program = new Command();
  program.command(pkg.name).version(pkg.version).description("cp info ").usage(`${chalk.green("<origin-path dest-path >")} [options]`).arguments("<origin-path> <dest-path>", "copy files").option("-d, --dest <new path>", "new path").option("-r, --rename <new name>", "rename files").action((origin, dest, options) => {
    checkFile(origin, dest);
  });
  program.parse();
}
function checkFile(origin, dest) {
  const cwd = process.cwd();
  origin = path.isAbsolute(origin) ? origin : path.join(cwd, origin);
  dest = path.isAbsolute(dest) ? dest : path.join(cwd, dest);
  const fileInfo = fs.statSync(origin);
  if (!fs.existsSync(origin)) {
    console.error("\u539F\u8DEF\u5F84\u4E0D\u5B58\u5728");
  } else {
    if (!fs.existsSync(dest)) {
      fs.mkdirpSync(dest);
      if (fileInfo.isFile()) {
        cpFile(origin, path.resolve(dest, path.basename(origin)));
      } else {
        cpDirFile(origin, dest);
      }
    } else {
      if (fileInfo.isFile()) {
        cpFile(origin, path.resolve(dest, path.basename(origin)));
      } else {
        cpDirFile(origin, dest);
      }
    }
  }
}
function cpFile(origin, dest) {
  fs.copyFileSync(origin, dest);
}
function cpDirFile(url, dest) {
  const currentFiles = fs.readdirSync(url);
  if (currentFiles.length == 0) {
  } else {
  }
  currentFiles.forEach((item) => {
    let fileUrl = path.resolve(url, item);
    let info = fs.statSync(fileUrl);
    if (info.isFile()) {
      let destPath = path.resolve(dest, item);
      if (fs.existsSync(destPath)) {
      } else {
        fs.copyFileSync(fileUrl, path.resolve(dest, item));
      }
    }
    if (info.isDirectory()) {
      fs.copySync(fileUrl, path.resolve(dest, item));
    }
  });
}
init();
//# sourceMappingURL=index.js.map
