import fs from 'fs';
import {defineConfig, normalizePath} from 'vite';
import checker from 'vite-plugin-checker';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import {visualizer} from "rollup-plugin-visualizer";
import gameName from './currentGameName.js';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import jsonfile from "jsonfile";
import { VitePWA } from 'vite-plugin-pwa'

const {readFileSync} = jsonfile;
const gamePath = path.resolve(import.meta.dirname, `./src/Games/${gameName}`);
const uiPath = path.resolve(import.meta.dirname, `./src/UI`);
const srcPath = path.resolve(import.meta.dirname, `./src`);
const gameInfoPath = `${gamePath}/webroot/gameinfo.json`;

let gameInfo;

if (fs.existsSync(gameInfoPath)) {
    gameInfo = readFileSync(gameInfoPath);
}

function runPostBuild() {
    return {
        name: 'run-postbuild',
        apply: 'build',
        async writeBundle() {
            const { postBuild } = await import('./postbuild.js');
            await postBuild();
        },
    }
}

const plugins = [
    {
        name: 'set-game-name-and-description',
        transformIndexHtml(html: string) {
            return gameInfo ? html
                .replace(/%STORYSCRIPT_GAME_NAME%/g, gameInfo.name)
                .replace(/%STORYSCRIPT_GAME_DESCRIPTION%/g, gameInfo.description) : html;
        }
    },
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
                rename: {stripBase: 4}
            }
        ]
    }),
    runPostBuild(),
    VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
            enabled: true
        },workbox: {
            globDirectory: 'dist',
            globPatterns: [
                'assets/**/*',
                'resources/**/*',
                'index.html',
                'manifest.webmanifest',
            ],
        }
    }),
    visualizer()
];

export default defineConfig({
    base: ``,
    publicDir: path.resolve(gamePath, 'webroot'),
    define: {
        'process.env': {}
    },
    resolve: {
        alias: {
            storyScript: path.resolve(import.meta.dirname, './src/Engine'),
            game: gamePath,
            ui: uiPath,
            src: srcPath,
            $resources: path.resolve(gamePath, 'resources')
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                logger: {
                    warn() {
                    } // Suppress all warnings to silence bootstrap issues. Try removing this when bootstraps upgrades to 5.4+.
                },
            },
        },
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