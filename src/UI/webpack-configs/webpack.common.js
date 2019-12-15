const gameName = 'MyRolePlayingGame';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        storyscript: './src/main.ts'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../../../', 'dist')
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
            storyScript: path.resolve(__dirname, '../../Engine'),
            game: path.resolve(__dirname, `../../Games/${gameName}/`)
        }
    },
    node: { fs: 'empty' },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CopyWebpackPlugin([{ 
            from: `../Games/${gameName}/resources`,
            to: 'resources' 
        }])
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '-',
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: 'vendor',
                    enforce: true
                }
            }
        }
    }
};