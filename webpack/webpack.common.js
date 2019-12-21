const gameName = 'LanternOfWorlds';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
    entry: {
        storyscript: './src/UI/src/main.ts'
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
            to: 'resources/[path][name].[contenthash].[ext]',
            test: /(\/resources\/[\w]{1,}\/)/
        },
        { 
            from: `src/Games/${gameName}/gameinfo.json`,
            to: '[name].[ext]'
        }]),
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== 'production',
            test: /\.(jpe?g|png|gif|svg)$/i 
        })
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