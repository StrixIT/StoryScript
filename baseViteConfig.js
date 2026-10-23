import fs from 'fs';
import {normalizePath} from 'vite';
import checker from 'vite-plugin-checker';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import {visualizer} from "rollup-plugin-visualizer";
import path from 'path';
import vue from '@vitejs/plugin-vue';
import jsonfile from "jsonfile";
import {VitePWA} from 'vite-plugin-pwa'
import {gameName} from "./helpers.js";
import {rootFolder} from "./helpers.js";

const {readFileSync} = jsonfile;

const srcPath = `${rootFolder}/src`;
const gamePath = path.resolve(rootFolder, `./src/Games/${gameName}`);
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
            const {postBuild} = await import('./scripts/postbuild.js');
            await postBuild();
        },
    }
}

const getBaseViteConfig = () => ({
    base: ``,
    publicDir: path.resolve(gamePath, 'webroot'),
    define: {
        'process.env': {}
    },
    resolve: {
        alias: {
            src: srcPath,
            game: gamePath,
            $resources: path.resolve(gamePath, 'resources')
        }
    },
    plugins: [
        {
            name: 'set-game-name-and-description',
            transformIndexHtml(html) {
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
                enabled: false
            }, workbox: {
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
    ],
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
});

export default getBaseViteConfig;