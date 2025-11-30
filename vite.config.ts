import {defineConfig, normalizePath} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import {visualizer} from "rollup-plugin-visualizer";
import gameName from './gameName.js';
import path from 'path';
import vue from '@vitejs/plugin-vue';

const gamePath = path.resolve(__dirname, `./src/Games/${gameName}`);
const uiPath = path.resolve(__dirname, `./src/UserInterface`);
const resourceRegex = process.platform === 'linux' ? /\/resources\/(.{1,}\.)/ : /\\resources\\(.{1,}\.)/;

const plugins = [
    tsconfigPaths(),
    vue(),
    checker({
        typescript: true,
        vueTsc: true
    }),
    viteStaticCopy({
        watch: {
            reloadPageOnChange: true
        },
        silent: true,
        targets: [
            {
                src: normalizePath(path.resolve(gamePath, 'resources/**/*.*')),
                dest: 'resources',
                rename: (_, extension, fullPath) => {
                    const match = fullPath.match(resourceRegex)[1];
                    return match + extension;
                }
            }
        ]
    }),
    visualizer() as Plugin
];

// https://vitejs.dev/config/
export default defineConfig({
    base: ``,
    define: {
        'process.env': {}
    },
    resolve: {
        alias: {
            storyScript: path.resolve(__dirname, './src/Engine'),
            game: gamePath,
            ui: uiPath,
            $resources: path.resolve(gamePath, 'resources')
        }
    },
    plugins: plugins,
    server: {
        port: 3000,
        open: true
    },
    preview: {
        port: 8080,
    },
    esbuild: {
        keepNames: true
    },
    build: {
        target: 'esNext',
        outDir: "./dist",
        sourcemap: false
    }
})