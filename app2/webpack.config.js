const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        static: path.join(__dirname, 'dist'),
        port: 8521,
    },
    output: {
        publicPath: 'auto',
    },
    // resolve: {
    //     fallback: {
    //         zlib: require.resolve('browserify-zlib'),
    //         url: require.resolve('url'),
    //         buffer: require.resolve('buffer/'),
    //         util: require.resolve('util/'),
    //         crypto: require.resolve('crypto-browserify/'),
    //         http: require.resolve('stream-http'),
    //         https: require.resolve('https-browserify'),
    //         stream: require.resolve('stream-browserify'),
    //     },
    // },

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
    plugins: [
        // To learn more about the usage of this plugin, please visit https://webpack.js.org/plugins/module-federation-plugin/
        new ModuleFederationPlugin({
            name: 'app2',
            filename: 'remoteEntry.js',
            exposes: {
                './App': './src/App',
                './Button': './src/Button',
            },
            shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
};
