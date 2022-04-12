const path = require('path');

module.exports = {
    mode: 'development',
    entry: './server/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve('server/build'),
    },
    target: 'node',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react'],
                },
            },
        ],
    },
};
