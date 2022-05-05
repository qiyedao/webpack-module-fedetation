const chalk = require('chalk');
const { Command } = require('commander');
const fs = require('fs-extra');
const pkg = require('./package.json');
const path = require('path');
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
            console.log('origin', path.isAbsolute(origin), 'dest', dest, '======');
            const cwd = process.cwd();
            console.log('path.join(cwd, origin)', path.join(cwd, origin));
            origin = path.isAbsolute(origin) ? origin : path.join(cwd, origin);
            dest = path.isAbsolute(dest) ? dest : path.join(cwd, dest);
            console.log('origin', origin, 'dest', dest, 'options', options, __dirname);
            return;
            if (!fs.existsSync(origin)) {
                console.log('原路径不存在');
            } else {
                if (!fs.existsSync(dest)) {
                    fs.mkdirpSync(dest);
                    fs.copyFileSync(origin, dest, function (err) {
                        console.log('err', err);
                        if (err) return console.error(err);
                        console.log('success!');
                    });
                } else {
                    fs.copyFileSync(origin, dest, function (err) {
                        console.log('err', err);
                        if (err) return console.error(err);
                        console.log('success!');
                    });
                }
            }
        });
    program.parse();
}
init();
