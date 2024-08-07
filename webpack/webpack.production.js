import gameName from '../gameName.js';
import { __dirname } from './webpack.base.js';
import { resolve } from 'path';

import jsonfile from 'jsonfile';
import { EsbuildPlugin } from 'esbuild-loader';
import RemovePlugin from 'remove-files-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';

const { readFileSync } = jsonfile;

const gameInfo = readFileSync(resolve(__dirname, `../src/Games/${gameName}`, 'gameinfo.json'));

const cleanConfig = {
    before: {
        include: [resolve(__dirname, '../dist')]
    }
};

const plugins = [
    new ReplaceInFileWebpackPlugin([{
        dir: 'dist',
        test: [/\.js$/],
        rules: [{
            test: '/storyscript/g',
            search: /<button id="resetbutton"[^>]*>(.*?)<\/button>/g,
            replace: ''
        }, {
            test: '/storyscript/g',
            search: /<input([\\\w\s.*>"=]*)id="location-selector"[\s\S][^>]*>/gm,
            replace: ''
        }]
    }])
];

if (gameInfo.sourcesIncluded) {
    cleanConfig['after'] = {
        include: ['dist/sources']
    };

    plugins.push(new CopyWebpackPlugin({
        patterns: [{
            from: resolve(__dirname, `../src/Games/${gameName}`),
            to: 'sources'
        }]
    }));

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
    optimization: {
        minimizer: [
            new EsbuildPlugin({ keepNames: true, css: true }),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    options: {
                        encodeOptions: {
                            jpeg: {
                                quality: 100,
                            }
                        },
                    },
                }
            })
        ],
        nodeEnv: 'production'
    },
    plugins: plugins
};