import { __dirname } from './webpack.base.js';
import { join, resolve } from 'path';

export default {
    extends: resolve(__dirname, './webpack.common.js'),
    devtool: 'source-map',
    devServer: {
        static: { directory: join(__dirname, "../dist/") },
        port: 9000,
        hot: true,
        open: true
    }
};