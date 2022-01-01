
const gameName = require('../gameName.js');
const path = require('path');

module.exports = {
    mode: 'development',
    output: {
        filename: '[name].[fullhash].js',
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
    }
};