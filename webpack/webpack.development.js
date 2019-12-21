const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, "../../dist/"),
        port: 9000,
        hot: true
    }
});