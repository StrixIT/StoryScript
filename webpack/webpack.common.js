import gameName from '../gameName.js';
import { resolve } from 'path';
import { __dirname } from './webpack.base.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
    extends: resolve(__dirname, './webpack.base.js'),
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
            template: 'index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: resolve(__dirname, `../src/Games/${gameName}/resources`),
                to: 'resources',
                noErrorOnMissing: true
            },
            { 
                from: resolve(__dirname, `../src/Games/${gameName}/gameinfo.json`),
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
}