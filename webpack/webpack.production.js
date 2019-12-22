const gameName = require('./gameName.js');
const path = require('path');
const jf = require('jsonfile');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const RemovePlugin = require('remove-files-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const gameInfo = jf.readFileSync(path.resolve(__dirname, `../src/Games/${gameName}`, 'gameinfo.json'));
const cleanConfig = {
    before: {
        include: [path.resolve(__dirname, '../dist')]
    }
};

var plugins = [
        new TerserPlugin({
            terserOptions: {
                parallel: true,
                keep_fnames: true
            }
        }),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i 
        })
    ];

if (gameInfo.sourcesIncluded) {
    cleanConfig['after'] = {
        include: ['dist/sources']
    };

    plugins.push(new CopyWebpackPlugin([{ 
        from: path.resolve(__dirname, `../src/Games/${gameName}`),
        to: 'sources'
    }]));

    plugins.push(new ZipPlugin({
        filename: 'sources.zip',
        include: 'sources'
    }));
}

plugins.push(new RemovePlugin(cleanConfig));

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    plugins: plugins
});