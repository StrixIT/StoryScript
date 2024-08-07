import path from 'path';
import gameName from '../gameName.js';
import { __dirname } from './webpack.base.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export default {
    extends: path.resolve(__dirname, './webpack.base.js'),
    entry: {
        storyscript: './src/UI/main.ts'
    },
    module: {
        rules: [
            {
                test: /\.css?$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { url: false }
                    }
                ]
            },
            // This is used to remove the script tag used by Vite when working with Webpack.
            {
                test: /index.html$/,
                loader: 'string-replace-loader',
                options: {
                    search: '<script type="module" src="/src/ui/main.ts"></script>',
                    replace: '',
                }
            }
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, `../src/Games/${gameName}/resources`),
                    to: 'resources',
                    noErrorOnMissing: true
                },
                {
                    from: path.resolve(__dirname, `../src/Games/${gameName}/gameinfo.json`),
                    to: '[name][ext]'
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[name].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            template: 'index.html'
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
}