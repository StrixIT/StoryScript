import path from 'path';
import { resolve as _resolve } from 'path';
import {fileURLToPath} from 'url';
import gameName from '../gameName.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const mode = 'development';

export const output = {
    filename: '[name].[fullhash].js',
    path: _resolve(__dirname, '../dist')
};
export const module = {
    rules: [
        {
            // Match `.js`, `.jsx`, `.ts` or `.tsx` files
            test: /\.[jt]sx?$/,
            loader: 'esbuild-loader',
            options: {
                target: 'ES2022',
                tsconfig: './src/tsconfig.json'
            },
            exclude: /node_modules/
        },
        {
            test: /\.html$/,
            use: 'raw-loader'
        }
    ]
};
export const resolve = {
    extensions: [".ts", ".js", ".css"],
    alias: {
        storyScript: _resolve(__dirname, '../src/Engine'),
        game: _resolve(__dirname, `../src/Games/${gameName}/`)
    }
};

export default {
    mode: mode,
    module: module,
    output: output,
    resolve: resolve
}