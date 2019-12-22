const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new RemovePlugin({
            before: {
                include: [path.resolve(__dirname, '../dist')]
            }
        })
    ]
});