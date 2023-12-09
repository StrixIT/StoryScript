import gameName from '../gameName.js';
import { resolve } from 'path';

import jsonfile from 'jsonfile';
const { readFileSync } = jsonfile;

import { __dirname } from './webpack.base.js';

import RemovePlugin from 'remove-files-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// Todo: enable this
//import { ImageminPlugin } from 'imagemin-webpack-plugin';
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';

import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import { EsbuildPlugin } from 'esbuild-loader';

const gameInfo = readFileSync(resolve(__dirname, `../src/Games/${gameName}`, 'gameinfo.json'));

const cleanConfig = {
    before: {
        include: [resolve(__dirname, '../dist')]
    }
};

var plugins = [
    // Todo: enable this
    // new ImageminPlugin({
    //     test: /\.(jpe?g|png|gif|svg)$/i 
    // }),
    new ReplaceInFileWebpackPlugin([{
        dir: 'dist',
        test: [/\.js$/],
        rules: [{
            test: '/storyscript/g',
            search: /<button id="resetbutton"[^>]*>(.*?)<\/button>/g,
            replace: ''
        },
        {
            test: '/storyscript/g',
            search: /autoBackButton\s*:[!\s\w]*,/g,
            replace: ''
        }]
    }])
];

if (gameInfo.sourcesIncluded) {
    cleanConfig['after'] = {
        include: ['dist/sources']
    };

    plugins.push(new CopyWebpackPlugin({ patterns: [{
        from: resolve(__dirname, `../src/Games/${gameName}`),
        to: 'sources'
    }]}));

    plugins.push(new ZipPlugin({
        filename: 'sources.zip',
        include: 'sources'
    }));
}

plugins.push(new RemovePlugin(cleanConfig));

export default {
    extends: resolve(__dirname, './webpack.common.js'),
    output: {
        filename: '[name].[contenthash].js'
    },
    mode: 'production',
    //devtool: 'source-map',
    optimization: {
        minimizer: [new EsbuildPlugin({ keepNames: true, css: true }), new OptimizeCSSAssetsPlugin({})],
        nodeEnv: 'production'
    },
    plugins: plugins
};