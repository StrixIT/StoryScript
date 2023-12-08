import gameName from '../gameName.js';
import { resolve } from 'path';

import jsonfile from 'jsonfile';
const { readFileSync } = jsonfile;

import { __dirname } from './webpack.base.js';

// Todo: enable this
//import  * as _module from './webpack.common.js';
import RemovePlugin from 'remove-files-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// Todo: enable this
//import { ImageminPlugin } from 'imagemin-webpack-plugin';
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';

import minicss from 'mini-css-extract-plugin';
const { loader: _loader } = minicss;

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

const gameInfo = readFileSync(resolve(__dirname, `../src/Games/${gameName}`, 'gameinfo.json'));
const cleanConfig = {
    before: {
        include: [resolve(__dirname, '../dist')]
    }
};

const terser = new TerserPlugin({
    parallel: true,
    terserOptions: {
        keep_fnames: true,
        sourceMap: true
    }
});

var plugins = [
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[name].[contenthash].css',
    }),
    terser,
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

// Todo: enable this
// This assumes the first rule imported is the css rule. Enable the log statement to check.
//var cssRule = _module.rules.pop();
//console.log(cssRule);

export default {
    extends: resolve(__dirname, './webpack.common.js'),
    output: {
        filename: '[name].[contenthash].js'
    },
    mode: 'production',
    //devtool: 'source-map',
    optimization: {
        minimizer: [terser, new OptimizeCSSAssetsPlugin({})],
        nodeEnv: 'production'
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [_loader, {  
                loader: 'css-loader',
                options: {
                    url: false
                }
            }],
          },
        ],
      },
    plugins: plugins
};