
const gameName = require('../gameName.js');
const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(base, {
    entry: {
        storyscript: './src/UI/main.ts'
    },
    module: {
        rules: [
            {
                test: /\.css?$/,
                use: [
                    'style-loader',
                    {  
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/UI/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, `../src/Games/${gameName}/resources`),
                to: 'resources',
                noErrorOnMissing: true
            },
            { 
                from: path.resolve(__dirname, `../src/Games/${gameName}/gameinfo.json`),
                to: '[name].[ext]'
            }
        ]})
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
});