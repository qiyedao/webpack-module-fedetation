const http = require('http');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const port = 8520;

let obj = {
    1: 1,
    2: 2,
    a: {
        2: 2,
    },
};
console.log(JSON.stringify(obj, null, 2));
const server = http.createServer((req, res) => {
    req.on('data', chunk => {
        console.log(`可用的数据块: ${chunk}`);
    });
    req.on('end', () => {
        //数据结束
        console.log('end');
    });
    const stream = fs.createReadStream(__dirname + '/index.js', 'utf-8');
    let args = yargs(process.argv.slice(2)).parse();
    console.log(
        process.argv,
        'args',
        args,
        'NODE_ENV',
        args.NODE_ENV,
        'process.env',
        process.env.NODE_ENV
    );
    stream.pipe(res);
    let path1 = path.resolve('aa', 'index.js');
    let path2 = path.resolve('/project', 'index.js');
    let path11 = path.join('aa', 'index.js');
    let path22 = path.join('/project', 'index.js');
    console.log('path1', path1, 'path2', path2);
    console.log('path12', path11, 'path22', path22);

    console.log(
        path.dirname(__dirname + '/index.js'),
        '__dirname',
        path.extname(__dirname + '/index.js')
    );
});
server.listen(port, () => {
    console.log('hostname', port);
});
