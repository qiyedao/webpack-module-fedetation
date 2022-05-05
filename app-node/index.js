const chalk = require('chalk');
const { Command } = require('commander');
const fs = require('fs-extra');
const pkg = require('./package.json');
const path = require('path');
const inquirer = require('inquirer');
let name;
function init() {
    const program = new Command();
    program
        .command(pkg.name)
        .version(pkg.version)
        .description('cp info ')
        .usage(`${chalk.green('<origin-path dest-path >')} [options]`)
        .arguments('<origin-path> <dest-path>', 'copy files')
        .option('-d, --dest <new path>', 'new path')
        .option('-r, --rename <new name>', 'rename files')

        .action((origin, dest, options) => {
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
        console.error('原路径不存在');
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
        // console.error('目录下没有文件', url);
    } else {
        // console.error('目录下有文件', url);
    }
    currentFiles.forEach(item => {
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
