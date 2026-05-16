import {defineConfig, normalizePath} from 'vite';
import checker from 'vite-plugin-checker';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import {visualizer} from "rollup-plugin-visualizer";
import gameName from './currentGameName.js';
import path from 'path';
import vue from '@vitejs/plugin-vue';

const gamePath = path.resolve(__dirname, `./src/Games/${gameName}`);
const uiPath = path.resolve(__dirname, `./src/UI`);

const plugins = [
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
                // This is relative to the project root. So ./src/Games/{GameName}/resources will be trimmed. We
                // cannot use 'stripBase: true' because we want to support placing resources in subdirectories.
                rename: { stripBase: 4 }
            }
        ]
    }),
    visualizer()
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
    build: {
        target: 'esnext',
        outDir: "./dist",
        sourcemap: false,
        rolldownOptions: {
            output: {
                keepNames: true
            }
        }
    }
})