const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

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
        }),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i 
        })
    ]
});