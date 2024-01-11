const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../www/react'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use:
                [
                    'style-loader',
                    'css-loader',
                ],
            },
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, '../www/react'),
        compress: true,
        port: 8080,
        hot: true,
    },
    watch: true,
};
