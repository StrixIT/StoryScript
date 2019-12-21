const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    optimization: {
        minimize: true,
    },
    plugins: [
        new TerserPlugin({
            terserOptions: {
                parallel: true,
                keep_fnames: true,
                sourceMap: true,
            }
        })
    ]
});