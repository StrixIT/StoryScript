const gameName = require('../gameName.js');
const path = require('path');
const jf = require('jsonfile');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const RemovePlugin = require('remove-files-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const gameInfo = jf.readFileSync(path.resolve(__dirname, `../src/Games/${gameName}`, 'gameinfo.json'));
const cleanConfig = {
    before: {
        include: [path.resolve(__dirname, '../dist')]
    }
};

const terser = new TerserPlugin({
    terserOptions: {
        parallel: true,
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
    new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i 
    }),
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

// This assumes the first rule imported is the css rule. Enable the log statement to check.
var cssRule = common.module.rules.pop();
//console.log(cssRule);

module.exports = merge(common, {
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
            use: [MiniCssExtractPlugin.loader,                     {  
                loader: 'css-loader',
                options: {
                    url: false
                }
            }],
          },
        ],
      },
    plugins: plugins
});