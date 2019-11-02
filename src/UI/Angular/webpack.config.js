const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack-configs/webpack.common');

module.exports = (env) => {
    const envConfig = require(`./webpack-configs/webpack.development.js`);

    return webpackMerge.smart(commonConfig, envConfig);
}