const gameName = require('./gameName.js');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const jf = require('jsonfile');
const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const gameInfo = jf.readFileSync(path.resolve(__dirname, `../src/Games/${gameName}`, 'gameinfo.json'));
var plugins = [];

if (gameInfo.sourcesIncluded) {
    plugins.push(new CopyWebpackPlugin([{ 
        from: path.resolve(__dirname, `../src/Games/${gameName}`),
        to: 'sources'
    }]));

    plugins.push(new ZipPlugin({
        filename: 'sources.zip',
        include: 'sources'
    }));
}

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    plugins
});