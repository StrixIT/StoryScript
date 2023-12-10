import path from 'path';
import {fileURLToPath} from 'url';
import gameName from '../gameName.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const mode = 'development';

export const output = {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, '../dist')
};
export const module = {
    rules: [
        {
            // Match `.js`, `.jsx`, `.ts` or `.tsx` files
            test: /\.[jt]sx?$/,
            loader: 'esbuild-loader',
            options: {
                target: 'ES2022',
                tsconfig: path.resolve(__dirname, '../tsconfig.json')
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
        storyScript: path.resolve(__dirname, '../src/Engine'),
        game: path.resolve(__dirname, `../src/Games/${gameName}/`)
    }
};

export default {
    mode: mode,
    module: module,
    output: output,
    resolve: resolve
}