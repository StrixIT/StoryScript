
const gameName = require('./gameName.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        storyscript: './src/UI/main.ts'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css?$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".css"],
        alias: {
            storyScript: path.resolve(__dirname, '../src/Engine'),
            game: path.resolve(__dirname, `../src/Games/${gameName}/`)
        }
    },
    node: { fs: 'empty' },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/UI/index.html'
        }),
        new CopyWebpackPlugin([{ 
            from: path.resolve(__dirname, `../src/Games/${gameName}/resources`),
            to: 'resources'
        },
        { 
            from: path.resolve(__dirname, `../src/Games/${gameName}/gameinfo.json`),
            to: '[name].[ext]'
        }])
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '-',
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: 'vendor'
                }
            }
        }
    }
};